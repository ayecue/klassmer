/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
    fs = require('fs'),
    JSON2 = require('JSON2'),
    forEach = require('./forEach'),
    CONSTANTS = require('./constants');

function Package(options){
	var me = this;

    me.options = options || {};
}

Package.read = function(pkg){
    var me = this;

    if (pkg && fs.statSync(pkg).isFile()) {
        var pkgcontent = fs.readFileSync(pkg,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            }),
            json = JSON2.parse(pkgcontent);

        if (json.main) {
            json.main = path.resolve(path.dirname(pkg),json.main);
        }

        return new Package(json);
    }
};

Package.prototype = {
	self : Package,
    apply : function(options){
        var me = this;

        forEach(options,function(key,value){
            if (value) {
                me.options[key] = value;
            }
        });

        return me;
    },
    raw : function(){
        return this.options;
    },
    get : function(name){
        return this.options[name];
    }
};
    

module.exports = Package;