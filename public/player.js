// let videoElement = document.getElementById("video");
let videoElement = document.getElementById("audio");
// let server = "http://localhost:9091/api";
// let server = "http://youtube.lutstore.shop/api";

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

    videoElement.volume = 0.2;

    var url = '';

    var initSession = function (type) {
        if (type === 'video') {
            isVideo = true;
        } else if (type === 'audio') {
            isAudio = true;
        }
        console.log('Session initialized');
    };

    var play = function (type) {
        videoElement.play();
    };

    var stop = function (type) {
        videoElement.pause();

        // pauseReactPlayer();
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
        videoElement.src = _url;
    };

    return {
        url: url,
        play: play,
        stop: stop,

        isPlaying: isPlaying,
        initSession: initSession,
        setPlayerUrl: setPlayerUrl

    };
}());
