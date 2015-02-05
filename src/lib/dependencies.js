/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach'),
    indexOf = require('./indexOf');

function Dependencies(){
    var me = this;

    me.collection = [];
}

Dependencies.prototype = {
    self : Dependencies,
    indexOf : function(modulePath){
        var me = this;

        return indexOf(me.collection,function(module){
            return module.modulePath === modulePath;
        });
    },
    findAll : function(modulePath){
        var me = this;

        return forEach(me.collection,function(_,module){
            if (module.modulePath === modulePath) {
                this.result.push(module);
            }
        },[]);
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
        var me = this;

        me.collection.push.apply(me.collection,arguments);
    },
    each : function(fn,ctx){
        var me = this;

        return forEach(me.collection,function(_,module){
            fn.call(this,module);
        },ctx);
    }
};

module.exports = Dependencies;