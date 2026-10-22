class User {

    ensuranceRate = 0.03; // public (methods in its class, objects from its class, classes inherate its class)

    #absenceDays = 5;  // private (methods in its class)

    constructor(userType, userInstuition, userTaxRate, userSalary) {
        console.log("i'm live now");
        this.ownerType = userType;
        this.ownerInstuition = userInstuition;
        this.ownerTaxRate = userTaxRate;
        this.ownerSalary = userSalary;
    }

    sayHello(userName) {
        console.log("Hello " + userName);
    }

    netSalary() {
        return this.ownerSalary * (1 - this.ownerTaxRate) * (1 - this.ensuranceRate);
    }

    resetAbsenceDays() {
        return 30 - this.#absenceDays;
    }
}




const student = new User("student", "school", 0, 1000);
const employee = new User("employee", "company", 0.15, 5000);

student.sayHello("student 1");
employee.sayHello("emp 3");

student.ensuranceRate = 0;

console.log(student.netSalary());
console.log(employee.netSalary());

console.log(student.resetAbsenceDays());