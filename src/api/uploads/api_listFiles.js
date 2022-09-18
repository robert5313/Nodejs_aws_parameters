const {S3} = require("./uploadSetup");

exports.api_ListFiles = (req, res) => {

    const listParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
    };  
    S3.listObjectsV2(listParams, function(err, data) {
        if (err) throw err;
        
        if(data.Contents && data.Contents.length > 0) {
                                                
            const fileObjArr = [];
            data.Contents.forEach((fileObj) => { // fileObj: S3.ObjectList
                if(fileObj.Size > 0) {
                    fileObjArr.push({
                        ...fileObj,
                        // Url generating suggestion from => http://www.wryway.com/blog/aws-s3-url-styles/
                        location: `https://${process.env.AWS_BUCKET_NAME}${process.env.AWS_REGION === 'eu-central-1' ? '.' : '-'}s3${process.env.AWS_REGION === 'us-east-1' ? '' : '-' + process.env.AWS_REGION}.amazonaws.com/${fileObj.Key}`
                    })
                }
            })

            data.Contents = fileObjArr;

        }

        res.status(200);
        return res.json({data});
    });
}

