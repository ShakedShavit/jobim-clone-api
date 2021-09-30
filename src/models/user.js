const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("../db/mongoose");
const {
  isYearOfBirthValid,
  isCityOfResidenceValid,
  isNameValid,
  isPasswordValid,
  isEmailValid,
  invalidEmailErrMsg,
  invalidNameErrMsg,
  invalidPasswordErrMsg,
  invalidCityOfResidenceErrMsg,
  invalidYearOfBirthErrMsg,
} = require("../utils/userValidation");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!isEmailValid(value)) throw new Error(invalidEmailErrMsg);
      },
    },
    password: {
      type: "String",
      required: true,
      minlength: 6,
      validate(value) {
        if (!isPasswordValid(value)) throw new Error(invalidPasswordErrMsg);
      },
    },
    firstName: {
      type: String,
      required: false,
      minlength: 1,
      validate(value) {
        if (!isNameValid(value)) throw new Error(invalidNameErrMsg);
      },
    },
    lastName: {
      type: String,
      required: false,
      minlength: 1,
      validate(value) {
        if (!isNameValid(value)) throw new Error(invalidNameErrMsg);
      },
    },
    cityOfResidence: {
      type: String,
      required: false,
      minlength: 1,
      validate(value) {
        if (!isCityOfResidenceValid(value))
          throw new Error(invalidCityOfResidenceErrMsg);
      },
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      validate(value) {
        if (isNaN(value))
          throw new Error("Phone number can only include numbers");
        if (value.length !== 10)
          throw new Error(
            `Phone number must be exactly 10 digits long, it currently has ${value.length} digits`
          );
        if (value.substring(0, 2) !== "05")
          throw new Error("Phone number must start with 05 characters");
        if (value[2] === "9" || value[2] === "7" || value[2] === "6")
          throw new Error(
            `Phone number cannot begin with ${value.substring(
              0,
              3
            )}, change the third character (${value[2]})`
          );
      },
    },
    yearOfBirth: {
      type: Number,
      required: false,
      validate(value) {
        if (!isYearOfBirthValid(value))
          throw new Error(invalidYearOfBirthErrMsg);
      },
    },
    avatarFileKey: {
      type: String,
      required: false,
    },
    favoriteJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    hiddenJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("publishedJobs", {
  ref: "JobModel",
  localField: "_id",
  foreignField: "publisher",
});

// Hiding info
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;

  return userObj;
};

userSchema.statics.findByCredentials = async (email, password) => {
  let loginCredentialsErrorMsg = "email and/or password are incorrect";

  let user = await UserModel.findOne({ email });
  if (!user) throw new Error(loginCredentialsErrorMsg);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error(loginCredentialsErrorMsg);

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);

  next();
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
