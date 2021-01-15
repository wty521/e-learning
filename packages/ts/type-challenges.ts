namespace tc {
    type Partial<T> = {
        [key in keyof T]?: T[key]
    }

    type Required<T> = {
        [key in keyof T]-?: T[key]
    }

    type Readonly<T> = {
        readonly [key in keyof T]: T[key]
    }

    type Exclude<T, U> = T extends U ? never : T;

    type Pick<T, K extends keyof T> = {
        [key in K]: T[key]
    }
    
    type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
}

/** 元组转换为对象 */ 
type TupleToObject<T extends readonly any[]> = {
    [k in T[number]]: k
}

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

let result: TupleToObject<typeof tuple> = {
    tesla: 'tesla',
    'model 3': 'model 3',
    'model X': 'model X',
    'model Y': 'model Y'
}; // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}


/** 第一个元素 */
type First<T extends any[]> = T extends never[] ? never: T[0];

type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]
type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
/** 第一个元素 */

/** 获取元组长度 */
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = TLength<tesla>  // expected 4
type spaceXLength = TLength1<spaceX> // expected 5

type TLength<T extends any> = 'length' extends keyof T ? T['length'] : never;
type TLength1<T extends any> = T extends ArrayLike<string> ? T['length'] : never;
/** 获取元组长度 */

/** Awaited */
type Awaited<T> = T extends Promise<infer U> ? U : never;
/** Awaited */

/** If */
type If<U, T, K> = T extends true ? T : K;

type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
/** If */

/** Concat */
type Concat<T extends any[], K extends any[]> = [...T, ...K];
type Result = Concat<[1], ['ccc']> // expected to be [1, 'ccc']
/** Concat */

/** ReturnType */
type MyReturnType<T> = T extends (...args: any[]) => infer U ? U : never;

const fn = (v: boolean) => {
    if (v)
        return 1
    else
        return 2
}
type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
/** ReturnType */


/** Readonly2 */
type MyReadonly2<T, K extends keyof T> = {
    readonly [k in K]: T[k];
} & {
    [s in Exclude<keyof T, K>]: T[s]
}

interface Todo {
    title: string
    description: string
    completed: boolean
}
const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK





