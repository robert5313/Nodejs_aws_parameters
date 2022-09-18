require('dotenv').config();
const express = require('express');
const multer = require('multer');
const {s3Uploadv2, s3Uploadv3} = require('./s3Service');
const {api_ListFiles} = require('./src/api/uploads/api_listFiles')

const app = express();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if(file.mimetype.split("/")[0] === "image"){
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 1000000000, file: 2},
});

app.post("/upload", upload.array("files"), async(req, res) => {
    try {
        const results = await s3Uploadv3(req.files);
        console.log(results)
        return res.json({status: "success"});
    } catch (err) {
        console.log(err);
    }
});
app.get('/list', api_ListFiles);

app.listen(4000, () => console.log("listening on port 4000"));