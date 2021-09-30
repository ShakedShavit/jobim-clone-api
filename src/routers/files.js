const express = require("express");
const { getFileFromS3 } = require("../middleware/s3-handlers");
const { Readable } = require("stream");

const router = express.Router();

router.get("/get-file", getFileFromS3, async (req, res) => {
    try {
        const stream = Readable.from(req.fileBuffer);
        const fileName = req.query.key.substring(
            req.query.key.lastIndexOf("/") + 1
        );

        if (req.query.download === "true") {
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + fileName
            );
        } else {
            res.setHeader("Content-Disposition", "inline");
        }

        stream.pipe(res);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
