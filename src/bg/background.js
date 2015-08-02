// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

//var settings = new Store("settings", {
  //"sample_setting": "This is how you use Store.js to remember values"
//});

function checkDropbox(id) {
  return false;
}

function downloadDropbox(id) {
  console.log("Requesting download URL from youtube-dl server");

  url = "TESTURL"
  console.log("Got URL: " + url);

  console.log("Downloading video to dropbox");

  console.log("Done downloading video!");
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
