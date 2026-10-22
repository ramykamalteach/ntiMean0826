class User {
    static role = "USER";

    static createGuest() {
        return new User("Guest");
    }

    constructor(name) {
        this.name = name;
    }
}

console.log(User.role);
console.log(User.createGuest());