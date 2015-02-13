/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    path = require('path'),
    printf = require('../../../../common/printf'),
    forEach = require('../../../../common/forEach'),
    from = require('../../../../common/from'),
    manipulator = require('./manipulator'),
    Package = require('../package'),
    Klass = require('../../../../klass'),
    CONSTANTS = require('../../../../constants');

Klass.define('manager.commonjs.packages.package.Autoloader',{
    constructor : function(pkg,excludes){
        this.extend({
            package : pkg,
            excludes : excludes || []
        });
    },
    isExcluded : function(module){
        return this.excludes.indexOf(module) !== -1;
    },
    existFile : function(file){
        return fs.existsSync(file) && fs.statSync(file).isFile();
    },
    existDirectory : function(dir){
        return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
    },
    conjure : function(module,dir){
        var me = this;

        if (!me.existDirectory(dir)) {
            dir = path.dirname(dir);
        }

        var file = path.join(dir,manipulator.extension(module));

        if (me.existFile(file)) {
            return me.package.try(file);
        }

        var nodeModule = path.resolve(dir,path.join('node_modules',module));

        if (me.existDirectory(nodeModule)) {
            var pkg = me.package.getScope().try(path.join(nodeModule,'package.json'));

            return pkg.try(pkg.get('main'));
        }
    },
    wizard : function(module,current){
        var me = this,
            nodeModule = me.conjure(module,current);

        if (nodeModule) {
            return nodeModule;
        } else if (manipulator.isEmpty(current)) {
            var homes = CONSTANTS.PACKAGES.HOME.split(':');

            return forEach(homes,function(_,home){
                var nm = me.conjure(module,home);

                if (nm) {
                    this.result = nm;
                    this.skip = true;
                }
            });
        } else {
            return me.wizard(module,path.normalize(path.resolve(current,'..')));
        }
    },
    find : function(module){
        var me = this,
            base = me.package.get('main');

        return me.wizard(module,base);
    },
    get : function(source,target){
        var me = this;

        if (me.isExcluded(target)) {
            return;
        }

        var module;

        if (target.charAt(0) === '.') {
            var dir = path.dirname(source);

            if (target.charAt(1) === '.') {
                dir = manipulator.removeLastDirectory(dir);

                module = me.package.try(manipulator.extension(manipulator.relativeUp(target,dir)));
            } else {
                module = me.package.try(manipulator.extension(manipulator.relative(target,dir)));
            }

            if (!module) {
                throw new Error(printf(CONSTANTS.ERRORS.AUTOLOADER_GET_FILE,'file',target));
            }
        } else {
            module = me.find(target);

            if (!module) {
                throw new Error(printf(CONSTANTS.ERRORS.AUTOLOADER_GET_MODULE,'module',target));
            }
        }

        return module;
    }
});

module.exports = Klass.get('manager.commonjs.packages.package.Autoloader');