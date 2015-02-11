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
    CJSCompiler = require('./compiler/cjscompiler'),
    None = require('./compiler/none'),
    printf = require('../common/printf'),
    CONSTANTS = require('../constants');

function Compiler(type){
    var me = this;

    me.type = type;
    me.compiler = me.getCompiler();
}

Compiler.types = {
    CJSCompiler : CJSCompiler,
    None : None
};

Compiler.prototype = {
    self : Compiler,
    getCompiler : function(){
        var me = this;

        if (me.type in me.self.types) {
            var c = me.self.types[me.type];
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

        module.getListener()
            .on('find',me.onFind,me)
            .on('load',me.onLoad,me)
            .on('compile',me.onCompile,me);
    },
    unregister : function(module){
        var me = this;

        module.getListener()
            .off('find',me.onFind)
            .off('load',me.onLoad)
            .off('compile',me.onCompile);
    }
};

module.exports = Compiler;