const express = require("express");
const router = express.Router();
const User = require("../model/User.model");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => res.send(`Hello World`));

router.post("/register", async (req, res) => {
  const { username, email, password, age } = req.body;
  try {
    const hash = await argon2.hash(password);
    const user = new User({ username, email, password: hash, age });
    await user.save();
    return res.status(201).send("User created successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Backend/Server error");
  }
});
module.exports = router;
