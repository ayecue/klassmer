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
    Autoloader = require('./autoloader'),
    CONSTANTS = require('./constants');

function Merger(pkg,parser,excludes){
	var me = this;

    me.pkg = pkg;
    me.autoloader = new Autoloader(pkg,excludes);
    me.factory = new Factory(parser,pkg,me.autoloader);
    me.main = me.factory.create(pkg.get('main'),null,pkg.get('name'));
    me.parser = parser;
    me.listener = new Listener();
    me.excludes = excludes;
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
                namespace : me.pkg.get('name')
            }),
            map.each(function(module){
                this.result.push(module.compile());
            },[]).join(seperator),
            me.parser.process(me.parser.getEnd(),{
                namespace : me.pkg.get('name')
            })
        ].join(seperator);

        return code;
    }
};

module.exports = Merger;