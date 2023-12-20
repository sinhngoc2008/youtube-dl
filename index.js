'use strict';
var Url = require('url-parse');
const express = require('express')
const app = express()
const port = 9091;
const hostname = "127.0.0.1";
const cors = require('cors');
const axios = require('axios');

const ytcore = require('ytdl-core');
const ytpl = require('ytpl');

const { validateFile, getMP3XMate, getMP3Cobalt, DonwloadMp3 } = require('./utils.js');


const serverURL = "http://youtube.lutstore.shop";
// const serverURL = "http://localhost:9091";
// add cors
const corsOrigin = {
    origin: [serverURL, 'http://localhost:9090', 'http://localhost:9091', 'http://127.0.0.1:9091', 'http://192.168.45.75:9091'], //or whatever port your frontend is using
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
    let audioFormats = await ytcore.filterFormats(info.formats, 'audioonly');
    let format = await ytcore.chooseFormat(audioFormats, { quality: 'highestaudio' })
    var result = { id: info.videoDetails.videoId, title: info.videoDetails.title, author: info.videoDetails.author.name, url: audioFormats[0].url, duration: format.approxDurationMs };

    var cobaltData = await getMP3Cobalt(url, info.videoDetails.videoId);
    result.url = cobaltData.url;

    // var xmateResult = await getMP3XMate(url, info.videoDetails.videoId);
    // result.url = xmateResult.d_url;

    return result;
}
// async function getMp4(url) {
//     // let url = "https://www.youtube.com/watch?v=ZBMnhsr8G7k";
//     let info = await ytcore.getInfo(url);
//     // return info.formats;
//     let audioFormats = await ytcore.filterFormats(info.formats, 'videoonly');
//     return audioFormats[0];
// }


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
        console.log(mp3);
        // return res.send(JSON.stringify(mp3));

        if (validateFile(mp3.id + ".mp3") == false) {
            await DonwloadMp3(mp3.url, mp3.id + ".mp3", function (err) {
                console.log('file downloaded successfully');
                return res.send(JSON.stringify(mp3));
            });
        }
        else {
            console.log('file exist on disk!!');
            return res.send(JSON.stringify(mp3));
        }

    }
    return res;
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
