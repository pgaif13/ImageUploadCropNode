
var gm = require('gm'),
    fs = require('fs'),
    appsettings = require('../lib/appsettings.json'),
    utils = require('../lib/utils.js');

exports.index = function (req, res) {
    // Crop Image
    
    // set these parameters from the json settings file    
    var sourcefolder = appsettings.rawfolder;
    var targetfolder = appsettings.croppedfolder;
    var targetfilename = "";     
    var appdir = __dirname.toString().replace("\\routes", "");   

    // object to store cropping data variables
    var cropdata = {
        X1value: 0,
        Y1value: 0,
        Wvalue: 0,
        Hvalue: 0
    }
    // read posted values from form
    if (req.body.X1value !== null) {        
        cropdata.X1value = req.body.X1value;
    }
    if (req.body.Y1value !== null) {       
        cropdata.Y1value = req.body.Y1value;
    }
    if (req.body.Wvalue !== null) {        
        cropdata.Wvalue = req.body.Wvalue;
    }
    if (req.body.Hvalue !== null) {        
        cropdata.Hvalue = req.body.Hvalue;
    }
    if (req.body.filenamecrop !== null) {
        targetfilename = req.body.filenamecrop;
    }
    if (req.body.foldercrop !== null) {
        sourcefolder = req.body.foldercrop;
    }
  
    // change all forward slashes to backslashes - this is for windows
    var srcPath = appdir + sourcefolder.replace(/\//g, "\\") + targetfilename;
    var newPath = appdir + targetfolder.replace(/\//g, "\\") + targetfilename;

    // crop 
    utils.CropImage(res, cropdata, srcPath, newPath, function () { });
    
};

