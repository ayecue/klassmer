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
    Klass = require('node-klass'),
    printf = Klass.printf,
    CONSTANTS = require('../../../constants');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages.Compiler',{
    requires : [
        'Klassmer.Manager.CommonJs.Packages.Compiler.Cjs',
        'Klassmer.Manager.CommonJs.Packages.Compiler.Base'
    ],
    constructor : function(type){
        this
            .extend({
                type : type,
                types : {
                    CJSCompiler : Klassmer.Manager.CommonJs.Packages.Compiler.Cjs,
                    None : Klassmer.Manager.CommonJs.Packages.Compiler.Base
                }
            })
            .extend({
                compiler : this.getCompiler()
            });
    },
    getCompiler : function(){
        var me = this;

        if (me.type in me.types) {
            var c = me.types[me.type];
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