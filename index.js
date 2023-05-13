const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8000;
const connectionDB = require("./config/db");

const userRouter = require("./controller/user.controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

app.listen(PORT, async () => {
  try {
    await connectionDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
