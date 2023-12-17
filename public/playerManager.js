
// if (typeof mediaPlayer == "undefined") mediaPlayer = {};
// console.log('mediaPlayer', mediaPlayer);

mediaPlayer.initSession('video');

var playerManager = (function () {
    var isPlaying = false;
    let playlistIDs = [];
    let trackIDs = [];
    let playlistIndex = -1;
    let trackIndex = -1;

    var isAudio = true;

    function addItemToPlaylistDOM(youtubeID, title, author) {
        console.log("addItemToPlaylistDOM");
        var ul = document.getElementById("playlist-ul");
        var li = document.createElement("li");
        li.setAttribute('id', youtubeID);
        var simpSource = '<span class="simp-source">' + title + '</span>';
        var simpDesc = '<span class="simp-desc">' + author + '</span>';
        li.innerHTML = simpSource + simpDesc;
        li.addEventListener('click', async function () {
            await gotoTrack(this, trackIDs, trackIndex);
        }, false);
        ul.appendChild(li);
        itemindex++;
    }

    var addPlaylistID = async function (id) {
        if (playlistIDs.includes(id)) return;
        playlistIDs.push(id);

        // get trackIDs from playlist
        var playlistUrl = 'https://www.youtube.com/playlist?list=' + id;
        var tracks = await utils.getTrack(playlistUrl);
        tracks.map(track => {
            addTrackID(track);

        })
    };
    var addTrackID = async function (track) {
        if (trackIDs.includes(track.id)) return;
        trackIDs.push(track.id);
        addItemToPlaylistDOM(track.id, track.title, track.author.name);
    };

    var PlayTrack = async function () {
        if (!isPlaying) {
            if (trackIndex < 0) {
                if (trackIDs.length === 0) return;
                if (trackIndex >= trackIDs.length) return;
                if (trackIndex < 0) trackIndex = 0;

                let id = trackIDs[trackIndex];
                let url = 'https://www.youtube.com/watch?v=' + id;
                console.log('playNext', url);

                let staticUrl = await utils.getMP3(url, id);
                console.log('staticUrl');

                console.log(staticUrl);
                mediaPlayer.setPlayerUrl(staticUrl.url);
            }
            mediaPlayer.play();
        }
        else {
            mediaPlayer.stop();
        }
        isPlaying = !isPlaying;


    }
    var StopTrack = function () {
        mediaPlayer.stop();
    }

    var NextTrack = async function () {
        isPlaying = true;
        if (trackIDs.length === 0) return;
        if (trackIndex >= trackIDs.length) return;
        trackIndex++;

        console.log('trackIndex', trackIndex);

        let id = trackIDs[trackIndex];
        let url = 'https://www.youtube.com/watch?v=' + id;
        console.log('playNext', url);

        let staticUrl = await utils.getMP3(url, id);
        console.log('staticUrl', staticUrl);
        console.log(staticUrl);
        mediaPlayer.setPlayerUrl(staticUrl.url);
        mediaPlayer.play();
    };

    var PrevTrack = async function () {
        isPlaying = true;
        if (trackIDs.length === 0) return;
        if (trackIndex <= 0) return;
        trackIndex--;

        let id = trackIDs[trackIndex];
        let url = 'https://www.youtube.com/watch?v=' + id;
        console.log('playNext', url);

        // get static url from youtube
        // let staticUrl = youtube[trackIndex];
        let staticUrl = await utils.getMP3(url);
        console.log('staticUrl', staticUrl);
        mediaPlayer.setPlayerUrl(staticUrl.url);
        mediaPlayer.play();
    };

    return {
        PlayTrack: PlayTrack,
        StopTrack: StopTrack,
        NextTrack: NextTrack,
        PrevTrack: PrevTrack,
        addPlaylistID: addPlaylistID,
        addTrackID: addTrackID,
        addItemToPlaylistDOM: addItemToPlaylistDOM
    }

}());








async function addPlaylistBtn(_url) {
    if (_url.includes("list=")) {
        console.log("addPlaylist ====>" + _url);
        const url = new URL(_url);
        var params = new URLSearchParams(url.search);
        console.log(params.get('v'));
        console.log(params.get('list'));

        playerManager.addPlaylistID(params.get('list'));

    } else {
        console.log("addTrack ====>" + _url);
        const url = new URL(_url);
        var params = new URLSearchParams(url.search);
        var id = params.get('v');
        var trackurl = 'https://www.youtube.com/watch?v=' + id;
        var tracks = await utils.getTrack(trackurl);
        playerManager.addTrackID(tracks);
    }
}

let itemindex = 0;
async function gotoTrack(evt, _trackIDs, _trackIndex) {

    var id = evt.getAttribute("id");


    console.log(_trackIndex);
    console.log(_trackIDs);

    if (_trackIDs.length === 0) return;
    if (_trackIndex >= _trackIDs.length) return;
    if (!_trackIDs.includes(id)) return
    _trackIndex = _trackIDs.indexOf(id);

    var url = 'https://www.youtube.com/watch?v=' + id;
    console.log('playNext', url);

    let staticUrl = await utils.getMP3(url, id);
    console.log('staticUrl');

    console.log(staticUrl);
    mediaPlayer.setPlayerUrl(staticUrl.url);
    mediaPlayer.play();
}



function addPlaylistItemBtn() {
    console.log("addPlaylistItem");
    var ul = document.getElementById("playlist-ul");
    var li = document.createElement("li");
    li.setAttribute('id', 'li_' + itemindex);
    li.setAttribute('youtube_id', 'youtubeID' + itemindex);
    var simpSource = '<span class="simp-source">Item Source ' + itemindex + '</span>';
    var simpDesc = '<span class="simp-desc">Description ' + itemindex + '</span>';
    li.innerHTML = simpSource + simpDesc;
    li.addEventListener('click', async function () {
        await gotoTrack(this, trackIDs, trackIndex);
    }, false);
    ul.appendChild(li);
    itemindex++;
}

function pressPlayBtn() {
    console.log("pressPlay");
    playerManager.PlayTrack();
}

function pressStopBtn() {
    console.log("pressStop");
    playerManager.StopTrack();
}
async function pressNextBtn() {
    console.log("playNext");
    await playerManager.NextTrack();
}

async function pressPreviousBtn() {
    console.log("playPrev");
    await playerManager.PrevTrack();
}

function onEnded() {
    console.log("onEnded");
    playerManager.NextTrack();
}