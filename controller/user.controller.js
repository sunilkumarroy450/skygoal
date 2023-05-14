const express = require("express");
const router = express.Router();
const User = require("../model/User.model");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const blacklist = [];

router.get("/", (req, res) => res.send(`Hello World`));

//signup
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

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }
    const userDataMatch = await argon2.verify(user.password, password);
    if (!userDataMatch) {
      return res.status(401).send("Password doesn't match");
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username, age: user.age },
      "SUNIL",
      { expiresIn: "7 days" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username, age: user.age },
      "REFRESH",
      { expiresIn: "21 days" }
    );
    res.status(200).send({ token, refreshToken, msg: "Login Success" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Backend/Server error");
  }
});

//refresh Token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.headers["authorization"];
  if (!refreshToken) {
    res.status(401).send("Unauthorization");
  }
  try {
    const verfication = jwt.verify(refreshToken, "REFRESH");
    if (verfication) {
      const userData = await User.findOne({ _id: verfication.id });
      const newToken = jwt.sign({ ...userData }, "SUNIL", {
        expiresIn: "7 days",
      });
      return res.status(200).send({ token: newToken });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Refresh token is expired Login again");
  }
});

//logout
router.post("/logout", (req, res) => {
  const token = req.headers["authorization"];
  blacklist.push(token);
  return res.status(200).send("User Logged out success");
});

//get by id
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorization");
  }
  if (blacklist.includes(token)) {
    return res.send("Token already expired");
  }
  try {
    const verfication = jwt.verify(token, "SUNIL");
    if (verfication) {
      const userData = await User.findById({ _id: id });
      return res.status(200).send(userData);
    }
  } catch (error) {
    console.log(error.message);
    if (error.message === "jwt expired") {
      blacklist.push(token);
    }
    return res.status(500).send("Invalid Token");
  }
});
module.exports = router;
