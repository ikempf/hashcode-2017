const IO = require("./io");
const Program = require("./program");
const _ = require('lodash');

console.log("--------------------INPUT--------------------");
const input = IO.readFile("./resources/kittens.in");
// console.log(input);
console.log("---------------------------------------------");


const lines = input.split("\n");
const head = lines[0].split(" ");
const videoSizes = _.map(lines[1].split(" "), size => +size);

let spec = {
    videoCount: +head[0],
    endpointCount: +head[1],
    requestCount: +head[2],
    cacheServerCount: +head[3],
    cacheServerSize: +head[4],
    videoSizes: videoSizes
};

let endpoints = {};
for (let i = 0; i < spec.endpointCount; i++) {
    const endpointData = lines[i + 2].split(" ");
    endpoints[i] = {dataCenterLatency: +endpointData[0], cacheServerCount: +endpointData[1]};

    let cacheServers = {};
    for (let j = 0; j < endpoints[i].cacheServerCount; j++) {
        const cacheServerData = lines[j + i + 2 + 1].split(" ");
        endpoints[i] = {cacheServerId: +cacheServerData[0], latency: +cacheServerData[1]};
    }
    endpoints[i].cacheServers = cacheServers;
}

spec.endpoints = endpoints;

const result = Program.run(spec);

console.log("--------------------OUTPUT-------------------");
// console.log(result);
let resultLines = _.flatMap([result.rows, result.columns, result.data]);
IO.createDirectory("./target");
IO.writeFile("./target/small.out", IO.oneLinePerElement(resultLines));
console.log("---------------------------------------------");
