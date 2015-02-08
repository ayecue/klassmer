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
        var me = this;

        me.collection.push.apply(me.collection,arguments);
    },
    set : function(collection){
        var me = this;

        me.collection = collection;
        return me;
    },
    size : function(){
        return this.collection.length;
    },
    sort : function(){
        var me = this,
            result = [],
            left = [].concat(me.collection),
            queue = function(collection){
                return forEach(collection,function(_,module){
                    var modulePath = module.getModulePath(),
                        isRequired = forEach(left,function(_,m){
                            if (modulePath !== m.getModulePath() && m.getDependencies().find(modulePath)) {
                                this.result = m;
                                this.skip = true;
                            }
                        });

                    if (isRequired) {
                        this.result.push(module);
                    } else {
                        result.unshift(module);
                    }
                },[]);
            };

        while (left.length > 0) {
            left = queue(left);
        }

        return result;
    },
    each : function(fn,ctx){
        var me = this;

        return forEach(me.collection,function(_,module){
            fn.call(this,module);
        },ctx);
    },
    isCyclic: function(){
        var me = this;

        return forEach(me.collection,function(_,module){
            var deps = module.getDependencies(),
                found = deps.each(function(dep){
                    var otherModule = me.find(dep.modulePath),
                        otherDeps = otherModule.getDependencies();

                    if (otherDeps.find(module.getModulePath())) {
                        throw new Error(CONSTANTS.ERRORS.MAP_IS_CYCLIC);
                    }
                },false);

            if (found) {
                this.result = true;
                this.skip = true;
            }
        },false);
    },
    clear : function(){
        this.collection = [];
    }
};

module.exports = Map;