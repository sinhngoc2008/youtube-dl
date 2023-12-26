
var utils = (function () {

    async function getTrack(url) {
        return new Promise((resolve, reject) => {
            axios.get(serverAPI + "/?url=" + url).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                console.log("Error: " + error);
                reject();
            });
        });

        // var result = await axios.get(serverAPI + "/?url=" + url);
        // return result.data;
    }

    async function getMP3(url, id) {
        return new Promise((resolve, reject) => {
            axios.get(serverAPI + "/?url=" + url).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                console.log("Error: " + error);
                reject();
            });
        });


        // return await axios.get(serverAPI + "/?url=" + url).then(function (response) {
        //     return response.data;
        // }).catch(function (error) {
        //     console.log("Error: " + error);
        // });
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

