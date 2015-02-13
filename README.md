# klassmer v0.4.0
[![Build Status](https://travis-ci.org/ayecue/klassmer.png?branch=master)](https://travis-ci.org/ayecue/klassmer)

> Optimize CommonJS projects for your browser.


## Getting Started
This plugin requires UglifyJS `~2.4.16`

Install this plugin with this command:

```shell
npm install klassmer
```


## Description

This package will merge your CommonJS project to one file to use it in frontend without any overhead. Also you can generate HTML files which show all dependencies of your project. Also you got the possibility to use the intern 'Klass' system in your project.


## Changelog

Since `~0.3.0` there's also an autoloader which also loads external modules. If you don't want to add certain modules you are able to exclude them with the new `excludes` property.

Since `~0.3.2` klassmer automaticly detects if you have choosen a javascript file as source or a package json.

Since `~0.3.5` optimized certain finder options and loading (so it's faster). I also tried klassmer on react-bootstrap which seems to be working.

Since `~0.3.6` optimized processor for call types.

Since `~0.3.7` removed some unnecessary deps.

Since `~0.3.8` improved logic of package mapping. Merging is abit slower now since cyclic checking is more complex. In the next release I'll try to improve speed again.

Since `~0.3.9` you can select which compiler you want to use (right now there's just one for CommonJS). Also the speed of the cyclic check is now faster.

Since `~0.4.0` refactored the whole library in preperation to new possible code patterns. Added functionality to create a html file which shows all dependencies.


## Example:

Example project: [require-klass](https://github.com/ayecue/require-klass)

Simple merge:
```shell
klassmer --source tmp/klass.js --output amd/merged.js
```

Merge with namespace:
```shell
klassmer --source tmp/klass.js --output amd/merged.js --namespace klass
```

Info:
```shell
klassmer-info --source tmp/klass.js --output amd/visual.html
```


## Arguments

### klassmer

#### -f, --source
Type: `String`
Path to main project javascript file or package json. (All other files will get loaded automaticly)

#### -t, --output
Type: `String`
Path to merged output file.

#### -n, --namespace (optional)
Type: `String`
Name of the output variable of your main module.

#### -m, --module (optional)
Type: `String`
Wrapper for every single module.

#### -s, --start (optional)
Type: `String`
Start of wrapper for whole merged project.

#### -e, --end (optional)
Type: `String`
End of wrapper for whole merged project.

#### -w, --moduleFile (optional)
Type: `String`
Path to file which should wrap for every single module.

#### -a, --startFile (optional)
Type: `String`
Path to file which should start wrapping the whole merged project.

#### -z, --endFile (optional)
Type: `String`
Path to file which should end wrapping the whole merged project.

#### -p, --separator (optional)
Type: `String`
Seperator between all modules.

#### -x, --excludes (optional)
Type: `String`
Ignore certain required modules.

#### -c, --compiler (optional)
Type: `String`
Compiler which will go through the modules.


### klassmer-info

#### -f, --source
Type: `String`
Path to main project javascript file or package json. (All other files will get loaded automaticly)

#### -t, --output
Type: `String`
Path to merged output file.

#### -x, --excludes (optional)
Type: `String`
Ignore certain required modules.

#### -c, --compiler (optional)
Type: `String`
Compiler which will go through the modules.


## Functions

#### klassmer.forEach
Arguments: `Object`, `Function`, `Mixed`
Return: `Mixed`

Basicly this a method to loop through objects. But it got one nice feature. You can use a context object which got two properties 'result' and 'skip'.

Example usage: 
```
var removedUnderscoreArray = forEach(['_w','_t','_m'],function(index,value){
	this.result.push(value.replace('_',''));
},[]);

console.log(removedUnderscoreArray.join(','));
```


#### klassmer.typeOf
Arguments: `Object`
Return: `String`

Get type of object.

Example usage: 
```
typeOf(0); //number
typeOf([]); //array
typeOf({}); //object
```


#### klassmer.toArray
Arguments: `Object`
Return: `Array`

Simple method to convert 'array-like-objects' to arrays.

Example usage: 
```
function getFirstArg(){
	var args = toArray(arguments);

	return args.shift();	
};
```


#### klassmer.from
Arguments: `Object`
Return: `Array`

Always returns an Array.

Example usage: 
```
from('test'); //returns ['test']
```


#### klassmer.getNamespace
Arguments: `String`, `Object`, `String`
Return: `Mixed`

Get value for certain namespace in object.

Example usage: 
```
var myScope = {
	what {
		mo : {
			lo : 'test'
		}
	}
};

getNamespace('what.mo.lo',myScope); //returns 'test'
```


#### klassmer.setNamespace
Arguments: `String`, `Mixed`, `Object`, `String`
Return: `Mixed`

Set value for certain namespace in object.

Example usage: 
```
var myScope = {};

setNamespace('what.mo.lo','test',myScope);

myScope.what.mo.lo; //returns 'test'
```


#### klassmer.indexOf
Arguments: `Array`, `Function`
Return: `Integer`

Get index of value in object.

Example usage: 
```
var index = indexOf([1,2,3,4],function(id){
	return id === 4;
}); //returns 3
```


#### klassmer.extend
Arguments: `Object`, `Object` [...]
Return: `Object`

Simple extend method to merge multiple objects together.

Example usage: 
```
var objectFusion = extend({
	foo : 0x01
},{
	bar : 0x02
});

objectFusion.foo;
objectFusion.bar;
```


#### klassmer.printf
Arguments: `String`, `Object`
Return: `String`

Could be compared to the php function printf. Fill string templates with values. Also this method got some nice formating functions.

Following formating codes are possible:

* camelcase - Upper first letter
* capitalise - Upper first letter, lower all other letters
* upper - Upper all
* lower - Lower all
* ouletters - Remove everything except upper letters
* olletters - Remove everything except lower letters
* onumber - Remove everything except numbers
* olettersnumber - Remove everything except letters and numbers
* oword - Just allow normal chars
* ruletters - Remove all upper letters
* rlletters - Remove all lower letters
* rnumber - Remove all numbers
* rword - Remove all word chars
* rdot - Remove all dots
* trim - Remove whitespaces left/right
* triml - Remove whitespaces left
* trimr - Remove whitespaces right

Example usage: 
```
//simple single
printf('%name% has a problem with WAYNE','name','Joe');

//simple multiple
printf('%name% has a problem with %troublemaker%',{
	name : 'Joe',
	troublemaker : 'WAYNE'
});

//advanced multiple
printf('%:capitalise,trim:name% has a problem with %:upper:troublemaker%',{
	name : 'joe',
	troublemaker : 'wayne'
});
```


#### klassmer.merge
Arguments: `Object`

Merge all project files.


#### klassmer.info
Arguments: `Object`

Create dependency html.


## Classes

### klassmer.Listener
#### Listener.on
#### Listener.off
#### Listener.fire


### klassmer.Merger
#### Listener.write


### klassmer.Info
#### Listener.print


### klassmer.Klass

#### Klass.override

Override certain class. Just as you would define a new class but overriding an already existing class.

Example usage: 
```
Klass.override('w.smaller',{
	statics : {
		myFunc : function(){
			return 2;
		}
	},
	lulu : {
		5 : 6
	},
	foo : function(){
		this.callParent(['foo']);
		this.logMessage('wassup',true);
	}
});
```


#### Klass.set

Set certain namespace in $scope object of Klass.

Example usage: 
```
Klass.set('what.mo.lo','test');

Klass.$scope.what.mo.lo; //returns 'test'
```


#### Klass.get

Get certain namespace in $scope object of Klass.

Example usage: 
```
Klass.$scope.what.mo.lo = 'test';

Klass.get('what.mo.lo'); //returns 'test'
```


#### Klass.define

This method is there to create your classes. It's the basic klass constructor.

Following properties are there to conifgurate your klass:

* extends - Library you want to extend
* requires - Libraries you need in your class
* mixins - Mixins you want to use in your class
* traits - Modules which should get extended to your class
* statics - Static properties which you want to extend to your base

Following defauts statics are extended to your klass:

* singleton - Define if your class is a singleton
* debug - Define if the class is in debug mode
* autoSetterGetter - Define if automaticly setter/getter get created
* getClass() - Get base class/Get constructor
* getMixins() - Get mixins of this class
* getCalledMethod() - Get current called method (just working inside class functions)
* getCalledMethodBase() - Get current called method class (just working inside class functions)
* getCalledMethodName() - Get current called method name (just working inside class functions)
* getCalledMethodFunction() - Get current called method function (just working inside class functions)
* getParent() - Get extending parent
* callParent(arguments) - Call parent method if there's one (just working inside class functions)
* isDebug() - Getter for debug property
* getName() - Get name of class
* logMessage(arguments,isError) - Print message in console in context of class (just working properly inside class functions)
* applyTo(class) - Extend this class to another class

Following defauts statics are extended to your klass:

* isPrototypeObject - Define if this object is an prototype object
* getDefaultValues() - Get default values which should be extended on every new created instance
* getClass() - Get base/constructor of instance
* getCalledMethod() - Get current called method (just working inside class functions)
* getCalledMethodBase() - Get current called method class (just working inside class functions)
* getCalledMethodName() - Get current called method name (just working inside class functions)
* getCalledMethodFunction() - Get current called method function (just working inside class functions)
* callParent(arguments) - Call parent method if there's one (just working inside class functions)
* getParent() - Get extending parent
* getName() - Get name of class
* extend(object1,object2,object3) - Extend properties to current instance
* logMessage(arguments,isError) - Print message in console in context of class (just working properly inside class functions)
* isDebug() - Getter for debug property
* callMixin(MixinName,MixinProperty,arguments) - Call a mixin in context of this class 

Example usage: 
```
var smaller = klass.define('w.smaller',{
	extends : 'w.test',
	test : 'woot',
	lulu : {
		1 : 2
	},
	mkmk : [5,9,8],
	requires : [
		'w.run'
	],
	mixins : {
		something : {
			test : function(){
				console.log(this);
			},
			s : {
				w : function(){
					this.logMessage('run');
				}
			}
		}
	},
	traits : {
		statics : {
			myFunc : function(){
				return 0;
			}
		},
		pom : function(){
			this.logMessage('pom');
		}
	},
	statics : {
		testing : function(){
			console.log('wad');
			this.callParent();
		}
	},
	foo : function(){
		this.callParent(['wat']);
		this.logMessage('test',true);
	}
});
```