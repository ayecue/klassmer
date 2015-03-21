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

module.exports = Klass.define('Klassmer.Info',{
    requires: [
        'Klassmer.Manager',
        'Klassmer.Layout',
        'Klassmer.Generic.Listener'
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
    print : function(){
        var me = this,
            map = me.manager.getDependencyMap();

        return Klassmer.Layout.draw(me.manager.getOutput(),map);
    }
});