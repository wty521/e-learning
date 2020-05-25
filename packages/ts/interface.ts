
interface IProps {
    title: string;
    readonly age: number;
    name?: string;
    [propName: string]: any;
}

function demo(params: IProps): {t: string, n: number} {
    return {
        t: params.title,
        n: params.number
    }
}

interface FuncIsBoy {
    (name: string, age: number): boolean;
}

let isBoy: FuncIsBoy;
isBoy = function(name: string, age: number) {
    console.log(name, age);
    return age > 18;
}

