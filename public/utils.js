// let homeServer = "http://localhost:9091/api";
let cobaltServer = "https://co.wuk.sh/api/json";
let homeServer = "http://youtube.lutstore.shop/api";
var utils = (function () {
    async function getTrack(url) {
        var result = await axios.get(homeServer + "/?url=" + url);

        return result.data;
    }


    async function getMP3(url, id) {
        var homeData = await getMP3Home(url);

        // var xmateData = await getMP3XMate(url, id);

        var cobaltData = await getMP3Cobalt(url, id);

        homeData.url = cobaltData.url;
        return homeData;
    }
    async function getMP3Home(url) {
        var result = await axios.get(homeServer + "/?url=" + url);

        return result.data;
    }

    async function getMP3XMate(url, id) {
        var ServerAPI1 = 'https://x2mate.com/api/ajaxSearch';
        var param1 = new FormData();
        param1.append("q", url);
        param1.append("vt", "home");
        var result = await axios({
            method: "post",
            url: ServerAPI1,
            data: param1,
            headers: {
                "Content-Type": "multipart/form-data",
                'Host': 'x2mate.com',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Origin': 'x2mate.com',
            },
        });
        console.log(result.data);

        // var headers1 = {
        //     "Content-Type": "multipart/form-data",
        //     // 'User-Agent': 'PostmanRuntime/7.36.0',
        //     'Accept': '*/*',
        //     'Cache-Control': 'no-cache',
        //     // 'Postman-Token': 'd75fbe7f-8dc9-4e93-8c9d-bce45dd4ca8d',
        //     'Host': 'x2mate.com',
        //     'Accept-Encoding': 'gzip, deflate, br',
        //     'Connection': 'keep-alive',
        //     'Origin': 'x2mate.com',

        // }
        // console.log(param1);
        // console.log(headers1);

        // var result = await axios.post(ServerAPI1, param1, { headers: headers1 });
        console.log(result.data);


        // var requestUrl = 'https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + id;
        // var axios_param = JSON.stringify({ "url": requestUrl, "aFormat": "mp3", "filenamePattern": "classic", "dubLang": false, "isAudioOnly": true, "isNoTTWatermark": true });
        // var axios_headers = {
        //     'Accept': 'application/json',
        //     'Accept-Encoding': 'gzip, deflate, br',
        //     'Accept-Language': 'en,en-US;q=0.9,en-GB;q=0.8',
        //     'Content-Length': '167',
        //     'Content-Type': 'application/json',
        //     'Origin': 'https://cobalt.tools',
        //     'Referer': 'https://cobalt.tools/',
        //     'Host': 'co.wuk.sh',
        // };
        // var result = await axios.post(cobaltServer, axios_param, { headers: axios_headers });

        // console.log(result.data);
        return result.data;
    }

    async function getMP3Cobalt(url, id) {
        var requestUrl = 'https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + id;
        var axios_param = JSON.stringify({ "url": requestUrl, "aFormat": "best", "filenamePattern": "classic", "dubLang": false, "isAudioOnly": true, "isTTFullAudio": true, "isNoTTWatermark": true });
        var axios_headers = {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en,en-US;q=0.9,en-GB;q=0.8',
            'Content-Length': '167',
            'Content-Type': 'application/json',
            'Origin': 'https://cobalt.tools',
            'Referer': 'https://cobalt.tools/',
            'Host': 'co.wuk.sh',
        };
        var result = await axios.post(cobaltServer, axios_param, { headers: axios_headers });

        console.log(result.data);
        return result.data;
    }
    async function getMP4(url) {
        axios.post("url", { name: "data" }).then(function (response) {
            console.log(response)
            // do whatever you want if console is [object object] then stringify the response
        })
    }
    function addTrackID(id) {
        console.log("addTrackID: " + id);
    }
    return {
        getTrack: getTrack,
        getMP3: getMP3,
        getMP4: getMP4,
        addTrackID: addTrackID
    }
})();

