class User {
    name = "";
    constructor(name) {
        this.name = name;
    }
    login() {
        console.log(`${this.name} logged in`);
    }
}

class Admin extends User {
    logout() {
        console.log(`${this.name} logged out`);
    }
}

const admin1 = new Admin("Reda");
admin1.login();
admin1.logout();