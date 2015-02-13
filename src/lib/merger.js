/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('./klass'),
    Listener = require('./generic/listener'),
    Event = require('./traits/event'),
    Manager = require('./manager'),
    writeFile = require('./common/writeFile'),
    CONSTANTS = require('./constants');

Klass.define('Merger',{
    traits : [
        'traits.Event'
    ],
    constructor : function(type,options){
        var me = this;

        me.extend({
            listener : new Listener(),
            options : options,
            type : type,
            manager : Manager.get(type,options)
        });

        me.initEvents();
    },
    initEvents : function(){
        var me = this;

        me.manager
            .on('find',function(){
                me.fire('find',me,arguments);
            })
            .on('load',function(){
                me.fire('load',me,arguments);
            })
            .on('sort',function(){
                me.fire('sort',me,arguments);
            });
    },
    write : function(){
        var me = this,
            output = me.manager.toString();

        return writeFile(me.manager.getOutput(),output);
    }
});

module.exports = Klass.get('Merger');