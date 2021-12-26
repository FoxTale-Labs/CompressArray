function parseStringArrList(compArr) {
    var stringedArr = compArr.substring(1, compArr.length);
    const dataStrip = stringedArr.split(" ");

    var recons = "[";
    for (var i = 0; i < dataStrip.length; i++) {
        if (i % 2 == 0) {
            if (dataStrip[i].includes(" ")) {
                var isArray = dataStrip[i].split(" ")[0].indexOf("L") == -1 ? true : false;
                if (isArray) {
                    var array = "";
                    array += dataStrip[i].split(" ")[1] + " " + dataStrip[i + 1] + " ";
                    for (var k = 2; k < dataStrip.length; k++) {
                        if (dataStrip[i + k] == "EA") {
                            i += k
                            break;
                        }
                        if (k % 2 == 0) {
                            array += dataStrip[i + k] + " " + dataStrip[i + k + 1] + " ";
                        }
                    }

                    recons += JSON.stringify(parseStringArr(array)) + ",";
                    continue;
                }
                var array = "";
                array += dataStrip[i].split(" ")[1] + " " + dataStrip[i + 1] + " ";
                for (var k = 2; k < dataStrip.length; k++) {
                    if (dataStrip[i + k] == "LEA") {
                        array = array.substring(0, array.length - 1)
                        i += k
                        break;
                    }
                    if (k % 2 == 0) {
                        array += dataStrip[i + k] + " " + dataStrip[i + k + 1] + " ";
                    }
                }

                recons += JSON.stringify(parseStringArrList(array)) + ",";
                continue;
            }

            recons += "\"" + dataStrip[i + 1] + "\",";
        }
    }

    for (var i = 0; i < recons.length; i++) {
        if (recons[i] == "," && (recons[i + 1] == "}" || recons[i + 1] == "]")) {
            recons = recons.substring(0, i) + recons.substring(i + 1)
        }
    }

    recons = recons.substring(0, recons.length - 1);
    recons += "]";
    
    var uncompressedArr = restoreTypesList(JSON.parse(recons));
    return uncompressedArr;
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
                var isArray = dataStrip[i].split(" ")[0].indexOf("L") == -1 ? true : false;
                if (isArray) {
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

                var oldI = 0;
                var array = "";
                array += dataStrip[i].split(" ")[1] + " " + dataStrip[i + 1] + " ";
                for (var k = 2; k < dataStrip.length; k++) {
                    if (dataStrip[i + k] == "LEA") {
                        array = array.substring(0, array.length - 1)
                        oldI = i;
                        i += k
                        break;
                    }
                    if (k % 2 == 0) {
                        array += dataStrip[i + k] + " " + dataStrip[i + k + 1] + " ";
                    }
                }

                recons += `\"${dataStrip[oldI].replace("L", "").split(" ")[0]}\":` + JSON.stringify(parseStringArrList(array)) + ",";
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
        if (recons[i] == "," && (recons[i + 1] == "}" || recons[i + 1] == "]")) {
            recons = recons.substring(0, i) + recons.substring(i + 1)
        }
    }

    recons = recons.substring(0, recons.length - 1);
    recons += "}";
    
    var uncompressedArr = restoreTypes(JSON.parse(recons));
    return uncompressedArr;
}

function restoreTypesList(arr) {
    var newArr = arr
    try {
        for (var i = 0; i < newArr.length; i++) {
            if (typeof arr[i] == "object") {
                if (JSON.stringify(arr[i])[0] == "{") {
                    newArr[i] = restoreTypes(newArr[i]);
                    continue;
                }
                newArr[i] = restoreTypesList(newArr[i]);
                continue;
            }
    
            if (newArr[i] == "false") newArr[i] = false;
            else if (newArr[i] == "true") newArr[i] = true;
    
            if (parseInt(newArr[i]) == newArr[i]) newArr[i] = parseInt(newArr[i])
            if (parseFloat(newArr[i]) == newArr[i]) newArr[i] = parseFloat(newArr[i]);
    
            if (newArr[i] == "undefined") newArr[i] = undefined;
            if (newArr[i] == "null") newArr[i] = null;
        }
    } catch (err) {}
    return newArr;
}

function restoreTypes(arr) {
    var newArr = arr
    try {
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
    } catch (err) {}
    return newArr;
}

module.exports = { restoreTypes, parseStringArr, parseStringArrList };