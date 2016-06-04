// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

//var settings = new Store("settings", {
  //"sample_setting": "This is how you use Store.js to remember values"
//});

var dbClient = new Dropbox.Client({ key: "lkksw23twi4z70n" })
dbClient.authDriver(new Dropbox.AuthDriver.ChromeExtension({
  receiverPath: "js/dropbox/chrome_oauth_receiver.html"
}));
dbClient.authenticate(function(error, client) {
  if (error) {
    console.log("Error in DB: " + error);
    return;
  }
  console.log("Auth sucessful!")
});


function checkDropbox(id) {
  return false;
}

function downloadDropbox(id) {
  console.log("Requesting download URL from youtube-dl server");
  $.get("http://localhost:8888/getJson/" + id, function(data) {
    console.log("Got URL data: " + data.dlUrl);
    console.log("Downloading video to local store")

    downloadURLBlob(data.dlUrl, function(blob) {
      console.log("Got blob! Uploading to Dropbox storage");
      dbClient.writeFile(id + ".mp4", blob, function(error, stat) {
        if (error) {
          console.log(error);
          return
        }
        console.log("Uploaded!");
      });
    })
  });
}

function downloadURLBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', data.dlUrl, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(e) {
      if (this.status == 200) {
        cb(this.response)
      } else {
        console.log(e);
      }
    }
    xhr.send();
}


chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Got message, showing page action');
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === 'newVideoID') {
      id = request.content.id;
      if (id == null)
        console.log("Got newVideoID message, but content.id was null");
      console.log("Got new video: " + id);
      if (checkDropbox(id))
        return;
      downloadDropbox(id);
    }
  }
);
