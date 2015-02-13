/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../../../../../common/forEach'),
    indexOf = require('../../../../../common/indexOf'),
    $Map = require('../../../../../generic/map'),
    Klass = require('../../../../../klass');

Klass.define('manager.commonjs.packages.package.module.Dependencies',{
    extends : 'generic.Map',
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
    }
})

module.exports = Klass.get('manager.commonjs.packages.package.module.Dependencies');