const express = require("express");
const User = require("../models/user");
const areNewUserDetailsValid = require("../middleware/userUpdateValidation");

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("API is Working!");
});

router.get("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.query.email,
      req.query.password
    );

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

router.put("/users/modify", areNewUserDetailsValid, async (req, res) => {
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

module.exports = router;
