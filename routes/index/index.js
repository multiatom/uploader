"use strict";

var router = require("express").Router();
var multer = require("multer");
var path = require("path");
var fs = require("fs")


const MIME_TYPE_MAP = {
	"image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "audio/mpeg": "mp3",
    "application/zip": "zip"
};


var storage =  new multer.diskStorage ({
	
    
    destination: function (req, file, callback) {

        const isValid = MIME_TYPE_MAP[file.mimetype];

        let error = new Error("Mime type invalide");

        if (isValid) {
            error = null;
        };

        callback(error, path.join(__dirname, './uploads'));

    },


    filename: function (req, file, callback) {
		
		var time = new Date().getTime();

        var replaceName = file.originalname.substring(0, 25).split('.').shift().replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
		
        var ext = MIME_TYPE_MAP[file.mimetype];
		
		var saveName = time + '-' + replaceName + '.' + ext;
		
	
	
        callback(null, saveName);

		
    }
	

});



var upload = multer({storage: storage, limits: {fileSize: 25000000}}).array("files",6);


router.post('/', function (req, res) {

    upload(req,res, function(err) {
        //console.log(req.body);
        //console.log(req.files);
	
		var data = JSON.parse(req.body.filesInputData);
        //console.log(data.data1);
		//console.log(data.data2);
		//console.log(data.data3);

		if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
		  if (err.code == "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
			
			console.log(err.code);
			return res.json({error:"error uploading file"});
		  };
        } 
		else if(err) {
			
			console.log(err);
            return res.json({error:"error uploading file"});

        };
		
		res.json({success:"file is uploaded"});

    });


});


//max userName character! 30
router.get("/", function(req, res) {

    res.render("./index/index.ejs", {

        header: {

            title: "THE UPLOADER by Mark Karpati https://multiatom.com",
            css: "index/index.css",
            jQuery: '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>',
            uploaderJS: '<script src="javascripts/index/index.js"></script>'

        },

    });



});



module.exports = {

    "router" : router

};
