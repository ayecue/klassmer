/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    Klass = require('../../klass'),
    typeOf = require('../../common/typeOf'),
    extend = require('../../common/extend'),
    toArray = require('../../common/toArray'),
    Validator = require('../../generic/validator'),
    Config = require('../../generic/config'),
    CONSTANTS = require('../../constants');

Klass.define('manager.commonjs.Config',{
    extends : 'generic.Config',
    separator : CONSTANTS.CJS_DEFAULTS.SEPARATOR,
    namespace : CONSTANTS.CJS_DEFAULTS.NAMESPACE,
    wrapper : {
        module : CONSTANTS.CJS_DEFAULTS.MODULE,
        start : CONSTANTS.CJS_DEFAULTS.START,
        end : CONSTANTS.CJS_DEFAULTS.END
    },
    wrap : {
        moduleFile : null,
        startFile : null,
        endFile : null
    },
    compiler : CONSTANTS.CJS_DEFAULTS.COMPILER,
    optimizer : CONSTANTS.CJS_DEFAULTS.OPTIMIZER,
    excludes : null,
    source : null,
    output : null,
    constructor : function(options){
        var me = this;

        me.callParent(arguments);
        me.optimizer = options.optimizer || me.optimizer;
    },
    validate : function(){
        var me = this,
            validator = new Validator(me);

        validator
            .add('source',function(v,c){
                return !!v;
            },CONSTANTS.ERRORS.CONFIG_SRC)
            .add('output',function(v){
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
            .add('compiler',function(v){
                return !!v;
            },CONSTANTS.ERRORS.CONFIG_COMPILER)
            .evaluate();

        return me;
    }
});

module.exports = Klass.get('manager.commonjs.Config');