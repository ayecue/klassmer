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
	DEFAULT : "commonjs"
};

exports.AST_TYPES = {
	FUNCTION : "Function",
	VAR : "Var",
	VAR_DEF : "VarDef",
	ASSIGN : "Assign",
	CALL : "Call",
	SIMPLE_STATEMENT : "SimpleStatement",
	TOPLEVEL : "Toplevel",
	OBJECT : "Object",
	OBJECT_KEY_VAL : "ObjectKeyVal",
	IF : "If",
	BLOCK_STATEMENT : "BlockStatement",
	SYMBOL_REF : "SymbolRef",
	RETURN : "Return"
};

exports.AUTOLOADER = {
	RELATIVE : /^\.\//,
	RELATIVE_BACK : /^\.\.\//,
	LAST_DIR : /\/?[^\/]+\/?$/,
	EXTENSION : /\.js$/i,
	EMPTY : /^\/?$/
};

exports.ID = {
	PREFIX : "klassmer",
	DEFAULT : 0
};

exports.GENERATOR = {
	STACK : "node#",
	MODULE : "module_",
	NODE : "internal_"
};

exports.CJS_COMPILER = {
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

exports.PACKAGES = {
	HOME : process.env.NODE_PATH,
	FILE_NAME : 'package.json'
};

exports.CJS_DEFAULTS = {
	SEPARATOR : "\n\n",
	NAMESPACE : "result",
	MODULE : "var <%= idx %> = (function(){ <%= code %> })();",
	START : "(function (global, factory) {global.<%= namespace %> = factory(global);}(this, function (global) {",
	END : "return <%= namespace %>;}));",
	OPTIMIZER : {
        beautify : true,
        comments : true
    },
    COMPILER : 'CJSCompiler'
};

exports.ERRORS = {
	CONFIG_SRC : 'Please define src parameter in options.',
	CONFIG_OUT : 'Please define out parameter in options.',
	CONFIG_NAMESPACE : 'Invalid namespace option. Have to be a string.',
	CONFIG_SEPARATOR : 'Invalid separator option. Have to be a string.',
	CONFIG_MODULE_FILE : 'Invalid wrap.moduleFile option. Not a file.',
	CONFIG_START_FILE : 'Invalid wrap.startFile option. Not a file.',
	CONFIG_END_FILE : 'Invalid wrap.endFile option. Not a file.',
	CONFIG_OPTIMIZER : 'Invalid optimizer options.',
	CONFIG_COMPILER : 'Invalid compiler options.',
	CONFIG_VALIDATE_EMPTY : 'Empty validation.',
	MAP_IS_CYCLIC : 'Dependency map is cyclic.',
	AUTOLOADER_GET_FILE : 'Cannot find file: <%= file %>',
	AUTOLOADER_GET_MODULE : 'Cannot find file: <%= module %>',
	MODULE_LOAD : 'Invalid require path "<%= modulePath %>".',
	PARSER_PARSE : 'Error while parsing <%= file %>.',
	PACKAGES_ADD : 'Main package option is not defined in <%= src %>.',
	COMPILER_GET : 'Compiler type with the name <%= name %> not found.',
	NO_KLASS_FOUND : '<%= name %> do not exist.',
	EVAL : 'Compile exception in code: <%= code %> (%message%)',
	MANAGER_GET : 'Type <%= type %> not found'
};

exports.KLASS = {
	DEBUGGING : false,
	SINGLETON : false,
	AUTO : true,
	TEMPLATE : 'return function <%= name %>(){this._init && this._init();return this.constructor.apply(this, arguments) || null;};'
};

exports.LOGGER = {
	EXCEPTION_COLOR : '#D8000C',
	SUCCESS_COLOR : '#4F8A10',
	USER_COLOR : '#008B8B',
	UNKNOWN_NAME : 'unknown',
	ANONYMOUS_NAME : 'anonymous',
	SEARCH_PATTERN : /pLogMessage/i,
	TRACE_PATTERN : /at\s(\S+)\s[^\(]*\(([^\)]+)\)/i,
	TRACE_TPL : '${<%=name%>} (<%=link%>)',
	STYLE_TPL : 'color:<%=hexcode%>;'
};

exports.LAYOUT = {
	UNKNOWN : 'unknown'
};