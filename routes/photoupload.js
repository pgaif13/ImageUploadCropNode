
var gm = require('gm'),
    fs = require('fs'),
    appsettings = require('../lib/appsettings.json'),
    utils = require('../lib/utils.js');

exports.index = function (req, res) {

    // upload photo    
    
    var appdir = __dirname.toString().replace("\\routes", "");
    // preset parameters   
    var targetfolder = appsettings.rawfolder;
    var targetfilename = "invalid.jpg";
    var maxsize = appsettings.maxsize;
    var opmessg = "";
    var isfileuploaded = false;
    var isvalidfile = false;
    var imgurl = "/public/uploaded_images/raw/invalid.jpg";
    var prevheight = appsettings.uiheight;
    var maxk = (Math.round(maxsize / 1024)).toString() + "K";
    var iserror = false;

    // read targetfilename from posted form
    if (req.body.targetfilename !== null) {
        targetfilename = req.body.targetfilename;
    }
    if (req.files !== null) isfileuploaded = true;
    if (isfileuploaded) {
        // check size of uploaded file
        if (req.files.PassPhotoImage.size < maxsize) {
            // check extension of uploaded file
            if (req.files.PassPhotoImage.type == "image/jpeg") {
                isvalidfile = true;
            } else {
                opmessg = "Error - invalid file, only jpg files are allowed";
            }
        } else {
            opmessg = "Error - file is larger than " + maxk;
        }
    }
    // if OK continue to resize, if not display error message
    if (isvalidfile) {
        // readfile
        fs.readFile(req.files.PassPhotoImage.path, function (err, data) {
            if (err) {
                //throw err;
                opmessg = "Error - " + err.message;
                iserror = true;
                // write error response if readfile fails
                utils.WriteErrorResponse(res, opmessg);
            } else {
                var myob = req.files.PassPhotoImage;
                // save the tmp image to the raw folder
                // change all forward slashes to backslashes - this is for windows
                var newPath = appdir + targetfolder.replace(/\//g, "\\") + targetfilename;               
                fs.writeFile(newPath, data, function (err) {
                    if (err) {
                        opmessg = "Error - " + err.message;
                        iserror = true
                        // write error response if write file fails
                        utils.WriteErrorResponse(res, opmessg);
                    }
                    else {
                        // process uploaded image                       
                        utils.ProcessUploadedFile(res, newPath, newPath, function () { });
                    }
                });  
            }            
        });
    } else {        
        // write error response for invalid image size or type
        utils.WriteErrorResponse(res, opmessg);
    }   
};

