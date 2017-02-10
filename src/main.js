const IO = require("./io");
const Program = require("./program");
const _ = require('lodash');

console.log("--------------------INPUT--------------------");
const input = IO.readFile("./resources/small.in");
console.log(input);
console.log("---------------------------------------------");


const lines = input.split("\n");
const head = lines[0].split(" ");

const result = Program.run({
    rows: +head[0],
    columns: +head[1],
    perIngredient: +head[2],
    maximumCell: +head[3],
    data: lines.splice(1, lines.length - 2)
});

console.log("--------------------OUTPUT-------------------");
console.log(result);
let resultLines = _.flatMap([result.rows, result.columns, result.data]);
IO.createDirectory("./target");
IO.writeFile("./target/small.out", IO.oneLinePerElement(resultLines));
console.log("---------------------------------------------");
