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
            if (JSON.stringify(value)[0] == "{") {
                stringArray += `${key} ${arrayDecons(value)} EA ${key} `;
                continue;
            }
            stringArray += `L${key} ${arrayDeconsList(value)} LEA ${key} `;
            continue;
        }

        stringArray += `${key} ${value} `;
    }
    
    stringArray = stringArray.substring(0, stringArray.length - 1);
    return stringArray;
}

function arrayDeconsList(arr, top) {
    var stringArray = top ? "L" : "";

    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] == "string") {
            arr[i] = illCharRemove(arr[i], " ");
            arr[i] = illCharRemove(arr[i], " ");
        }

        if (arr[i] == null) {
            stringArray += `${i} ${arr[i]} `;
            continue
        }

        if (typeof arr[i] == "object") {
            if (JSON.stringify(arr[i])[0] == "{") {
                stringArray += `${i} ${arrayDecons(arr[i])} EA ${i} `;
                continue;
            }
            stringArray += `L${i} ${arrayDeconsList(arr[i])} LEA ${i} `;
            continue;
        }

        stringArray += `${i} ${arr[i]} `;
    }
    stringArray = stringArray.substring(0, stringArray.length - 1);

    return stringArray;
}

module.exports = { arrayDecons, arrayDeconsList };