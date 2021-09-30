const Job = require("../models/job");

const jobAuth = async (req, res, next) => {
  try {
    let jobId = req.query.jobId;
    const job = await Job.findById(jobId);

    if (!job) throw new Error("Job not found");

    req.job = job;
    next();
  } catch (err) {
    res.status(403).send({
      status: 400,
      message: "Job not found",
    });
  }
};

module.exports = jobAuth;
