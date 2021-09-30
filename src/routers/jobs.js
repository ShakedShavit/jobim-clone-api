const express = require("express");
const jobsTypes = require("../../constants/JobTypes");
const jobAuth = require("../middleware/auth");
const { uploadFileToS3 } = require("../middleware/s3-handlers");
const Job = require("../models/job");
const getGeocode = require("../utils/geocode");

const router = express.Router();

const routeStart = "/jobs/";

router.post(routeStart + "publish", async (req, res) => {
  try {
    const locationData = await getGeocode(req.body.address);

    const address = {
      type: "Point",
      coordinates: [locationData.longitude, locationData.latitude],
      location: locationData.location,
    };
    const job = new Job({ ...req.body, address });
    await job.save();

    res.status(201).send({ job });
  } catch (err) {
    res.status(400).send(err.message || err);
  }
});

router.post(
  routeStart + "upload-file",
  jobAuth,
  uploadFileToS3,
  async (req, res) => {
    if (!req.file) {
      return res.status(422).send({
        status: 422,
        message: "file not uploaded",
      });
    }

    try {
      const job = req.job;
      if (!job) return res.status(400).send("Cannot find owner job");
      job.fileKey = req.file.key;
      await job.save();

      res.status(201).send(job.fileKey);
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err);
    }
  }
);

// Get jobs based on company and types, and sorted by location
router.get(routeStart, async (req, res) => {
  try {
    const apartmentsPollLimit = 5;
    const skipCounter = parseInt(req.query.skipCounter) || 0;

    let types = req.query.jobTypes || [];
    const company = req.query.company;
    const coordinates = await getGeocode(req.query.location);

    types = types.filter((type) => jobsTypes.includes(type));

    if (types.length === 0) types = [...jobsTypes];

    const jobs = await Job.find({
      $and: [
        !!company ? { companyName: company } : {},
        { type: { $in: [...types] } },
        {
          // Sort results by proximity to a given location
          address: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [coordinates.longitude, coordinates.latitude],
              },
            },
          },
        },
      ],
    })
      .limit(apartmentsPollLimit)
      .skip(skipCounter);

    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send(err.message || err);
  }
});

module.exports = router;
