const mongoose = require("mongoose");
const MONGODB_URL = `mongodb+srv://skygoal:skygoal@sky-goal-tech.q5pdtyx.mongodb.net/`;
const connectDB = async () => {
  return mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`connected to DataBase`))
    .catch((err) => console.log(err));
};
module.exports = connectDB;
