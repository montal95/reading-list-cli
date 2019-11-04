const mongoose = require("mongoose");

//Schema for Book information we want to save
const readingListSchema = mongoose.Schema({
  title: { type: String },
  author: { type: String },
  publishingcompany: { type: String },
  name: { type: String }
});

//Define and export
module.exports = mongoose.model("ReadingList", readingListSchema);
