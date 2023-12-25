'use strict';
var Url = require('url-parse');
const express = require('express')
const app = express()

const cors = require('cors');
const axios = require('axios');

const { PORT, serverURL, audioLocation } = require('./utils.js');
const { getMp3, getPlaylist } = require('./utils.js');
const { validateFile, DonwloadMp3, VerifyMediaFolder } = require('./utils.js');

// add cors
const corsOrigin = {
    origin: [serverURL, 'http://localhost:9090', 'http://localhost:9091', 'http://127.0.0.1:9091', 'http://192.168.45.99:9091', 'http://192.168.45.10:9091', 'http://192.168.45.99:9091'], //or whatever port your frontend is using
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOrigin))
app.use(express.static('public'))

VerifyMediaFolder();

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

    // try {
    if (playlistID) {
        var playlistURl = "https://www.youtube.com/playlist?list=" + playlistID;
        var playlist = await getPlaylist(playlistURl);
        return res.send(JSON.stringify(playlist));
    }

    if (trackID) {
        // Get mp3 file url from youtube
        var mp3 = await getMp3(inputUrl);

        // Download mp3 file to server
        var mp3File = mp3.id + ".mp3";

        if (validateFile(mp3File) == false) {
            await DonwloadMp3(mp3.url, mp3File, function (err) {
                console.log(mp3File + ' file downloaded successfully');
                mp3.url = audioLocation + mp3File;
                return res.send(JSON.stringify(mp3));
            });
        }
        else {
            console.log(mp3File + ' file exist on disk!!');
            mp3.url = audioLocation + mp3File;
            return res.send(JSON.stringify(mp3));
        }
    }
    // }
    // catch (e) {
    //     console.log(e);
    // }
    return res;
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
