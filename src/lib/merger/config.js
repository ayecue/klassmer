/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    typeOf = require('../common/typeOf'),
    extend = require('../common/extend'),
    toArray = require('../common/toArray'),
    Validator = require('./config/validator'),
    CONSTANTS = require('../constants');

function Config(options){
    var me = this;

    me.options = options;
    extend(me,options);
}

Config.prototype = {
    self : Config,
    setSource : function(src){
        this.src = src;
        return this;
    },
    getSource : function(){
        return this.src;
    },
    setOutput : function(out){
        this.out = out;
        return this;
    },
    getOutput : function(){
        return this.out;
    },
    setExcludes : function(excludes){
        this.excludes = excludes;
        return this;
    },
    getExcludes : function(){
        return this.excludes;
    },
    setOptimizer : function(optimizer){
        this.optimizer = optimizer;
        return this;
    },
    getOptimizer : function(){
        return this.optimizer;
    },
    setWrapper : function(wrapper){
        this.wrapper = wrapper;
        return this;
    },
    getWrapper : function(){
        return this.wrapper;
    },
    setNamespace : function(namespace){
        this.namespace = namespace;
        return this;
    },
    getNamespace : function(){
        return this.namespace;
    },
    setSeparator : function(separator){
        this.separator = separator;
        return this;
    },
    getSeparator : function(){
        return this.separator;
    },
    validate : function(){
        var me = this,
            validator = new Validator(me);

        validator
            .add('src',function(v,c){
                return !!v;
            },CONSTANTS.ERRORS.CONFIG_SRC)
            .add('out',function(v){
                return !!v;
            },CONSTANTS.ERRORS.CONFIG_OUT)
            .add('namespace',function(v){
                return typeOf(v) === "string";
            },CONSTANTS.ERRORS.CONFIG_NAMESPACE)
            .add('separator',function(v){
                return typeOf(v) === "string";
            },CONSTANTS.ERRORS.CONFIG_SEPARATOR)
            .add('wrap.moduleFile',function(v){
                return !v || fs.statSync(v).isFile();
            },CONSTANTS.ERRORS.CONFIG_MODULE_FILE,function(v,c){
                c.wrapper.module = fs.readFileSync(v,{
                    encoding : CONSTANTS.READ.ENCODING,
                    flag : CONSTANTS.READ.FLAG
                });
            })
            .add('wrap.startFile',function(v){
                return !v || fs.statSync(v).isFile();
            },CONSTANTS.ERRORS.CONFIG_START_FILE,function(v,c){
                c.wrapper.start = fs.readFileSync(v,{
                    encoding : CONSTANTS.READ.ENCODING,
                    flag : CONSTANTS.READ.FLAG
                });
            })
            .add('wrap.endFile',function(v){
                return !v || fs.statSync(v).isFile();
            },CONSTANTS.ERRORS.CONFIG_END_FILE,function(v,c){
                c.wrapper.end = fs.readFileSync(v,{
                    encoding : CONSTANTS.READ.ENCODING,
                    flag : CONSTANTS.READ.FLAG
                });
            })
            .add('optimizer',function(v){
                return !!v;
            },CONSTANTS.ERRORS.CONFIG_OPTIMIZER)
            .evaluate();

        return me;
    }
};

module.exports = Config;