/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    forEach = Klass.forEach,
    indexOf = Klass.indexOf,
    CONSTANTS = require('../../../constants');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages.Map',{
    extends : 'Klassmer.Generic.Map',
    requires : [
        'Klassmer.Generic.Map',
        'Klassmer.Manager.CommonJs.Packages.Package.Map'
    ],
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

        var newMap = new Klassmer.Manager.CommonJs.Packages.Package.Map();
        return newMap.add.apply(newMap,result);
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
});