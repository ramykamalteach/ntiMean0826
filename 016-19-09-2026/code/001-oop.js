class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
    login(){
        console.log(`${this.name} has logged in`);
    }
    logout(){
        console.log(`${this.name} has logged out`);
    }
}


/* const user1 = new User('John', '1234');
user1.login();
user1.logout(); */


class Admin extends User {
    constructor(name, password, role) {
        super(name, password);
        this.role = role;
    }

    createUser(name, password) {        
        console.log(`Admin ${this.name} created a new user: ${name} in our Database`);
    }
}

/* const admin1 = new Admin('Admin', 'admin123', 'superadmin');
admin1.login();
admin1.createUser('Jane', '5678');
admin1.logout(); */


class CoAdmin extends Admin {
    createUser(name, password, role) {
        if(role == "editor" || role == "viewer") {
            console.log(`CoAdmin ${this.name} created a new user: ${name} with role: ${role} in our Database`);
        }
        else {
            console.log(`CoAdmin ${this.name} cannot create a user with role: ${role}`);
        }
    }
}

const Coadmin1 = new CoAdmin('Waleed', 'admin123', 'coadmin');
Coadmin1.login();
Coadmin1.createUser('Tamer', '5678', 'editor');
Coadmin1.logout();