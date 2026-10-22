/* const greet = (name) => {
  return "Hi " + name;
}; */
/* const greet = name => "Hello " + name;
console.log(greet("Ramy")); */


/* function sum() {
    console.log(...arguments);
}
sum(1,2,3, 4,5); */

/* function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(10, 20, 30, 1000));
console.log(sum(10, 20)); */


/* function calculate(op = "sum", ...numbers) {
    if(op == "sum"){        
        return numbers.reduce((total, n) => total + n, 0);
    }
    else if(op == "multiply"){
        return numbers.reduce((total, n) => total * n, 1);
    }
    else {
        return op + numbers.reduce((total, n) => total + n, 0);
    }
}

console.log(calculate("sum", 1, 2, 3));
console.log(calculate("multiply", 10, 20, 30, 40));
console.log(calculate(1, 2, 3)); */

/* function calculate(numbers, op = "sum") {
    if(op == "sum"){
        return numbers.reduce((total, n) => total + n, 0);
    }
    if(op == "multiply"){
        return numbers.reduce((total, n) => total * n, 1);
    }
}

console.log(calculate([1, 2, 3], "sum"));
console.log(calculate([10, 20, 30, 40], "multiply"));
console.log(calculate([1, 2, 3])); */


////////////////////////////

/* function processUser(name, callback) {
  callback(name);
}

processUser("Ali", greet);

function greet(personName) {
    console.log("hi " + personName);
} */


/* function processUser(name, callback) {
  callback(name);
}

processUser("Ali", (personName) => console.log("hi " + personName)); */


/* setTimeout(() => {
    console.log("Done!");
}, 5000); */

/* setInterval(() => {
  console.log("Done!");
}, 3000); */


/* counter = 1;
const animationToy = setInterval(() => {
  console.log("Done! " + counter++);
  if(counter >= 5) {
    clearInterval(animationToy);
  }
}, 300); */



/* const greet = function(name) {
  console.log("Hello " + name);
};

greet("Emad"); */



/* (function(name) {
  console.log("Hello " + name);
})("Tamer Ali"); */



/* const user = {
    name: "Ramy",

    greet: function () {
        console.log("Hello " + this.name);
    }
};

user.greet(); */




/* function counter() {
    count = 0;
    return ++count;
}

console.log(counter());
console.log(counter());
console.log(counter());*/


function counter() {
  let count = 0;

  return function() {
    count++;
    return count;
  };
}

const increment = counter();

console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3