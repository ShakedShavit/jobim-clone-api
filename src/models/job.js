const mongoose = require("mongoose");
const jobsTypes = require("../constants/JobTypes");

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
      validate(value) {
        if (!jobsTypes.includes(value)) {
          throw new Error("Invalid job type");
        }
      },
    },
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: false,
      maxlength: 250,
    },
    address: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
      location: {
        type: String,
      },
    },
    fileKey: {
      type: String,
      required: false,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ address: "2dsphere" });

const JobModel = mongoose.model("JobModel", jobSchema);

module.exports = JobModel;
