// let homeServer = "http://localhost:9091/api";

let homeServer = "http://youtube.lutstore.shop/api";

let cobaltServer = "https://co.wuk.sh/api/json";
var utils = (function () {

    async function getTrack(url) {
        var result = await axios.get(homeServer + "/?url=" + url);
        return result.data;
    }

    async function getMP3(url, id) {
        var homeData = await getMP3Home(url);

        // var xMateData = getMP3XMate(url, id);
        // console.log("xMateData: " + xMateData);
        // homeData.url = xMateData.d_url;

        var cobaltData = await getMP3Cobalt(url, id);
        console.log("cobaltData: " + cobaltData);
        homeData.url = cobaltData.url;


        return homeData;
    }
    async function getMP3Home(url) {
        var result = await axios.get(homeServer + "/?url=" + url);
        // console.log(result.data);
        return result.data;
    }

    async function getMP3Cobalt(url, id) {
        var requestUrl = 'https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + id;
        var axios_param = JSON.stringify({ "url": requestUrl, "aFormat": "mp3", "filenamePattern": "classic", "dubLang": false, "isAudioOnly": true, "isNoTTWatermark": true });
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

