const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const {FileFilterCallback} = require('multer');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4'
});

const S3 = new AWS.S3();
const isAllowedMimetype =  (mime) => ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/x-ms-bmp', 'image/webp'].includes(mime.toString())
const fileFilter = (req, file, callback) => {
    const fileMime = file.mimetype;
    if(isAllowedMimetype(fileMime)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}
const getUniqFileName = (originalname) => {
    const name = uuidv4();
    const ext = originalname.split('.').pop();
    return `${name}.${ext}`;
}

exports.handleUploadMiddleware = multer({
    fileFilter,
    storage: multerS3({
        s3: S3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const fileName = getUniqFileName(file.originalname);
            const s3_inner_directory = 'public_asset';
            const finalPath = `${s3_inner_directory}/${fileName}`;

            file.newName = fileName;

            cb(null, finalPath );
        }
    })
});

module.exports = {S3};