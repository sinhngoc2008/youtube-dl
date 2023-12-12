let videoElement = document.getElementById("video");
// let server = "http://localhost:9091/api";
let server = "http://youtube.lutstore.shop/api";


var mediaPlayer = (function () {
    var isVideo = false;
    let playlistIDs = [];
    let trackIDs = [];
    let playlistIndex = 0;
    let trackIndex = -1;

    var isAudio = false;
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
        videoElement.volume = 0.2;
        playNext();
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

    var playNext = async function () {
        if (trackIDs.length === 0) return;
        if (trackIndex >= trackIDs.length) return;
        trackIndex++;

        let id = trackIDs[trackIndex];
        let url = 'https://www.youtube.com/watch?v=' + id;
        console.log('playNext', url);

        // get static url from youtube
        // let staticUrl = youtube[trackIndex];
        let staticUrl = await getMP3(url);
        console.log('staticUrl', staticUrl);
        setPlayerUrl(staticUrl.data.url);
        videoElement.play();
    };

    var playPrev = async function () {
        if (trackIDs.length === 0) return;
        if (trackIndex <= 0) return;
        trackIndex--;

        let id = trackIDs[trackIndex];
        let url = 'https://www.youtube.com/watch?v=' + id;
        console.log('playNext', url);

        // get static url from youtube
        // let staticUrl = youtube[trackIndex];
        let staticUrl = await getMP3(url);
        console.log('staticUrl', staticUrl);
        setPlayerUrl(staticUrl.data.url);
        videoElement.play();
    };

    var setPlayerUrl = function (url) {
        videoElement.src = url;
        url = url;
    };

    var addTrackID = function (id) {
        if (trackIDs.includes(id)) return;
        trackIDs.push(id);
        console.log('trackIDs', trackIDs);
    };

    var addPlaylistID = async function (id) {
        if (playlistIDs.includes(id)) return;
        playlistIDs.push(id);

        // get trackIDs from playlist
        var playlistUrl = 'https://www.youtube.com/playlist?list=' + id;
        var tracks = await getTrack(playlistUrl);
        console.log('playlistIDs', playlistIDs);
        console.log('tracks', tracks);
        tracks.data.map(track => {
            addTrackID(track.id);
        })
    };

    return {
        url: url,
        play: play,
        stop: stop,
        playNext: playNext,
        playPrev: playPrev,
        isPlaying: isPlaying,
        initSession: initSession,
        setPlayerUrl: setPlayerUrl,
        addTrackID: addTrackID,
        addPlaylistID: addPlaylistID

    };
}());

// if (typeof mediaPlayer == "undefined") mediaPlayer = {};
// console.log('mediaPlayer', mediaPlayer);

mediaPlayer.initSession('video');

function addPlaylist(_url) {

    if (_url.includes("list=")) {
        console.log("addPlaylist ====>" + _url);
        const url = new URL(_url);
        var params = new URLSearchParams(url.search);
        console.log(params.get('v'));
        console.log(params.get('list'));

        mediaPlayer.addPlaylistID(params.get('list'));

    } else {
        console.log("addTrack ====>" + _url);
        const url = new URL(_url);
        var params = new URLSearchParams(url.search);
        mediaPlayer.addTrackID(params.get('v'));
    }
}

function pressPlay() {
    console.log("pressPlay");
    mediaPlayer.play(video);
}

function pressStop() {
    console.log("pressStop");
    mediaPlayer.stop(video);
}
function pressPrevious() {
    console.log("playPrev");
    mediaPlayer.playPrev();
}
function pressNext() {
    console.log("playNext");
    mediaPlayer.playNext();
}
function onEnded() {
    console.log("onEnded");
    mediaPlayer.playNext();
}

async function getTrack(url) {
    return await axios.get(server + "/?url=" + url);
}
async function getMP3(url) {
    return await axios.get(server + "/?url=" + url);
}
function getMP4(url) {
    axios.post("url", { name: "data" }).then(function (response) {
        console.log(response)
        // do whatever you want if console is [object object] then stringify the response
    })
}