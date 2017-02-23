const IO = require("./io");
const Program = require("./program");
const _ = require('lodash');
const util = require('util');

// console.log("--------------------INPUT--------------------");
const input = IO.readFile("./resources/kittens.in");
// console.log(input);
// console.log("---------------------------------------------");


const lines = input.split("\n");
const head = lines[0].split(" ");
const videoSizes = _.map(lines[1].split(" "), size => ({size: size}));

let spec = {
    videoCount: +head[0],
    endpointCount: +head[1],
    requestCount: +head[2],
    cacheServerCount: +head[3],
    cacheServerSize: +head[4],
    videoSizes: videoSizes
};
let arrayCaches = _.fill(Array(spec.cacheServerCount), spec.cacheServerSize).map((c, i) => ({id: "" + i, size: c}));
spec.caches = _.keyBy(arrayCaches, 'id');

let endpoints = {};
let endpointToCacheConnectionCount = 0;
let endpointToCacheConnectionCountAll = 0;
for (let i = 0; i < spec.endpointCount; i++) {
    // console.log(i, endpointToCacheConnectionCountAll + i + 2, lines[endpointToCacheConnectionCountAll + i + 2]);
    const endpointData = lines[endpointToCacheConnectionCountAll + i + 2].split(" ");
    endpoints[i] = {dataCenterLatency: +endpointData[0], cacheServerCount: +endpointData[1]};

    let cacheServers = [];
    for (let j = 0; j < endpoints[i].cacheServerCount; j++) {
        const cacheServerData = lines[endpointToCacheConnectionCountAll + j + i + 2 + 1].split(" ");
        cacheServers.push({id: cacheServerData[0], latency: +cacheServerData[1]});
    }
    endpoints[i].caches = cacheServers;
    endpointToCacheConnectionCount = endpoints[i].cacheServerCount;
    endpointToCacheConnectionCountAll = endpointToCacheConnectionCountAll + endpoints[i].cacheServerCount;
}
spec.endpoints = endpoints;
// console.log(endpointToCacheConnectionCountAll + 2 + spec.endpointCount);
// console.log(util.inspect(spec.endpoints[1], false, null))

let requests = [];
for (let i = 0; i < spec.requestCount; i++) {
    const requestData = lines[endpointToCacheConnectionCountAll + spec.endpointCount + i + 2].split(" ");
    requests.push({video: +requestData[0], endpoint: +requestData[1], count: +requestData[2]});
}
spec.requests = requests;

const result = Program.run(spec);
console.log(result.length)
_.forEach(result, t => console.log(t))
// console.log("--------------------OUTPUT-------------------");

// console.log("HELLO")
// console.log(Object.keys(result).length)
// console.log(result.value())
// console.log("-------------")
// let resultLines = [Object.keys(result).length, _.map(result, (v, k) => k + " " + v.join(" "))];
// console.log("HELLO 2")
// console.log(resultLines[2].value())
// IO.createDirectory("./target");
// IO.writeFile("./target/small.out", IO.oneLinePerElement(resultLines));
// console.log("---------------------------------------------");
