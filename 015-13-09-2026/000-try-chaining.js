/* const user = {
    address: {
        city: {
            street: "Elgomhoria street"
        }
    }
};
//console.log(user.address?.city?.street);
if(user.address?.city?.street == undefined) {
    console.log("not known street");
}
else {
    console.log(user.address?.city?.street);
} */




/* const user = {
    name: "Osama"
}; */

/* const user = null;
const userName = "name";
console.log(user?.[userName]); */



/* const user = {
    sayHello: () => {
        console.log("Hello");
    }
};
user.sayHello?.(); */



const user = { address: { city: "mansoura"}};

const city = user.address?.city ?? "Unknown";

console.log(city);

