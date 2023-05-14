const { Schema, model } = require("mongoose");
const authSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const authModel = new model("Auth", authSchema);
module.exports = authModel;
