var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    mymocha = new Mocha;

exports.index = function (req, res) {

    var passed = [];
    var failed = [];

    // this must be outside, otherwise it will fail when called a second time
    // var mymocha = new Mocha;   
   
    fs.readdirSync('./test').filter(function (file) {
        // Only keep the .js files
        return file.substr(-3) === '.js';

    }).forEach(function (file) {
        // Use the method "addFile" to add the file to mocha
        if (file !== 'test_runner.js') {
            mymocha.addFile(
            path.join('./test', file)
            );
        }
        
    });


    // Now, run the tests.
    mymocha.run(function () {

        var msg = passed.length + ' Tests Passed' + " - " + failed.length + ' Tests Failed'

        msg = msg + "<br/><br/>Passed:"

        console.log(passed.length + ' Tests Passed');
        passed.forEach(function (testName) {
            console.log('Passed:', testName);
            msg = msg + "<br/>" + testName;
        });

        msg = msg + "<br/><br/>Failed:"

        console.log("\n" + failed.length + ' Tests Failed');
        failed.forEach(function (testName) {
            console.log('Failed:', testName);
            msg = msg + "<br/>" + testName;
        });        

        res.render('test', {
            title: 'Pass Photo Upload - Sample node.js version - Test Results',
            msg: msg
        });

    }).on('fail', function (test,err) {
        failed.push(test.title + " - " + err.message);
    }).on('pass', function (test) {
        passed.push(test.title);
    });

};

