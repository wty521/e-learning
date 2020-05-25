"use strict";
function demo(params) {
    return {
        t: params.title,
        n: params.number
    };
}
var isBoy;
isBoy = function (name, age) {
    console.log(name, age);
    return age > 18;
};
