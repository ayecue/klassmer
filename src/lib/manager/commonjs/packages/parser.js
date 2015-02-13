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
    printf = require('../../../common/printf'),
    Klass = require('../../../klass'),
    Parser = require('../../../generic/parser'),
    CONSTANTS = require('../../../constants');

Klass.define('manager.commonjs.packages.Parser',{
    extends : 'generic.Parser',
    constructor : function(config){
        this.extend({
            wrapper : config.getWrapper(),
            separator : config.getSeparator(),
            optimizer : config.getOptimizer()
        });
    },
    getStart : function(){
        return this.wrapper.start;
    },
    getEnd : function(){
        return this.wrapper.end;
    },
    wrap : function(idx,code){
        var me = this;

        return me.process(me.wrapper.module, {
            idx : idx,
            code : code
        });
    },
    parse : function(idx,file){
        var me = this,
            code = fs.readFileSync(file,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            }),
            wrapped = me.wrap(idx,code);

        try {
            return uglifyjs.parse(wrapped);
        } catch (e) {
            throw new Error(printf(CONSTANTS.ERRORS.PARSER_PARSE,'file',file));
        }
    }
});

module.exports = Klass.get('manager.commonjs.packages.Parser');