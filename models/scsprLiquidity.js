var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const scsprLiquiditySchema = new Schema({
  user: {
    type: String,
  },
  amount: {
    type: String,
  },
});

var scsprLiquidity = mongoose.model("scsprLiquidity", scsprLiquiditySchema);
module.exports = scsprLiquidity;
