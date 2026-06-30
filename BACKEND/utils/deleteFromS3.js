const {
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");

const deleteFromS3 = async (key) => {

    await s3.send(
        new DeleteObjectCommand({

            Bucket: process.env.AWS_BUCKET_NAME,

            Key: key,

        })
    );

};

module.exports = deleteFromS3;