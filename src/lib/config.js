/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    typeOf = require('./typeOf'),
    extend = require('./extend'),
    toArray = require('./toArray'),
    CONSTANTS = require('./constants');

function Config(options){
    var me = this;

    me.options = options;
    extend(me,options);
}

Config.prototype = {
    self : Config,
    validate : function(){
        var me = this,
            options = me.options;

        if (!me.src) {
            throw new TypeError('Please define src parameter in options.');
        }

        if (!me.out) {
            throw new TypeError('Please define out parameter in options.');
        }

        if (typeOf(me.namespace) !== "string") {
            throw new TypeError('Invalid namespace option. Have to be a string.');
        }

        if (typeOf(me.separator) !== "string") {
            throw new TypeError('Invalid separator option. Have to be a string.');
        }

        if (options.wrap.moduleFile) {
            if (!fs.statSync(options.wrap.moduleFile).isFile()) {
                throw new TypeError('Invalid wrap.moduleFile option. Not a file.');
            }

            me.wrapper.module = fs.readFileSync(options.wrap.moduleFile,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            });
        }

        if (options.wrap.startFile) {
            if (!fs.statSync(options.wrap.startFile).isFile()) {
                throw new TypeError('Invalid wrap.startFile option. Not a file.');
            }

            me.wrapper.start = fs.readFileSync(options.wrap.startFile,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            });
        }

        if (options.wrap.endFile) {
            if (!fs.statSync(options.wrap.endFile).isFile()) {
                throw new TypeError('Invalid wrap.endFile option. Not a file.');
            }

            me.wrapper.end = fs.readFileSync(options.wrap.endFile,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            });
        }

        if (!me.optimizer) {
            throw new TypeError('Invalid optimizer options.');
        }
    }
};

module.exports = Config;