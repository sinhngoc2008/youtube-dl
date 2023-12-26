// "https://www.soundjay.com/buttons/sounds/beep-08b.mp3"
// let videoElement = document.getElementById("video");

let videoElement = document.getElementById("audio");
const player = document.getElementById('player')
const playlist = document.getElementById('playlist-ul')
const container = document.getElementById('playerreact')
const url = '';

// renderReactPlayer(container, { url, playing: true, onEnded: onEnded })

function pausePlayer() {
    renderReactPlayer(container, { url, playing: false, onEnded: onEnded })
}

function playReactPlayer(url) {
    renderReactPlayer(container, { url, playing: true, onEnded: onEnded })
}
function pauseReactPlayer(url) {
    renderReactPlayer(container, { url, playing: false, onEnded: onEnded })
}


var mediaPlayer = (function () {
    var isVideo = false;
    let playlistIDs = [];
    let trackIDs = [];
    let playlistIndex = 0;
    let trackIndex = -1;

    let url = '';
    // videoElement.volume = 0.2;



    var initSession = function (type) {
        if (type === 'video') {
            isVideo = true;
        } else if (type === 'audio') {
            isAudio = true;
        }
        console.log('Session initialized');
    };

    var play = function (type) {
        videoElement.play().catch(function (error) {
            console.log("Error: " + error);
        }).then = function () {
            console.log("then");
        }
    };

    var stop = function (type) {
        videoElement.pause();
    };

    var isPlaying = function (type) {
        if (type === 'video') {
            return isVideo;
        } else if (type === 'audio') {
            return isAudio;
        }
    };

    var setPlayerUrl = function (_url) {
        url = _url;
        console.log("_url: " + _url);
        videoElement.src = _url;
        videoElement.load();
        videoElement.play().catch(function (error) {
            console.log("Error: " + error);
        }).then = function () {
            console.log("then");
        }
    };

    var isPaused = function () {
        return videoElement.paused;
    }
    return {
        url: url,
        play: play,
        stop: stop,

        isPaused, isPaused,
        isPlaying: isPlaying,
        initSession: initSession,
        setPlayerUrl: setPlayerUrl

    };
}());
