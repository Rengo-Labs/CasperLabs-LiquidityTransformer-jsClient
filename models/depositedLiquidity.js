var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const depositedLiquiditySchema = new Schema({
  user: {
    type: String,
  },
  amount: {
    type: String,
  },
  deployHash: {
    type: String,
  },
});

var depositedLiquidity = mongoose.model(
  "depositedLiquidity",
  depositedLiquiditySchema
);
module.exports = depositedLiquidity;
