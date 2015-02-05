/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Generator = require('./generator'),
    Factory = require('./factory'),
    Listener = require('./listener'),
    CONSTANTS = require('./constants');

function Merger(mainfile,parser){
	var me = this;

    me.factory = new Factory(parser);
    me.main = me.factory.create(mainfile,null,parser.getNamespace());
    me.parser = parser;
    me.listener = new Listener();
}

Merger.prototype = {
	self : Merger,
    getListener : function(){
        return this.listener;
    },
    run : function(process){
        var me = this,
            map = me.factory.getMap(),
            seperator = me.parser.optimizer.beautify ? me.parser.getSeperator() : '';

        me.main.parse().find();
        me.listener.fire('find',me,[me.main,map]);

        me.main.load();
        me.listener.fire('load',me,[me.main,map]);

        map.set(map.sort());
        me.listener.fire('sort',me,[me.main,map]);

        var code = [
            me.parser.process(me.parser.getStart(),{
                namespace : me.parser.getNamespace()
            }),
            map.each(function(module){
                this.result.push(module.compile());
            },[]).join(seperator),
            me.parser.process(me.parser.getEnd(),{
                namespace : me.parser.getNamespace()
            })
        ].join(seperator);

        return code;
    }
};

module.exports = Merger;