"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Person = /** @class */ (function () {
    function Person(name) {
        var _this = this;
        this.name = name;
        this.age = 27;
        this.a = 123;
        this.sayName = function () {
            console.log('sayName', _this.name);
        };
        this.name = name;
    }
    Person.sayHello = function () {
        console.log(111);
    };
    Person.prototype.hi = function () {
        console.log(this.name);
    };
    Person.prototype.eat = function () {
        console.log('eat', this.name);
    };
    return Person;
}());
var Child = /** @class */ (function (_super) {
    __extends(Child, _super);
    function Child(props) {
        var _this = _super.call(this, props) || this;
        _this.age = 18;
        return _this;
    }
    return Child;
}(Person));
