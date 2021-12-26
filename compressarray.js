const lzString = require("lz-string");
const decompress = require("./decompress.js");
const compress = require("./compress.js");

function compressArray(arr) {
    try {
        if (arr != null && arr != "") {
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
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}


// Decompressing
function decompressArray(strarr) {
    try {
        if (strarr != null && strarr != "") {
            const decompressArr = lzString.decompress(strarr);
            if (decompressArr[0] == "L") {
                const builtArr = decompress.parseStringArrList(decompressArr);
                const result = builtArr;
                return result;
            }
            const builtArr = decompress.parseStringArr(decompressArr);
            const result = builtArr;
            return result;
        }
        return null;
    } catch (err) {
        return null;
    }
}

module.exports = { compress: compressArray, decompress: decompressArray };
