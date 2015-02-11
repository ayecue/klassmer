/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Listener = require('./generic/listener'),
    Packages = require('./packages'),
    Config = require('./info/config'),
    writeFile = require('./common/writeFile');

function Info(options){
	var me = this;

    me.config = new Config(options).validate();
    me.packages = new Packages(me.config);
    me.listener = new Listener();

    me.initEvents();
}

Info.prototype = {
	self : Info,
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
    print : function(){
        var me = this;

        me.packages.find().load();

        var map = me.packges.getMap();

        debugger;
        debugger;
    }
};

module.exports = Info;