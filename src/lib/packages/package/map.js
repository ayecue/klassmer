/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../../common/forEach'),
    indexOf = require('../../common/indexOf'),
    CONSTANTS = require('../../constants');

function Map(){
    this.collection = [];
}

Map.prototype = {
    self : Map,
    indexOf : function(modulePath){
        var me = this;

        return indexOf(me.collection,function(module){
            return module.getModulePath() === modulePath;
        });
    },
    find : function(modulePath){
        var me = this,
            idx = me.indexOf(modulePath);

        if (idx !== -1) {
            return me.collection[idx];
        }

        return null;
    },
    add : function(){
        var me = this
        me.collection.push.apply(me.collection,arguments);
        return me;
    },
    all : function(){
        return [].concat(this.collection);
    },
    set : function(collection){
        var me = this;

        me.collection = collection;
        return me;
    },
    size : function(){
        return this.collection.length;
    },
    each : function(fn,ctx){
        var me = this;

        return forEach(me.collection,function(_,module){
            fn.call(this,module);
        },ctx);
    },
    clear : function(){
        this.collection = [];
    }
};

module.exports = Map;