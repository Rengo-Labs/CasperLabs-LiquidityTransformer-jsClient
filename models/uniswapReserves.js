var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const uniswapReservesSchema = new Schema({
  id: {
    type: String,
  },
  reserveA: {
    type: String,
  },
  reserveB: {
    type: String,
  },
  blockTimestampLast: {
    type: String,
  },
  tokenA: {
    type: String,
  },
  tokenB: {
    type: String,
  },
  pair: {
    type: String,
  },
});

var uniswapReserves = mongoose.model("uniswapReserves", uniswapReservesSchema);
module.exports = uniswapReserves;
