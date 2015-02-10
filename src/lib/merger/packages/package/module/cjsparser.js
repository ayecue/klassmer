/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    uglifyjs = require('uglify-js'),
    indexOf = require('../../../../common/indexOf'),
    CONSTANTS = require('../../../../constants');

function CJSParser(){
}

CJSParser.prototype = {
    self : CJSParser,
    findRequires : function(selector,findFn){
        var result = [];

        selector.each(function(node){
            if (!node.args[0]) {
                return;
            }

            var module = findFn(node.args[0].value);

            if (!module) {
                return;
            }

            var modulePath = module.getModulePath(),
                vardef = node.$prev,
                dep = {
                    modulePath : modulePath,
                    node : node
                };

            if (vardef.TYPE === CONSTANTS.TYPES.VAR_DEF) {
                dep.name = node.$prev.name.name;
                dep.nesting = node.expression.scope.nesting; 
            } else if (vardef.TYPE === CONSTANTS.TYPES.OBJECT_KEY_VAL) {
                node.modulePath = modulePath;
            } else if (vardef.TYPE === CONSTANTS.TYPES.ASSIGN) {
                node.modulePath = modulePath;
            }

            result.push(dep);
        });

        return result;
    },
    removeRequires : function(selector,findFn){
        selector.each(function(node){
            var $vardef = node.$prev;

            if ($vardef.TYPE === CONSTANTS.TYPES.VAR_DEF) {
                var $var = $vardef.$prev,
                    definitions = $var.definitions,
                    key = indexOf(definitions,function(def){
                        return def.name.name === $vardef.name.name;
                    });

                if (key !== -1) {
                    definitions.splice(key,1);
                }

                if (definitions.length === 0) {
                    var $scope = $var.$prev,
                        index = indexOf($scope.body,function(expression){
                            return expression && expression.TYPE === CONSTANTS.TYPES.VAR && expression.id === $var.id;
                        });

                    if (index !== -1) {
                        $scope.body[index] = null;
                        delete $scope.body[index];
                    }
                }
            } else if ($vardef.TYPE === CONSTANTS.TYPES.OBJECT_KEY_VAL) {
                var modulePath = node.modulePath,
                    module = findFn(modulePath);

                $vardef.value = new uglifyjs.AST_SymbolRef({
                    name : module.getId()
                });
            } else if ($vardef.TYPE === CONSTANTS.TYPES.ASSIGN) {
                var modulePath = node.modulePath,
                    module = findFn(modulePath);

                $vardef.right = new uglifyjs.AST_SymbolRef({
                    name : module.getId()
                });
            }
        });
    },
    replaceVariables : function(selector,name,newName){
        selector.each(function(scope){
            var variable = scope.find_variable(name);

            if (variable) {
                variable.name = newName;
            }
        });
    },
    replaceModuleExport : function(selector){
        selector.each(function(node){
            var $scope = node.$prev,
                key = indexOf($scope.body,function(expression){
                    return expression && expression.TYPE === CONSTANTS.TYPES.SIMPLE_STATEMENT && expression.id === node.id;
                });

            if (key !== -1) {
                $scope.body[key] = new uglifyjs.AST_Return({
                    value : node.body.right
                });
            }
        });
    },
    injectExportVariable : function(selector){
        selector.each(function(scope){
            var arg = new uglifyjs.AST_Object({
                properties : []
                }),
                argName = new uglifyjs.AST_SymbolFunarg({
                    name : "exports"
                }),
                symbolRef = new uglifyjs.AST_SymbolRef({
                    name : "exports"
                }),
                bodyReturn = new uglifyjs.AST_Return({
                    value : symbolRef
                });

            scope.args.push(arg);
            scope.expression.argnames.push(argName);
            scope.expression.body.push(bodyReturn);
        });
    }
};

module.exports = new CJSParser();