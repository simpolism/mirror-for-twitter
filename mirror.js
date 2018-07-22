function addWebcamElement() {
    console.log("add webcam fired");

    // add webcam element above reply box
    var videoContainer = document.getElementById("ext-video-container");
    if (videoContainer !== null) {
        console.log("removing existing webcam container");
        videoContainer.parentNode.removeChild(videoContainer);
    }

    videoContainer = document.createElement("div");
    videoContainer.id = "ext-video-container";
    videoContainer.innerHTML = '<video style="width:100%;border-radius:8px;" autoplay="true" id="ext-video"></video>';

    var replyUsers = document.getElementsByClassName("is-fakeFocus");
    replyUsers[0].parentNode.insertBefore(videoContainer, replyUsers[0].parentNode.childNodes[0]);

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
            //vid.pause();
            vid.src = "";
            //stream.stop();
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

var prevHash = window.location.pathname;
window.setInterval(function() {
    if (window.location.pathname != prevHash) {
        prevHash = window.location.pathname;
        addEventListeners();
    }
}, 100);
