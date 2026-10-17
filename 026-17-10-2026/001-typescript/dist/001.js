"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Animal {
    name;
    constructor(name) {
        this.name = name;
    }
    speak() {
        console.log(`${this.name} makes a sound`);
    }
}
class Dog extends Animal {
    speak() {
        console.log(`${this.name} barks`);
    }
}
const d = new Dog("Rex");
d.name = "Buddy";
d.speak();
//# sourceMappingURL=001.js.map