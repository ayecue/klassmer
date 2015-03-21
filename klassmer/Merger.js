/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    CONSTANTS = require('./constants');

module.exports = Klass.define('Klassmer.Merger',{
    requires: [
        'Klassmer.Manager',
        'Klassmer.Generic.Listener',
        'Klassmer.Util'
    ],
    mixins : {
        ev: 'Klassmer.Mixins.Event'
    },
    constructor : function(type,options){
        var me = this;

        me.extend({
            listener : new Klassmer.Generic.Listener(),
            options : options,
            type : type,
            manager : Klassmer.Manager.get(type,options)
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

        return Klassmer.Util.writeFile(me.manager.getOutput(),output);
    }
});