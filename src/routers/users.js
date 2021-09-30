const express = require("express");
const User = require("../models/user");
const areNewUserDetailsValid = require("../middleware/userUpdateValidation");
const { userAuth } = require("../middleware/auth");
const { uploadFileToS3, } = require("../middleware/s3-handlers");

const router = express.Router();

const rootRoute = "/users/";

router.get(rootRoute + "get-user", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.query.email, req.query.password);

    res.status(200).send({ user });
  } catch (err) {
    res.status(400).send(err.message || err);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const user = new User({ ...req.body });
    await user.save();

    res.status(201).send({ user });
  } catch (err) {
    res.status(400).send(err.message || err);
  }
});

router.put(rootRoute + "modify", areNewUserDetailsValid, async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password);
    for (const [key, value] of Object.entries(req.userDetails)) {
      user[key] = value;
    }
    await user.save();

    res.status(200).send({ user });
  } catch (err) {
    res.status(400).send(err.message || err);
  }
});

router.post(rootRoute + "upload-avatar", userAuth, uploadFileToS3, async (req, res) => {
    if (!req.file) {
      return res.status(422).send({
        status: 422,
        message: "file not uploaded",
      });
    }

    try {
      const user = req.user;
      if (!user) return res.status(400).send("Cannot find user");
      user.avatarFileKey = req.file.key;
      await user.save();

      res.status(201).send(user.avatarFileKey);
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err);
    }
});

module.exports = router;
