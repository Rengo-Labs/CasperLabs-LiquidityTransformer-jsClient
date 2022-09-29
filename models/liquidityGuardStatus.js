var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const liquidityGuardStatusSchema = new Schema({
  id: {
    type: String,
  },
  liquidityGuardStatus: {
    type: String,
  },
});

var liquidityGuardStatus = mongoose.model(
  "liquidityGuardStatus",
  liquidityGuardStatusSchema
);
module.exports = liquidityGuardStatus;
