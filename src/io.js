const fs = require('fs');
const _ = require('lodash');

const ENCODING = "utf8";

function readFile(path) {
    return fs.readFileSync(path, ENCODING);
}

function writeFile(path, data) {
    return fs.writeFileSync(path, data, ENCODING);
}

function createDirectory(path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

function oneLinePerElement(elements) {
    return _.reduce(elements, (acc, e) => acc + "\n" + e)
}

module.exports = {
    readFile,
    writeFile,
    createDirectory,
    oneLinePerElement
};