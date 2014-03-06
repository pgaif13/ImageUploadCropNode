// this module contains the key functions supporting the business logic of the application

var gm = require('gm'),
    fs = require('fs'),
    appsettings = require('./appsettings.json');

module.exports = {
    ProcessUploadedFile: ProcessUploadedFile,    
    WriteErrorResponse: WriteErrorResponse,
    GetTargetWidth: GetTargetWidth,
    GetUIJsMarkup: GetUIJsMarkup,
    CropImage:CropImage,
    ReplaceCustomVariables: ReplaceCustomVariables
}

function GetUIJsMarkup() {
    var rootappdir = __dirname.toString().replace("\\lib", "");
    return fs.readFileSync(rootappdir + "\\public\\javascripts\\tiffjcroppreset.js").toString();
}

function ProcessUploadedFile(res, srcImagePath, destImagePath, callback) {    
    var oriwidth = 0;
    var oriheight = 0;
    var prevheight = appsettings.uiheight;
    var prevwidth = 0;
    var targetheight = appsettings.rawheight;
    var targetwidth = 0;
    var targetfolder = appsettings.rawfolder;
    var ratio = appsettings.passwidth.toString() + "/" + appsettings.passheight.toString();
    var opmessg = "";
    var imgurl = "";
    var rootappdir = __dirname.toString().replace("\\lib", "");
    // get custom JS that must be sent back to the view with custom values related to actual image
    var myjs = GetUIJsMarkup();   
    var targetfilename = srcImagePath.substr(srcImagePath.lastIndexOf("\\") + 1, srcImagePath.length - (srcImagePath.lastIndexOf("\\") + 1));
    // obtain the dimensions of the uploaded image                       
    gm(srcImagePath)
        .size(function (err, size) {
            if (!err) {
                oriwidth = size.width;
                oriheight = size.height;
                // obtain the targetwidth for resizing
                targetwidth = GetTargetWidth(oriwidth, oriheight, targetheight);
                // obtain the preview image width for displaying
                prevwidth = GetTargetWidth(oriwidth, oriheight, prevheight);
                // resize uploaded image to a standard height (configured in appsettings.json)
                gm(srcImagePath)
                    .resize(targetwidth, targetheight)
                    .write(destImagePath, function (err) {
                        if (!err) {
                            opmessg = "OK - File Upload Processed";
                            imgurl = (targetfolder + targetfilename).toString();
                            myjs = ReplaceCustomVariables(myjs, ratio, appsettings.cropprevieww, appsettings.croppreviewh, targetwidth, targetheight);
                            // todo: delete tmp file
                            // render view 
                            res.render('index', {
                                title: 'Pass Photo Upload - Sample node.js version',
                                msg: opmessg,
                                prevheight: prevheight,
                                prevwidth: prevwidth,
                                targetfilename: targetfilename,
                                targetfolder: appsettings.rawfolder,
                                oriwidth: oriwidth,
                                oriheight: oriheight,
                                ratio: ratio,
                                cropprevieww: appsettings.cropprevieww,
                                croppreviewh: appsettings.croppreviewh,
                                displaypreview: 'normal',
                                myjs: myjs,
                                imgurl: imgurl
                            });
                            callback();
                        }
                        else {
                            opmessg = "Error - Failed Processing File Upload - " + err.errmessg;
                            WriteErrorResponse(res, opmessg, appsettings);
                            callback();
                        }
                    });
            } else {
                opmessg = "Error - " + err.message;
                // render index view with error message
                WriteErrorResponse(res, opmessg, appsettings);
                callback();
            }
        });
    
}

function CropImage(res, cropdata, srcImagePath, destImagePath, callback) {

    // set these parameters from the json settings file
    var cropprevieww = appsettings.cropprevieww;
    var croppreviewh = appsettings.croppreviewh;
    var passwidth = appsettings.passwidth;
    var passheight = appsettings.passheight;
    var targetheight = appsettings.rawheight;
    var sourcefolder = appsettings.rawfolder;
    var targetfolder = appsettings.croppedfolder;
    var targetfilename = "";
    var opmessg = "";
    var imgurl = "";
    var prevheight = appsettings.uiheight;

    // these variables are calculated based on the settings values above
    var ratio = passwidth.toString() + "/" + passheight.toString();
    var prevwidth = 0;

    var rootappdir = __dirname.toString().replace("\\lib", "");
    var myjs = GetUIJsMarkup();
    var targetfilename = srcImagePath.substr(srcImagePath.lastIndexOf("\\") + 1, srcImagePath.length - (srcImagePath.lastIndexOf("\\") + 1));

    // crop 
    gm(srcImagePath)
        .crop(cropdata.Wvalue, cropdata.Hvalue, cropdata.X1value, cropdata.Y1value)
        .write(destImagePath, function (err) {
            if (err) {
                // error cropping
                WriteErrorResponse(res, "Error - " + err.message, appsettings);
            } else {
                // resize               
                var opmsg = "";
                gm(destImagePath)
                    .resize(passwidth, passheight)
                    .write(destImagePath, function (err) {
                        if (!err) {
                            opmessg = "OK - Cropped File Processed";
                            imgurl = targetfolder + targetfilename;
                            prevwidth = GetTargetWidth(passwidth, passheight, prevheight);
                            myjs = ReplaceCustomVariables(myjs, ratio, cropprevieww, croppreviewh, passwidth, passheight);
                            // render view        
                            res.render('index', {
                                title: 'Pass Photo Upload - Sample node.js version',
                                msg: opmessg,
                                prevheight: prevheight,
                                prevwidth: prevwidth,
                                targetfilename: targetfilename,
                                targetfolder: targetfolder,
                                oriwidth: 0,
                                oriheight: 0,
                                ratio: ratio,
                                cropprevieww: cropprevieww,
                                croppreviewh: croppreviewh,
                                displaypreview: 'normal',
                                myjs: myjs,
                                imgurl: imgurl
                            });
                            callback();
                        }
                        else {
                            opmsg = "Error - Failed Processing Cropped File - " + err.errmessg;
                            WriteErrorResponse(res, "Error - " + err.message, appsettings);
                            callback();
                        }
                    });
            }
        }
        )
}


function WriteErrorResponse(res, message) {
    res.render('index', {
        title: 'Pass Photo Upload - Sample node.js version',
        msg: message,
        prevheight: appsettings.croppreviewh,
        prevwidth: appsettings.cropprevieww,
        targetfilename: 'invalid.jpg',
        targetfolder: '/public/uploaded_images/raw/',
        oriwidth: 0,
        oriheight: 0,
        ratio: appsettings.cropprevieww.toString() + "/" + appsettings.croppreviewh.toString(),
        cropprevieww: appsettings.cropprevieww,
        croppreviewh: appsettings.croppreviewh,
        displaypreview: 'none',
        myjs: '',
        imgurl: ("/public/uploaded_images/raw/invalid.jpg")
    });    
}

function GetTargetWidth(oriwidth, oriheight, targetheight) {
    return Math.round(targetheight * oriwidth / oriheight);
}

function ReplaceCustomVariables(myjs, ratio, rx, ry, neww, newh) {
    myjs = myjs.replace("'@ratio'", ratio);
    myjs = myjs.replace("'@newwvalue'", neww);
    myjs = myjs.replace("'@newwvalue2'", neww);
    myjs = myjs.replace("'@newhvalue'", newh);
    myjs = myjs.replace("'@newhvalue2'", newh);
    myjs = myjs.replace("'@rxvalue'", rx);
    myjs = myjs.replace("'@ryvalue'", ry);
    return myjs
}