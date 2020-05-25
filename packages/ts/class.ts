class Person {
    constructor(public name: string) {
        this.name = name;
    }

    static sayHello() {
        console.log(111);
    }
    public age: number = 27;
    private hi() {
        console.log(this.name);
    }
    protected a: number = 123;

    sayName = () => {
        console.log('sayName', this.name);
    }
    eat() {
        console.log('eat', this.name);
    }
}

class Child extends Person {
    constructor(props: string) {
        super(props);
        this.age = 18;
    }
}