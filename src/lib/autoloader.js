/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    forEach = require('./forEach'),
    path = require('path'),
    from = require('./from'),
    Package = require('./package'),
    File = require('./file'),
    CONSTANTS = require('./constants');

function Autoloader(pkg,excludes){
    var me = this;

    me.pkgs = from(pkg);
    me.excludes = excludes || [];
}

Autoloader.manipulate = {
    removeLastDirectory : function(dir) {
        return dir.replace(CONSTANTS.AUTOLOADER.LAST_DIR,'');
    },
    relativeUp : function(target,dir) {
        return target.replace(CONSTANTS.AUTOLOADER.RELATIVE_BACK,dir + '/');
    },
    relative : function(target,dir){
        return target.replace(CONSTANTS.AUTOLOADER.RELATIVE,dir + '/');
    },
    extension : function(target){
        if (CONSTANTS.AUTOLOADER.EXTENSION.test(target)) {
            return target;
        }
        return [target,'js'].join('.');
    },
    isEmpty : function(target){
        return CONSTANTS.AUTOLOADER.EMPTY.test(target);
    }
};

Autoloader.prototype = {
    self : Autoloader,
    isExcluded : function(module){
        return this.excludes.indexOf(module) !== -1;
    },
    addExcludes : function(){
        var me = this;

        me.excludes.push.apply(me.excludes,arguments);
        return me;
    },
    addPackages : function(){
        var me = this;

        me.pkgs.push.apply(me.pkgs,arguments);
        return me;
    },
    getBases : function(){
        return forEach(this.pkgs,function(_,pkg){
            this.result.push(pkg.get('main'));
        },[]);
    },
    existFile : function(file){
        return fs.existsSync(file) && fs.statSync(file).isFile();
    },
    existDir : function(dir){
        return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
    },
    conjure : function(module,dir){
        var me = this,
            manipulate = me.self.manipulate;

        if (!me.existDir(dir)) {
            dir = path.dirname(dir);
        }

        var file = path.join(dir,manipulate.extension(module));

        if (me.existFile(file)) {
            return file;
        }

        var nodeModule = path.resolve(dir,path.join('node_modules',module));

        if (me.existDir(nodeModule)) {
            var pkg = Package.read(path.join(nodeModule,'package.json'));

            me.addPackages(pkg);
            return manipulate.extension(path.resolve(nodeModule,pkg.get('main')));
        }
    },
    wizard : function(module,current){
        var me = this,
            manipulate = me.self.manipulate,
            nodeModule = me.conjure(module,current);

        if (nodeModule) {
            return nodeModule;
        } else if (manipulate.isEmpty(current)) {
            var homes = CONSTANTS.PACKAGES.HOME.split(':');

            return forEach(homes,function(_,home){
                var nm = me.conjure(module,home);

                if (nm) {
                    this.result = nm;
                    this.skip = true;
                }
            },'');
        } else {
            return me.wizard(module,path.normalize(path.resolve(current,'..')));
        }
    },
    find : function(module){
        var me = this,
            manipulate = me.self.manipulate,
            bases = me.getBases();

        return forEach(bases,function(_,base){
            var nodeModule = me.wizard(module,base);

            if (nodeModule) {
                this.result = nodeModule;
                this.skip = true;
            }
        },'');
    },
    get : function(source,target){
        var me = this,
            manipulate = me.self.manipulate,
            current = path.dirname(source),
            result = '';

        if (target.charAt(0) === '.') {
            if (target.charAt(1) === '.') {
                var dir = manipulate.removeLastDirectory(current);

                result = manipulate.relativeUp(target,dir);
                result = manipulate.extension(result);
            } else {
                result = manipulate.relative(target,current);
                result = manipulate.extension(result);
            }

            if (!me.existFile(result)) {
                throw new Error('Cannot find file: ' + result);
            }
        } else if (me.isExcluded(target)) {
            return new File(target,true);
        } else {
            result = me.find(target);

            if (!me.existFile(result)) {
                throw new Error('Cannot find file: ' + target);
            }
        }

        return new File(result);
    }
};

module.exports = Autoloader;