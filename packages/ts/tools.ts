
namespace a {
    type Partial<T> = {
        [key in keyof T]?: T[key]
    }

    type Required<T> = {
        [key in keyof T]-?: T[key]
    }

    type Readonly<T> = {
        readonly [key in keyof T]: T[key]
    }

    type Pick<T, K extends keyof T> = {
        [key in K]: T[key]
    }

    interface Person {
        name: string;
        age?: number;
        gender: 'male' | 'female';
    }

    let p1: Partial<Person> = {
        name: 'wty'
    }
    let p2: Required<Person> = {
        name: 'wty',
        age: 25,
        gender: 'male'
    }
    let p3: Pick<Person, 'name'> = {
        name: 'wty',
    }
    console.log(p1, p2, p3);
}
