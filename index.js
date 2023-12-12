'use strict';
var Url = require('url-parse');
const express = require('express')
const app = express()
const port = 9091;
const hostname = "127.0.0.1";
const cors = require('cors');

const ytcore = require('ytdl-core');
const ytpl = require('ytpl');

// add cors
const corsOrigin = {
    origin: ['http://localhost:9090', 'http://192.168.45.99:9090'], //or whatever port your frontend is using
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOrigin))
app.use(express.static('public'))

async function getPlaylist(url) {
    // let url = "https://www.youtube.com/watch?v=ZBMnhsr8G7k&list=PLK_D0CNUqhtSROd2NLJcTUmROV-r6pzZH";
    let playlist = await ytpl(url);
    return playlist.items;
}
async function getMp3(url) {
    // let url = "https://www.youtube.com/watch?v=ZBMnhsr8G7k";
    console.log("URL: " + url);
    let info = await ytcore.getInfo(url);
    // return info.formats;
    console.log(info.formats);

    let audioFormats = await ytcore.filterFormats(info.formats, 'audioonly');
    return audioFormats[0];
}
async function getMp4(url) {
    // let url = "https://www.youtube.com/watch?v=ZBMnhsr8G7k";
    let info = await ytcore.getInfo(url);
    // return info.formats;
    let audioFormats = await ytcore.filterFormats(info.formats, 'videoonly');
    return audioFormats[0];
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/api/', async (req, res) => {

    var inputUrl = req.url.replace("/api/?url=", "");
    console.log("Input Url: " + inputUrl);

    var url = new Url(inputUrl);
    var query = url.query;
    var params = new URLSearchParams(query);

    var playlistID = params.get("list");
    var trackID = params.get("v");
    console.log("TrackID: " + trackID);
    console.log("PlaylistID: " + playlistID);
    res.setHeader('Content-Type', 'application/json');

    if (playlistID) {
        var playlistURl = "https://www.youtube.com/playlist?list=" + playlistID;
        var playlist = await getPlaylist(playlistURl);
        try {
            return res.send(JSON.stringify(playlist));
        }
        catch (e) {
            console.log(e);
        }

    }

    if (trackID) {
        var mp3 = await getMp3(inputUrl);
        return res.send({ id: trackID, url: mp3.url });

    }
    return res;
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
