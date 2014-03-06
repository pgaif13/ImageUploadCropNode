
/*
 * GET home page.
 */

exports.index = function (req, res) {   
    var appsettings = require('../lib/appsettings.json');
    res.render('index', {
        title: 'Pass Photo Upload - Sample node.js version',
        msg: '',
        prevheight: appsettings.croppreviewh,
        prevwidth: appsettings.cropprevieww,
        targetfilename: 'test_image.jpg',
        targetfolder: appsettings.rawfolder,
        oriwidth: appsettings.cropprevieww,
        oriheight: appsettings.croppreviewh,
        ratio: appsettings.cropprevieww.toString() + "/" + appsettings.croppreviewh.toString(),
        cropprevieww: appsettings.cropprevieww,
        croppreviewh: appsettings.croppreviewh,
        displaypreview: 'none',
        myjs:'',
        imgurl: appsettings.rawfolder+ 'invalid.jpg'
    });
};