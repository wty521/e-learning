# alg
[leetcode](https://leetcode-cn.com/progress/)
[之前瞎写的一些算法](https://github.com/wty521/alg-days)
- 现在没啥顺序结构，就是些面试高频

### 用2个栈实现队列
栈：后进先出 队列：先进先出
```js
// 主要为了复习下 栈队列的概念.. 栈：先进后出 队列：先进先出
/**
 * 用[] push pop 模拟一个栈
 * 1. 入队 = 入栈 s1 如果：s1 [1,2,3,4,5]
 * 2. s2  = reverse的s1 [5,4,3,2,1]
 * 出队 = 出栈 s2
 */
class Queue {
    constructor() {
        this.s1 = [];
        this.s2 = [];
    }
    enqueue(val) { // 入队就push到栈中
        this.s1.push(val);
    }
    dequeue() {
        while(this.s1.length > 0) {
            this.s2.push(this.s1.pop()); // 出1栈的是后进1栈的，再推进2栈是后进入栈的
        }
        if (this.s2.length > 0) {
            return this.s2.pop(); // 再推出2栈 就是先进入1栈的了 先进先出
        }
    }
}

```
### 解析url params qa.parse()
```js
// simple版
function parse (str) {
    return str.split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('=');
        if (!value) {
            return acc;
        }
        acc[key] = value; // TODO.. 这样对象数组等不ok a[name]=wty&a[age]=27 || a[0]=1&a[1]=2 || color=Deep%20Blue
        return acc;
    }, {})
}
// 完整版
function parse (str) {
    return str.split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('='); // {a[name]: wty, a[age]: 27}
        if (!value) {
            return acc;
        }
        // acc[key] = value;
        deep_set(acc, key.split(/[\[\]]/g).filter(x => x), value) // deep_set({...}, [a,name], wty)

        return acc;
    }, {})
}

function deep_set (acc, path, value) {
    let i = 0;
    for(; i < path.length -1; i++ ) {
        if (acc[path[i]] === undefined) {
            if (path[i+1].match(/^\d+$/)) { // 数组
                acc[path[i]] = [];
            } else {
                acc[path[i]] = {}; // 对象
            }
        }
        acc = acc[path[i]];
    }
    acc[path[i]] = decodeURIComponent(value);
}
```
### 取n个数字合为m
```js
/**
 *
 * 取n个数字合为m
 * sumN([1,3,8,5,2], 2, 11) // [3, 8]
 * sumN([1,3,8,5,2], 3, 6) // [1,3,2]
 */
// 1. 递归
function sumN (A, n, m, i = 0, decisions = []) {
    if (m === 0) return decisions; // 满足条件
    if (i === A.length || n === 0 || m < 0) return null; // 找不到了

    return sumN(A, n-1, m-A[i], i+1, decisions.concat(A[i]))
        || sumN(A, n, m, i+1, decisions);
}
// 动态规划
function sumN (A, n, m) {
    let res = null;

    const decisions = [];
    function inner(i = 0, n , m) {
        if (res) return; // 找到结果就算了
        if (m === 0) { // 条件
            res = decisions.slice();
            return;
        }
        if (i === A.length || n === 0 || m < 0) return; // 条件

        decisions.push(A[i]);
        inner(i+1, n-1, m-A[i]); // A[i] 在最终结果中

        decisions.pop(A[i]); // A[i] 不在最终结果中
        inner(i+1, n, m);
    }

    inner(0, n, m);
    return res;
}
```


### 斐波那契数列
```js
// 如果答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。
var fib = function(n) {
    /**
    * 递归
    */
    function f(n, a=1, b=1){
        if(n<=1)return n;
        if(n==2)return b ;
        return f(n-1,b,(a+b));
        // return f(n-1,b,(a+b) % 1000000007);
    }
    return f(n);

    /**
    * 动态规划，缓存取过的数，拿空间换时间
    * 这个是leetcode 分最高的
    */
    let dp = [0,1]
    function f(n){
        if(dp[n] != undefined){
            return dp[n];
        }
        dp[n] = f(n-1) + f(n-2);
        return dp[n];
        // return dp[n] % 1000000007;
    }
    return f(n);
};

```

## 二叉树部分
层次 先序 后序 中序 list toTree
 -  掌握基本递归数方式
 -  学习更优解法
```js
// 树结构
function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}
```
1. 反转二叉树
```js
function reverseBTree (node) {
    if (!node) return;

    let tmp = node.left;
    node.left = node.right;
    node.right = tmp;

    reverseBTree(node.right);
    reverseBTree(node.left);
}
```
### 层次遍历二叉树
   3
   / \
  9  20
    /  \
   15   7

结果： [
  [3],
  [9,20],
  [15,7]
]
[层次遍历二叉树](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)
```js

*/
// 第一种递归
var levelOrder = function(root) {
    let res = [];
    if (!root) return res;
    function handler(res, root, i) {
        if (!root) return;
        if (!res[i]) res[i] = [];
        res[i].push(root.val);

        handler(res, root.left, i+1);
        handler(res, root.right, i+1);
    }
    handler(res, root, 0);
    return res;
};

/**
 * 第2种
 * 层次遍历 借助队列 push shift出来 然后左右放在下一个数组中，然后再遍历下一个数组
 */
var levelOrder = function(root) {
    let res = [];
    if (!root) return res;
    let queue = [root];
    while(queue.length) { // 每一层
        let arr = [], temp = [];
        while(queue.length) {
            let cur = queue.shift();
            arr.push(cur.val);
            if (cur.left) temp.push(cur.left);
            if (cur.right) temp.push(cur.right);
        }
        queue = temp;
        res.push(arr);
    }
    return res;
};
```

### list to tree
```js
const oldData = [
  {id:1,name:'boss',parentId:0},
  {id:2,name:'lily',parentId:1},
  {id:3,name:'jack',parentId:1},
  {id:4,name:'john',parentId:2},
  {id:5,name:'boss2',parentId:0},
]


function listToTree(oldArr){
    oldArr.forEach(element => {
    let parentId = element.parentId;
    if(parentId !== 0){
        oldArr.forEach(ele => {
        if(ele.id == parentId){ //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
            if(!ele.children){
            ele.children = [];
            }
            ele.children.push(element);
        }
        });
    }
    });
    console.log(oldArr) //此时的数组是在原基础上补充了children;
    oldArr = oldArr.filter(ele => ele.parentId === 0); //这一步是过滤，按树展开，将多余的数组剔除；
    console.log(oldArr)
return oldArr;
}
listToTree(oldData);
```




### 实现一个方法，统计字符串中出现最多的 key，并返回数量
```js
// 1. 转成数组（好操作）
// 2. 建1个{} 1个maxKey, 循环一遍数组。 得到结果
function findMaxKey(str) {
    let arr = str.trim().split('');
    if (arr.length < 1) return;

    let res = {}; maxKey = arr[0];
    for(let num of arr) {
        if (res[num] === undefined) {
            res[num] = 1;
        } else {
            res[num] += 1;
            if (res[num] > res[maxKey]) {
                maxKey = num;
            }
        }
    }
    return {
        maxKey,
        nums: res[maxKey]
    };
}
```


