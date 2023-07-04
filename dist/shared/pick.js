"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (obj, keys) => {
    const finalObj = {};
    console.log(6, keys);
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            console.log(9, obj, key);
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};
exports.default = pick;
