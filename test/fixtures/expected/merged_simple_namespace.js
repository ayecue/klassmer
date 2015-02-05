(function (global, factory) {global.myClass = factory(global);}(this, function (global) {

var module_1 = function(exports) {
    exports.tool = function(test) {
        return test;
    }({});
    exports.wat = true;
    return exports;
}({});

var module_0 = function() {
    return {};
}();

var myClass = function() {
    return {
        test: module_0,
        lala: module_1
    };
}();

return myClass;}));