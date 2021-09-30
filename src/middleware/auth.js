const Job = require("../models/job");
const User = require("../models/user");

const jobAuth = async (req, res, next) => {
  try {
    let jobId = req.query.jobId;
    const job = await Job.findById(jobId);

    if (!job) throw new Error("Job not found");

    req.job = job;
    next();
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Job not found",
    });
  }
};

const userAuth = async (req, res, next) => {
  try {
    let userId = req.query.userId;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "User not found",
    });
  }
};

module.exports = { userAuth, jobAuth };
