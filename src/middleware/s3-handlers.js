const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const contentDisposition = require("content-disposition");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const bucket = process.env.S3_BUCKET;

const fileStorage = multerS3({
    s3,
    acl: "private", //'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: (req, file, cb) => {
        file.originalname = file.originalname.replace(/ /g, "");
        cb(null, contentDisposition(file.originalname, { type: "inline" }));
    },
    bucket,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const folderName =
            (req.query.jobId || req.query.userId + "-avatar") + "/";
        const subFolderName = file.mimetype.split("/")[0] + "s/";
        const fileName =
            folderName +
            subFolderName +
            new Date().getTime() +
            "-" +
            file.originalname.replace(/ /g, "");
        cb(null, fileName);
    },
});

const uploadFileToS3 = multer({ storage: fileStorage }).single("file");

const getFileFromS3 = async (req, res, next) => {
    const Key = req.query.key;

    try {
        const { Body } = await s3.getObject({ Key, Bucket: bucket }).promise();
        req.fileBuffer = Body;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

const deleteFileFromS3 = async (req, res, next) => {
    try {
        deleteFileFromS3Util(req.body.key);
        next();
    } catch (err) {
        res.status(404).send({
            message: "File not found",
            err,
        });
    }
};

const deleteFileFromS3Util = async (Key) => {
    try {
        await s3
            .deleteObject({
                Key,
                Bucket: bucket,
            })
            .promise();
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    uploadFileToS3,
    deleteFileFromS3,
    deleteFileFromS3Util,
    getFileFromS3,
};
