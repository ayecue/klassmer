/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Listener = require('./generic/listener'),
    Packages = require('./merger/packages'),
    Config = require('./merger/config'),
    writeFile = require('./common/writeFile');

function Merger(options){
	var me = this;

    me.config = new Config(options).validate();
    me.packages = new Packages(me.config);
    me.listener = new Listener();

    me.initEvents();
}

Merger.prototype = {
	self : Merger,
    getListener : function(){
        return this.listener;
    },
    initEvents : function(){
        var me = this;

        me.packages.getListener()
            .on('find',function(){
                me.listener.fire('find',me,arguments);
            })
            .on('load',function(){
                me.listener.fire('load',me,arguments);
            })
            .on('sort',function(){
                me.listener.fire('sort',me,arguments);
            });
    },
    write : function(){
        var me = this,
            output = me.packages.toString();

        return writeFile(me.config.getOutput(),output);
    }
};

module.exports = Merger;