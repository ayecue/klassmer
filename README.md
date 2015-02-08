# klassmer v0.3.2
[![Build Status](https://travis-ci.org/ayecue/klassmer.png?branch=master)](https://travis-ci.org/ayecue/klassmer)

> Optimize CommonJS projects for your browser.


## Getting Started
This plugin requires UglifyJS `~2.4.16`

Install this plugin with this command:

```shell
npm install klassmer
```


## Description

This package will merge your CommonJS project to one file to use it in frontend without any overhead.

Since `~0.3.0` there's also an autoloader which also loads external modules. If you don't want to add certain modules you are able to exclude them with the new `excludes` property.


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

## Arguments

#### -f, --source
Type: `String`
Path to main project file. (All other files will get loaded automaticly)

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

#### -g, --package (optional)
Type: `String`
Path to package file (All other files will get loaded automaticly).

#### -x, --excludes (optional)
Type: `String`
Ignore certain required modules.


## Functions

#### klassmer.forEach
Arguments: `Object`, `Function`, `Mixed`
Return: `Mixed`

#### klassmer.typeOf
Arguments: `Object`
Return: `String`

#### klassmer.toArray
Arguments: `Object`
Return: `Array`

#### klassmer.from
Arguments: `Object`
Return: `Array`

#### klassmer.indexOf
Arguments: `Array`, `Function`
Return: `Integer`

#### klassmer.extend
Arguments: `Object`, `Object` [...]
Return: `Object`

#### klassmer.printf
Arguments: `String`, `Object`
Return: `String`

#### klassmer.run
Arguments: `Object`


## Classes

#### klassmer.Listener
#### klassmer.Merger