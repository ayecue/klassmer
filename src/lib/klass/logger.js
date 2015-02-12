/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../common/forEach'),
	extend = require('../common/extend'),
	printf = require('../common/printf'),
	CONSTANTS = require('../constants');

/**
 *	Trace context location
 */
function analyze(context){
	var info = {};

	Error.captureStackTrace(info);

	var splittedInfo = info.stack.split('\n'),
		indexOfLine = forEach(splittedInfo,function(index,str){
			if (CONSTANTS.LOGGER.SEARCH_PATTERN.test(str)) {
				this.result = index + 1;
				this.skip = true;
			}
		},-1),
		greppedLine = splittedInfo[indexOfLine];

	if (!greppedLine) {
		return;
	} 

	// 1. link - 2. name
	var matches = greppedLine.match(CONSTANTS.LOGGER.TRACE_PATTERN);

	if (!matches) {
		return;
	}

	return printf(CONSTANTS.LOGGER.TRACE_TPL,{
		link : matches.pop(),
		name : matches.pop()
	});
}

/**
 *	Get console display style
 */
function getStyle(color){
	return printf(CONSTANTS.LOGGER.STYLE_TPL,'hexcode',color || CONSTANTS.LOGGER.SUCCESS_COLOR);
}

/**
 *	Generating console message templates
 */
function toMessages(args){
	return forEach(args,function(_,item){
		var messages = this.result,
			type = typeof item;

		if (type == 'string') {
			messages.push('%s');
		} else if (type == 'number') {
			messages.push('%d');
		} else if (type == 'boolean') {
			messages.push('%s');
		} else {
			messages.push('%O');
		}
	},[]);
}

/**
 *	Default print function to show context messages
 */
function print(context,args,error,color){
	var color = error ? CONSTANTS.LOGGER.EXCEPTION_COLOR : color,
		style = getStyle(color),
		base = context.getCalledMethodKlass(),
		contextName = base ? base.getName() : CONSTANTS.LOGGER.UNKNOWN_NAME,
		methodName = context.getCalledMethodName() || CONSTANTS.LOGGER.ANONYMOUS_NAME,
		messages = toMessages(args);

	if (context) {
		if (context.deepLoggingLevel || methodName == CONSTANTS.LOGGER.ANONYMOUS_NAME) {
			var deepTrace = analyze(context);

			console.groupCollapsed.apply(console,['%c' + contextName + '.' + methodName + messages.join(' '),style].concat(args));
			console.log('%c' + deepTrace,style);
			console.groupEnd();
		} else {
			console.log.apply(console,['%c' + contextName + '.' + methodName + messages.join(' '),style].concat(args));
		}
	} else {
		console.log.apply(console,['%c' + messages.join(' '),style].concat(args));
	}
}

/**
 *	External print function
 */
module.exports = function(context,args,error){
	print(context,[].concat('[',args,']'),error,CONSTANTS.LOGGER.USER_COLOR);
};