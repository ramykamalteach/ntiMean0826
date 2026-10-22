/* console.log("Start");

setTimeout(() => {
    console.log("Finished after 2 seconds");
}, 2000);

console.log("End"); */

/* const result = doSomething();
function doSomething() {
    console.log("hi");
    return "now";
}
console.log(result);

console.log("Next"); */


/* function doSomethingAsync(callback) {

    setTimeout(() => {
        callback("Operation finished");
    }, 2000);

}

doSomethingAsync((result) => {
    console.log(result);
});

console.log("Next"); */


const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Data loaded");
    }, 3000);
});

async function main() {
    console.log("start");
    
    const result = await promise;
    console.log(result);
    
    console.log("end");
}

main();