class User {
    constructor(name) {
        this._name = name;
    }

    get username() {
        return this._name;
    }

    set username(value) {
        if (!value) {
            throw new Error("Name is required");
        }

        this._name = value;
    }
}


const user1 = new User("John");
console.log(user1.username);
user1.username = "Islam";
console.log(user1.username);