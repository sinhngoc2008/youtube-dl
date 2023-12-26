// const serverURL = "http://192.168.45.99:9091";
const serverURL = "http://youtube.lutstore.shop";


// const audioLocation = 'http://192.168.45.99:9091/media/audio/';
const audioLocation = 'http://youtube.lutstore.shop/media/audio/';

// let cobaltServer = "https://co.wuk.sh/api/json";
// let cobaltServer = "http://cobalt.lutstore.shop/api/json";
let cobaltServer = "http://192.168.45.10:9000/api/json";
// let cobaltServer = "http://localhost:9000/api/json";

const PORT = 9091;
const Fs = require('fs');
const Path = require('path');
const axios = require('axios');
const path = require('path');
// const fetch = require('node-fetch');

const ytcore = require('ytdl-core');
const ytpl = require('ytpl');


const AudioPath = '/public/media/audio';
const VideoPath = '/public/media/video';

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

async function getMP3Cobalt(url, id) {
    var requestUrl = 'https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + id;
    var axios_param = JSON.stringify({ "aFormat": "mp3", "filenamePattern": "classic", "dubLang": false, "isAudioOnly": true, "isTTFullAudio": true, "isNoTTWatermark": true, "url": requestUrl });
    var axios_headers = {
        "Accept": 'application/json',
        "Accept-Encoding": 'gzip, deflate, br',
        "Accept-Language": 'en,en-US;q=0.9,en-GB;q=0.8',
        "Content-Type": 'application/json',
        "Postman-Token": 'd7e6c9cd-c0ab-49fa-8b58-4876507a79a7',
        "Origin": 'https://cobalt.tools',
        "Referer": 'https://cobalt.tools/',
        "Host": 'co.wuk.sh',
    };

    // console.log(cobaltServer);
    // console.log(axios_param);
    // console.log(axios_headers);
    var result = await axios.post(cobaltServer, axios_param, { headers: axios_headers });

    // console.log(result.error);
    return result.data;
}

function validateFile(mp3Name) {
    const filename = Path.join(__dirname, AudioPath, mp3Name);
    if (Fs.existsSync(filename)) {
        console.log('file exist on disk!!');
        return true;
    }
    return false;
}

async function DonwloadMp3BK(url, mp3Name, callback) {
    const filename = Path.join(__dirname, AudioPath, mp3Name);
    console.log("Downloading file: " + filename);

    // axios image download with response type "stream"
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    })

    // pipe the result stream into a file on disc
    await response.data.pipe(await Fs.createWriteStream(filename)).on('finish', async function (err) {
        return await callback(err);
    });
}

async function DonwloadMp3(url, mp3Name) {
    const filename = Path.join(__dirname, AudioPath, mp3Name);
    console.log("Downloading file: " + filename);
    let stream = Fs.createWriteStream(filename)

    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        }).then(function (response) {
            response.data.pipe(stream).on('finish', function (err) {
                resolve(mp3Name);
            });
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })
    });

    // // axios image download with response type "stream"
    // const response = await axios({
    //     method: 'GET',
    //     url: url,
    //     responseType: 'stream'
    // })

    // // pipe the result stream into a file on disc
    // return await response.data.pipe(await Fs.createWriteStream(filename)).on('finish', function (err) {
    //     return callback(err);
    // });;
}

const DonwloadMp4 = (url, filename) => {
    axios({
        url: 'http://api.dev/file-download', //your url
        method: 'GET',
        responseType: 'blob', // important
    }).then((response) => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'file.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    });
}

async function VerifyMediaFolder() {
    let mediaFolder = Path.join(__dirname, AudioPath);
    CreateFolder(mediaFolder)

    let videoFolder = Path.join(__dirname, VideoPath);
    CreateFolder(videoFolder)
}
async function CreateFolder(localPath) {
    return Fs.mkdirSync(localPath, { recursive: true })
}


async function getPlaylist(url) {
    // let url = "https://www.youtube.com/watch?v=ZBMnhsr8G7k&list=PLK_D0CNUqhtSROd2NLJcTUmROV-r6pzZH";
    let playlist = await ytpl(url);
    return playlist.items;
}
async function getMp3(url) {
    // let url = "https://www.youtube.com/watch?v=ZBMnhsr8G7k";
    let result = {};
    console.log("URL: " + url);
    // try {
    let info = await ytcore.getInfo(url);
    let audioFormats = await ytcore.filterFormats(info.formats, 'audioonly');
    let format = await ytcore.chooseFormat(audioFormats, { quality: 'highestaudio' })
    result = { id: info.videoDetails.videoId, title: info.videoDetails.title, author: info.videoDetails.author.name, url: audioFormats[0].url, duration: format.approxDurationMs };

    var cobaltData = await getMP3Cobalt(url, info.videoDetails.videoId);
    result.url = cobaltData.url;

    // var xmateResult = await getMP3XMate(url, info.videoDetails.videoId);
    // result.url = xmateResult.d_url;
    // }
    //     catch (e) {
    //     console.log(e);
    // }
    return result;
}
// async function getMp4(url) {
//     // let url = "https://www.youtube.com/watch?v=ZBMnhsr8G7k";
//     let info = await ytcore.getInfo(url);
//     // return info.formats;
//     let audioFormats = await ytcore.filterFormats(info.formats, 'videoonly');
//     return audioFormats[0];
// }

module.exports = {
    PORT, serverURL, audioLocation,
    getMp3, getPlaylist,
    DonwloadMp3, DonwloadMp4, validateFile,
    VerifyMediaFolder
}