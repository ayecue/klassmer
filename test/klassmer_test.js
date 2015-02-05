'use strict';

var fs = require('fs'),
    Klassmer = require('../src/klassmer');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.klassmer = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    merge_files: function(test) {
        var cases = [{
            path : 'merged_simple.js',
            options : {
                source : 'test/fixtures/src/simpleB.js',
                output : 'tmp/merged_simple.js'
            }
        },{
            path : 'merged_simple_opt.js',
            options : {
                source : 'test/fixtures/src/simpleB.js',
                output : 'tmp/merged_simple_opt.js',
                optimizer : {
                    beautify : false,
                    comments : false
                }
            }
        },{
            path : 'merged_simple_namespace.js',
            options : {
                namespace : 'myClass',
                source : 'test/fixtures/src/simpleB.js',
                output : 'tmp/merged_simple_namespace.js'
            }
        },{
            path : 'merged_object.js',
            options : {
                source : 'test/fixtures/src/objectB.js',
                output : 'tmp/merged_object.js'
            }
        }];

        test.expect(cases.length);

        cases.forEach(function(_case) {
            var temp = ['tmp', _case.path].join('/'),
                fixture = ['test', 'fixtures', 'expected', _case.path].join('/');

            console.info('Run test: ' + fixture);
            Klassmer.run(_case.options);

            var actual = fs.readFileSync(temp,{
                    encoding : 'utf8'
                }),
                expected = fs.readFileSync(fixture,{
                    encoding : 'utf8'
                });

            test.equal(actual, expected, 'task output should equal ' + _case.path);
        });

        test.done();
    }
};
