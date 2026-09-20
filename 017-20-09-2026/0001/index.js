/* console.log("Start");

const fs = require("fs");

const data = fs.readFileSync("myCV.txt", "utf8");

console.log(data);
console.log("Finish"); */


console.log("Start");

const fs = require("fs");

fs.readFile("myCV.txt", "utf8", (err, data) => {
    console.log(data);
});

console.log("Finish");

