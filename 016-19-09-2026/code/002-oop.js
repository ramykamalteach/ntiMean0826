class User {
    constructor(name) {
        this.name = name;
    }

    login() {
        console.log(`${this.name} logged in`);
    }
}

class Admin extends User {
    constructor(name, permissions) {
        super(name);
        this.permissions = permissions;
    }
}

const admin1 = new Admin("Reda", ["read", "write", "delete"]);
admin1.login();