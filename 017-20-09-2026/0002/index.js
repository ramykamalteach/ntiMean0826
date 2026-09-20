/* console.log("hi");

const sum01 = require("./opSum");

let result = sum01.summation(11, 22);
console.log(result);
result = sum01.subtract(11, 22);
console.log(result); */

/* import calculate from "./opSum.js"; 

let result = calculate.summation(11, 22);
console.log(result);
result = calculate.subtract(11, 22);
console.log(result); */

import { summation, subtract } from './calc.js';

let result = summation(11, 22);
console.log(result);
result = subtract(100, 5);
console.log(result);