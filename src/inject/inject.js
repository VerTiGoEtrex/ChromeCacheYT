triggerURLUpdate = function() {
  lastURL = null;
  ret = function() {
    // Check to see if we're on a video-watching page
    var url = document.URL;
    var youtubeRegex = /https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9_\-]{11})/g;
    match = youtubeRegex.exec(url);
    if (match != null && match[1] != null) {
      if (match[1] != lastURL) {
        console.log("Captured video ID: " + match[1]);
        lastURL = match[1];
      }
    } else {
      console.log("Failed to match URL regex :(");
    }

    // Tell background.js about the new video
    chrome.extension.sendMessage({msg: 'newVideoID', content: {id: match[1]}});
  }
  return ret;
} ();

// Add event listeners
chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      console.log("Hello from ChromeCacheYT/inject.js");
      triggerURLUpdate();
    }
  }, 10);
});

document.addEventListener('transitionend', function(e) {
    if (e.target.id === 'progress') {
      triggerURLUpdate();
    }
});
