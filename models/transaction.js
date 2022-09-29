var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const transactionSchema = new Schema({
  id: {
    type: String,
  },

  blockNumber: {
    type: String,
  },

  timestamp: {
    type: String,
  },

  sender: {
    type: String,
  },

  referral: {
    type: String,
  },

  reservations: {
    type: String,
  },
});

var transaction = mongoose.model("transaction", transactionSchema);
module.exports = transaction;
