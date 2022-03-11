const Express = require("express");
const router = Express.Router();
const middleWare = require("../middleware/user_auth")
const multer = require("multer");
const path = require("path");
const uuid = require('uuid');
const CatchData = require("../models/catch_data");
const fs = require("fs");
const moment = require("moment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '..') + '/uploads');
    },
    filename: function (req, file, cb) {
        const type = file.originalname.split(".")
        cb(null, `${uuid.v4()}.${type[type.length - 1]}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000},
    fileFilter: fileFilter
})

function fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb('Only images are allowed (jpeg, jpg, png)');
    }
}

function removeFiles(req) {
    req.files.forEach(file => {
        fs.unlink(path.resolve(__dirname, '..') + '/uploads/' + file.filename, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

module.exports = router.post("/", middleWare, upload.array("fish_images"), (req, res) => {

    const {date, time, location, species, catchWeight} = req.body;

    if (!date) {
        removeFiles(req);
        return res.status(400).json({
            message: "Date is required"
        });
    }

    if (!moment(date, 'DD/MM/YYYY', true).isValid()) {
        console.log("err")
        removeFiles(req);
        return res.status(400).json({
            message: "Invalid date format"
        });
    }

    if (!time) {
        removeFiles(req);
        return res.status(400).json({
            message: "Time is required"
        });
    }

    if(!moment(time, "HH:mm", true).isValid()) {
        removeFiles(req);
        return res.status(400).json({
            message: "Invalid time format"
        });
    }

    if (!location) {
        removeFiles(req);
        return res.status(400).json({
            message: "Location is required"
        });
    }

    if (!species) {
        removeFiles(req);
        return res.status(400).json({
            message: "Species is required"
        });
    }

    if (!catchWeight) {
        removeFiles(req);
        return res.status(400).json({
            message: "Catch weight is required"
        });
    }

    if (location.length !== 2) {
        removeFiles(req);
        return res.status(400).json({
            message: "Location must be an array of 2 (latitude, longitude)"
        });
    }

    //return error if req.files is empty
    if (!req.files) {
        return res.status(400).json({
            message: "No images were uploaded"
        });
    }
    if (req.files.length === 0) {
        return res.status(400).json({
            message: "No images were uploaded"
        });
    }


    //save to mongoose
    const catchData = new CatchData({
        date: date,
        time: time,
        location: location,
        species: species,
        imageName: req.files.map(file => file.filename),
        catchWeight: catchWeight
    });

    //promise from save
    catchData.save(
        (err, catchData) => {
            if (err) {
                removeFiles(req);
                return res.status(500).json({
                    message: "Internal server error",
                    error: err
                });
            }
            return res.status(200).json({
                message: "Catch data saved successfully",
                catchData: catchData
            });
        }
    );
});


//TODO: Use the following code to upload images to google-drive
//
// const {google} = require("googleapis");
// const fs = require('fs')
//
// const SCOPES = ['https://www.googleapis.com/auth/drive']
// console.log(__dirname + '/config/key.json')
// const auth = new google.auth.GoogleAuth(
//     {
//         keyFile: __dirname + '/config/key.json',
//         scopes: SCOPES
//     }
// );
//
// createAndUpload(auth).catch(console.error)
//
// async function createAndUpload(auth) {
//     const drive = google.drive({
//         version: 'v3',
//         auth: auth,
//     });
//
//     let fileMetaData = {
//         'name': 'fish.png',
//         'parents': [process.env.PARENT_FOLDER]
//     }
//
//     let media = {
//         mimeType: 'image/png',
//         body: fs.createReadStream('path to file here')
//     }
//
//     let response = await drive.files.create({
//         resource: fileMetaData,
//         media: media,
//         fields: 'id'
//     })
//
//     drive.files.list().then(r => {
//         console.log(r.data.files)
//     })
//
//
//     if(response.status === 200){
//         console.log('File has been created, id: ', response.data.id);
//     }
//     else{
//         console.log('Error writing file: ', response.errors);
//     }
// }





