var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const reservationReferralSchema = new Schema({
  id: {
    type: String,
  },
  transaction: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  referrer: {
    type: String,
  },
  referee: {
    type: String,
  },
  actualWei: {
    type: String,
  },
});

var reservationReferral = mongoose.model(
  "reservationReferral",
  reservationReferralSchema
);
module.exports = reservationReferral;
