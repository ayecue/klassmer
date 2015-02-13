/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../../../common/forEach'),
    indexOf = require('../../../common/indexOf'),
    ModuleMap = require('./package/map'),
    Klass = require('../../../klass'),
    $Map = require('../../../generic/map'),
    CONSTANTS = require('../../../constants');

Klass.define('manager.commonjs.packages.Map',{
    extends : 'generic.Map',
    indexOf : function(name){
        var me = this;

        return indexOf(me.collection,function(pkg){
            return pkg.get('name') === name;
        });
    },
    find : function(name){
        var me = this,
            idx = me.indexOf(name);

        if (idx !== -1) {
            return me.collection[idx];
        }

        return null;
    },
    findModule : function(modulePath){
        var me = this;

        return forEach(me.collection,function(_,pkg){
            var module = pkg.getMap().find(modulePath);

            if (module) {
                this.result = module;
                this.skip = true;
            }
        });
    },
    all : function(){
        var me = this;

        return forEach(me.collection,function(_,pkg){
            this.result = this.result.concat(pkg.allModules());
        },[]);
    },
    sort : function(){
        var me = this,
            result = [],
            left = me.all(),
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

        return ModuleMap.prototype.add.apply(new ModuleMap(),result);
    },
    isCyclic: function(module){
        var me = this;

        return module.getDependencies().each(function(dep){
            var otherModule = me.findModule(dep.modulePath),
                otherDeps = otherModule.getDependencies();

            if (otherDeps.find(module.getModulePath())) {
                throw new Error(CONSTANTS.ERRORS.MAP_IS_CYCLIC);
            }
        },false);
    }
})

module.exports = Klass.get('manager.commonjs.packages.Map');