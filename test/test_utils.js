var assert = require("assert"),
    gm = require('gm'),
    fs = require('fs'),
    path = require('path'),
    utils = require('../lib/utils.js'),   
    appsettings = require('../lib/appsettings.json');


describe('GetTargetWidth', function () {
    it('GetTargetWidth should return 110 when the prevheight is 140', function () {
        var prevwidth = utils.GetTargetWidth(220, 280, 140);
        assert.equal(110, prevwidth);        
    })   
})

describe('ReplaceCustomVariables', function () {
    it('ReplaceCustomVariables should replace custom configured placeholders in a string', function () {
        var mytestjs = "these are the configured placeholders: '@ratio', '@newwvalue', '@newwvalue2', '@newhvalue', '@newhvalue2', '@rxvalue', '@ryvalue' ";
        var result = utils.ReplaceCustomVariables(mytestjs, "ratio", "rx", "ry", "neww", "newh");
        assert.equal("these are the configured placeholders: ratio, neww, neww, newh, newh, rx, ry ", result);
    })
})

describe('WriteErrorResponse', function () {
    it('WriteErrorResponse should modify a response object for displaying the index view with an error message', function () {
        // this object mocks the response object for this test
        var responseMockup = {
            mydata:"",
            mytemplate:"",
            render: function (template, data) {
                this.mydata = data;
                this.mytemplate = template;
            }
        }        
        utils.WriteErrorResponse(responseMockup, "this is an error test", "assert#1")
        assert.equal(responseMockup.mytemplate, "index", "assert#2");
        assert.equal(responseMockup.mydata.targetfilename, "invalid.jpg", "assert#3");
        assert.equal(responseMockup.mydata.targetfolder, "/public/uploaded_images/raw/", "assert#4");
        assert.equal(responseMockup.mydata.msg, "this is an error test", "assert#5");
        assert.equal(responseMockup.mydata.displaypreview, "none", "assert#6");
        assert.equal(responseMockup.mydata.ratio, appsettings.cropprevieww.toString() + "/" + appsettings.croppreviewh.toString(), "assert#7");
        assert.equal(responseMockup.mydata.prevheight, appsettings.croppreviewh, "assert#8");
        assert.equal(responseMockup.mydata.prevwidth, appsettings.cropprevieww, "assert#9");
    })
})

// test for ProcessUploadedFile
describe('ProcessUploadedFile', function () {
    it('ProcessUploadedFile should take an image path , load the image, resize it and saved it', function (done) {
        
        var testdir = __dirname.toString();
        var testPath = testdir + "\\test_images\\";
        var testimgsrc = testPath + "testimg1.jpg";
        var testimgdest = testPath + "testimg1-testok.jpg";
        var testokwidth = 0;
        var testokheight = 0;
        // this object mocks the response object for this test
        var responseMockup = {
            mydata: "",
            mytemplate: "",
            render: function (template, data) {
                this.mydata = data;
                this.mytemplate = template;               
            }
        }

        utils.ProcessUploadedFile(responseMockup, testimgsrc, testimgdest, function () {
            // test operation result
            gm(testimgdest).size(function (err, size) {
                if (!err) {
                    // check that resized image has expected dimensions
                    testokwidth = size.width;
                    testokheight = size.height;
                    // assert block
                    assert.equal(testokwidth, 704);
                    assert.equal(testokheight, 800);                                     
                    assert.equal(responseMockup.mytemplate, "index", "assert#1");
                    assert.equal(responseMockup.mydata.targetfilename, "testimg1.jpg", "assert#2");
                    assert.equal(responseMockup.mydata.targetfolder, "/public/uploaded_images/raw/", "assert#3");
                    assert.equal(responseMockup.mydata.msg, "OK - File Upload Processed", "assert#4");
                    assert.equal(responseMockup.mydata.displaypreview, "normal", "assert#5");
                    assert.equal(responseMockup.mydata.ratio, appsettings.passwidth.toString() + "/" + appsettings.passheight.toString(), "ratio is OK");
                    assert.equal(responseMockup.mydata.prevheight, appsettings.uiheight, "assert#6");
                    assert.equal(responseMockup.mydata.imgurl, "/public/uploaded_images/raw/testimg1.jpg", "assert#7");
                    // delete resized test image                    
                    fs.unlinkSync(testimgdest);
                    done();
                }
                else {                    
                    testokwidth == -1;
                    assert.equal(testokwidth, -5, "failed: test resized image not found");
                    done();
                }
            });            
        });        
       
    })
})


// test for CropImage 
describe('CropImage', function () {
    it('CropImage should take an image path , load the image, crop it and saved it', function (done) {

        var testdir = __dirname.toString();
        var testPath = testdir + "\\test_images\\";
        var testimgsrc = testPath + "testimg1.jpg";
        var testimgdest = testPath + "testimg1-testcropok.jpg";
        var testokwidth = 0;
        var testokheight = 0;
        // this object mocks the response object for this test
        var responseMockup = {
            mydata: "",
            mytemplate: "",
            render: function (template, data) {
                this.mydata = data;
                this.mytemplate = template;
            }
        }
        // object to store cropping data variables
        var cropdata = {
            X1value: 0,
            Y1value: 0,
            Wvalue: 110,
            Hvalue: 140
        }

        utils.CropImage(responseMockup, cropdata, testimgsrc, testimgdest, function () {
            // test operation result
            gm(testimgdest).size(function (err, size) {
                if (!err) {
                    // check that resized image has expected dimensions
                    testokwidth = size.width;
                    testokheight = size.height;
                    // assert block
                    assert.equal(testokwidth, appsettings.passwidth.toString());
                    assert.equal(testokheight, appsettings.passheight.toString());
                    assert.equal(responseMockup.mytemplate, "index", "assert#1");
                    assert.equal(responseMockup.mydata.targetfilename, "testimg1.jpg", "assert#2");
                    assert.equal(responseMockup.mydata.targetfolder, "/public/uploaded_images/cropped/", "assert#3");
                    assert.equal(responseMockup.mydata.msg, "OK - Cropped File Processed", "assert#4");
                    assert.equal(responseMockup.mydata.displaypreview, "normal", "assert#5");
                    assert.equal(responseMockup.mydata.ratio, appsettings.passwidth.toString() + "/" + appsettings.passheight.toString(), "ratio is OK");
                    assert.equal(responseMockup.mydata.prevheight, appsettings.uiheight, "assert#6");
                    assert.equal(responseMockup.mydata.imgurl, "/public/uploaded_images/cropped/testimg1.jpg", "assert#7");
                    // delete resized test image                    
                    fs.unlinkSync(testimgdest);
                    done();
                }
                else {                   
                    testokwidth == -1;
                    assert.equal(testokwidth,-5, "failed: test cropped image not found");
                    done();
                }
            });
        });

    })
})