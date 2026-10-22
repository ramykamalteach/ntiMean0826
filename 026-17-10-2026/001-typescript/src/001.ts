class Animal {
  constructor(public name: string) {}
  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak(): void {
    console.log(`${this.name} barks`);
  }
}

const d = new Dog("Rex");
d.name = "Buddy";
d.speak();