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


const serverURL = "http://youtube.lutstore.shop";
// const serverURL = "http://localhost:9091";
// add cors
const corsOrigin = {
    origin: [serverURL, 'http://localhost:9090', 'http://localhost:9091', 'http://127.0.0.1:9091'], //or whatever port your frontend is using
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOrigin))
app.use(express.static('public'))


async function postXMate(api, header, data) {
    const param = Object.keys(data)
        .map((key) => `${key}=${encodeURIComponent(data[key])}`)
        .join('&');

    var result = await axios.post(api, param, { headers: header });
    return result.data;
}

async function getMP3XMate(url, id) {

    // step1
    var step1API = "https://x2mate.com/api/ajaxSearch";
    var step1Params = { "q": url, "vt": "home" };
    var step1Header = {
        'Referer': 'https://x2mate.com/en86',
        'Origin': 'https://x2mate.com',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'Postman-Token': '7401e123-06c0-474c-8b2c-670522c3191c',
        'Host': 'x2mate.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Content-Length': '65'
    };
    var step1Result = await postXMate(step1API, step1Header, step1Params);

    // step2
    var step2API = 'https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994';
    var step2Header = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en,en-US;q=0.9,en-GB;q=0.8',
        'Content-Length': '150',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://x2mate.com',
        'Referer': 'https://x2mate.com/',
        'X-Requested-Key': 'de0cfuirtgf67a',
        'User-Agent': 'PostmanRuntime/7.36.0',
        'Postman-Token': '4c6a737e-203a-4d4e-b07c-031085c2a40d',
        'Host': 'backend.svcenter.xyz',
        'Connection': 'keep-alive',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',

    };
    var step2Params = {
        v_id: id,
        ftype: 'mp3',
        fquality: '128',
        token: step1Result.token,
        timeExpire: step1Result.timeExpires,
        client: 'x2mate.com'
    };
    var step2Result = await postXMate(step2API, step2Header, step2Params);
    return step2Result;
}

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

    var xmateResult = await getMP3XMate(url, info.videoDetails.videoId);
    result.url = xmateResult.d_url;

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
        return res.send(JSON.stringify(mp3));

    }
    return res;
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
