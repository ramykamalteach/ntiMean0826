const sum = (a, b) => {
    			return a + b;
		};

const subtract = (a, b) => {
    			return a - b;
		};


// work with require
/* module.exports = {
    			"summation" : sum,
                "subtract" : subtract
		} */


// works with import
export default {
    summation: sum,
    subtract: subtract
};