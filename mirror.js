function addWebcamElement() {
    console.log("add webcam fired");
    hideWebcamElement();

    // get focused reply box and add video above it
    var replyUsers = document.getElementsByClassName("is-fakeFocus");
    var replyParent = replyUsers[0].parentNode;
    if (replyParent.classList.contains("DMComposer-container")) {
        // take special action in DMs -- for now just disable
        return;
    }

    videoContainer = document.createElement("div");
    videoContainer.id = "ext-video-container";
    // don't you DARE @ me about this
    videoContainer.innerHTML = '<video style="width:100%;border-radius:8px;" autoplay="true" id="ext-video"></video>';

    replyParent.insertBefore(videoContainer, replyParent.childNodes[0]);

    // enable webcam
    var videoElem = document.getElementById("ext-video");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream) {
            videoElem.srcObject = stream;
        })
        .catch(function(err0r) {
            console.log("Something went wrong!");
        });
    }
}

function hideWebcamElement() {
    console.log("hide webcam fired");
    var videoContainer = document.getElementById("ext-video-container");
    if (videoContainer !== null) {
        if (videoContainer.parentElement.getElementsByClassName("condensed")) {
            console.log("removing webcam container");
            var vid = videoContainer.children[0];
            var stream = vid.srcObject;
            stream.getTracks()[0].stop();
            vid.src = "";
            videoContainer.parentNode.removeChild(videoContainer);
        }
    }
}

function addEventListeners() {
    console.log("Adding event listener!");
    let tweetBoxes = document.getElementsByClassName("tweet-form");
    for (var i = 0; i < tweetBoxes.length; ++i) {
        tweetBoxes[i].addEventListener("focusin", function() {
            window.setTimeout(addWebcamElement, 50);
        });
        tweetBoxes[i].addEventListener("focusout", function() {
            window.setTimeout(hideWebcamElement, 50);
        });
    }
}

// add at page load
addEventListeners();

// check every 100ms if URL changed and attach listeners to any new forms
var prevHash = window.location.pathname;
window.setInterval(function() {
    if (window.location.pathname != prevHash) {
        prevHash = window.location.pathname;
        addEventListeners();
    }
}, 100);
