const lzString = require("lz-string");

function compressArray(arr) {
    const stringedArr = arrayDecons(arr);
    const compressArr = lzString.compress(stringedArr)
    const result = compressArr;
    return result;
}

function illCharRemove(string, char) {
    var result = string.split(char).join(" ");
    return result;
}

function arrayDecons(arr) {
    var stringArray = "";

    for (var [key, value] of Object.entries(arr)) {
        if (typeof value == "string") {
            value = illCharRemove(value, " ");
            value = illCharRemove(value, " ");
        }

        if (value == null) {
            stringArray += `${key} ${value} `;
            continue
        }

        if (typeof value == "object") {
            stringArray += `${key} ${arrayDecons(value)} EA ${key} `;
            continue;
        }

        stringArray += `${key} ${value} `;
    }
    stringArray = stringArray.substring(0, stringArray.length - 1);

    return stringArray;
}


// Decompressing
function decompressArray(strarr) {
    const decompressArr = lzString.decompress(strarr);
    const builtArr = parseStringArr(decompressArr);
    const result = builtArr;
    return result;
}

function parseStringArr(compArr) {
    var stringedArr = compArr;
    const dataStrip = stringedArr.split(" ");
    
    var nestedArrs = {};
    var recons = "{";
    for (var i = 0; i < dataStrip.length; i++) {
        if (i % 2 == 0) {
            if (dataStrip[i] == "") {
                continue;
            }

            if (dataStrip[i].includes(" ")) {
                var parentArr = ""
                for (const [key, value] of Object.entries(nestedArrs)) {
                    if (value[0] <= i && value[1] == -1) {
                        parentArr = key;
                    }
                }
                if (parentArr == "") parentArr = null;

                nestedArrs[`${dataStrip[i].split(" ")[0]}`] = [i, -1, parentArr, false];
                recons += "\"" + dataStrip[i].split(" ")[0] + "\":{";
                recons += "\"" + dataStrip[i].split(" ")[1] + "\":\"" + dataStrip[i + 1] + "\",";
                continue;
            } 
            
            if (dataStrip[i] == "EA") {
                recons += "},";
                var oldNested = nestedArrs[`${dataStrip[i + 1]}`]
                nestedArrs[`${dataStrip[i + 1]}`] = [oldNested[0], i, oldNested[2], true];
                continue;
            }

            recons += "\"" + dataStrip[i] + "\":\"" + dataStrip[i + 1] + "\",";
        }
    }

    for (var i = 0; i < recons.length; i++) {
        if (recons[i] == "," && recons[i + 1] == "}") {
            recons = recons.substring(0, i) + recons.substring(i + 1)
        }
    }

    recons = recons.substring(0, recons.length - 1);
    recons += "}";
    
    
    var uncompressedArr = restoreTypes(JSON.parse(recons));
    return uncompressedArr;
}

function restoreTypes(arr) {
    var newArr = arr
    for (const [key, value] of Object.entries(newArr)) {
        if (typeof value == "object") {
            newArr[key] = restoreTypes(value);
            continue;
        }

        if (value == "false") newArr[key] = false;
        else if (value == "true") newArr[key] = true;

        if (parseInt(value) == value) newArr[key] = parseInt(value)
        if (parseFloat(value) == value) newArr[key] = parseFloat(value);

        if (value == "undefined") newArr[key] = undefined;
        if (value == "null") newArr[key] = null;
    }
    return newArr;
}

module.exports = { compress: compressArray, decompress: decompressArray };