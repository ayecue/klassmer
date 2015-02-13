/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    uglifyjs = require('uglify-js'),
    CJS = require('./compiler/cjs'),
    Base = require('./compiler/base'),
    printf = require('../../../common/printf'),
    Klass = require('../../../klass'),
    CONSTANTS = require('../../../constants');

Klass.define('manager.commonjs.packages.Compiler',{
    statics : {
        types : {
            CJSCompiler : CJS,
            None : Base
        }
    },
    constructor : function(type){
        this
            .extend({
                type : type
            })
            .extend({
                compiler : this.getCompiler()
            });
    },
    getCompiler : function(){
        var me = this,
            $class = me.getClass();

        if (me.type in $class.types) {
            var c = $class.types[me.type];
            return new c();
        }

        throw new Error(printf(CONSTANTS.ERRORS.COMPILER_GET,'name',me.type));
    },
    getConfig : function(){
        return this.compiler.getConfig();
    },
    onFind : function(module,batch){
        this.compiler.onFind(module,batch);
    },
    onLoad : function(module,deps){
        this.compiler.onLoad(module,deps);
    },
    onCompile : function(module,parsed){
        this.compiler.onCompile(module,parsed);
    },
    register : function(module){
        var me = this;

        module
            .on('find',me.onFind,me)
            .on('load',me.onLoad,me)
            .on('compile',me.onCompile,me);
    }
});

module.exports = Klass.get('manager.commonjs.packages.Compiler');