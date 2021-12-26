const lzString = require("lz-string");
const decompress = require("./decompress.js");
const compress = require("./compress.js");
const axios = require("axios");
const pjson = require('./package.json');

// Update checker
(() => {
    axios({
        method: 'get',
        url: 'https://registry.npmjs.com/compressarray',
    }).then((res) => {
        var version = parseInt(pjson.version.split(".").join(""));
        var latest = parseInt(res.data["dist-tags"].latest.split(".").join(""));
        if (latest > version) {
            console.log("--| CompressArray |--");
            console.log("A newer version of CompressArray is available!");
            console.log("You can install it using: npm i compressarray@" + res.data["dist-tags"].latest);
            console.log("");
            console.log("Current: " + pjson.version + "\nLatest: " + res.data["dist-tags"].latest);
            console.log("---------------------");
        }
    });
})();


function compressArray(arr) {
    try {
        if (!arr) return null;
        if (arr == "") return null;

        if (JSON.stringify(arr)[0] == "{") {
            const stringedArr = compress.arrayDecons(arr);
            const compressArr = lzString.compress(stringedArr)
            const result = compressArr;
            return result;
        }
        const stringedArr = compress.arrayDeconsList(arr, true);
        const compressArr = lzString.compress(stringedArr)
        const result = compressArr;
        return result;
    } catch (err) {
        return null;
    }
}


// Decompressing
function decompressArray(strarr) {
    try {
        if (!strarr) return null;
        if (strarr == "") return null;

        const decompressArr = lzString.decompress(strarr);
        if (decompressArr[0] == "L") {
            const builtArr = decompress.parseStringArrList(decompressArr);
            const result = builtArr;
            return result;
        }
        const builtArr = decompress.parseStringArr(decompressArr);
        const result = builtArr;
        return result;
    } catch (err) {
        return null;
    }
}

module.exports = { compress: compressArray, decompress: decompressArray };
