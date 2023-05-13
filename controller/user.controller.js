const express = require("express");
const router = express.Router();
const User = require("../model/User.model");

router.get("/", (req, res) => res.send(`Hello World`));
module.exports = router;
