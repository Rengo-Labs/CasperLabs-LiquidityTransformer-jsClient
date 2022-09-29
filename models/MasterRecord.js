var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const masterRecordSchema = new Schema({
  masterAddress: {
    type: String,
  },
  amount: {
    type: String,
  },
  source: {
    type: String,
  },
});

var masterRecord = mongoose.model("masterRecord", masterRecordSchema);
module.exports = masterRecord;
