/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

exports.SELECTOR = {
	SINGLE : 4,
	MULTIPLE : 8
};

exports.TYPES = {
	FUNCTION : "Function",
	VAR : "Var",
	VAR_DEF : "VarDef",
	ASSIGN : "Assign",
	CALL : "Call",
	SIMPLE_STATEMENT : "SimpleStatement",
	TOPLEVEL : "Toplevel",
	OBJECT : "Object",
	OBJECT_KEY_VAL : "ObjectKeyVal" 
};

exports.NORMALIZER = {
	RELATIVE : /^\.\//,
	RELATIVE_BACK : /^\.\.\//,
	LAST_DIR : /\/?[^\/]+\/?$/
};

exports.ID = {
	PREFIX : "klassmer",
	DEFAULT : 0
};

exports.GENERATOR = {
	STACK : "node#",
	MODULE : "module_"
};

exports.FINDER = {
	MAIN_SCOPE : 0,
	ALL_SCOPES : 1,
	REQUIRES : 2,
	MODULE_EXPORT : 3,
	EXPORTS : 4
};

exports.READ = {
	ENCODING : 'utf8',
	FLAG : 'r'
};