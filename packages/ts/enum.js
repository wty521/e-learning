"use strict";
var Young;
(function (Young) {
    Young[Young["boy"] = 0] = "boy";
    Young[Young["girl"] = 1] = "girl";
})(Young || (Young = {}));
console.log('Person', Young.boy, Young.girl);
var YoungP;
(function (YoungP) {
    YoungP["boy"] = "wty";
    YoungP["girl"] = "cc";
})(YoungP || (YoungP = {}));
console.log('Person', YoungP.boy, YoungP.girl);
console.log('Anmial', 1 /* cat */, 0 /* dog */);
