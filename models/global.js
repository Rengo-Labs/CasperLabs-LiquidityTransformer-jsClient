var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const globalSchema = new Schema({
  id: {
    type: String,
  },
  userCount: {
    type: String,
  },
  reserverCount: {
    type: String,
  },
  reservationReferrerCount: {
    type: String,
  },
  cmStatusCount: {
    type: String,
  },
  cmStatusInLaunchCount: {
    type: String,
  },
  reservationCount: {
    type: String,
  },
  reservationEffectiveWei: {
    type: String,
  },
  reservationActualWei: {
    type: String,
  },
  totalScsprContributed: {
    type: String,
  },
  totalTransferTokens: {
    type: String,
  },
  stakeCount: {
    type: String,
  },
  stakerCount: {
    type: String,
  },
  totalShares: {
    type: String,
  },
  totalStaked: {
    type: String,
  },
  sharePrice: {
    type: String,
  },
  sharePricePrevious: {
    type: String,
  },
  referrerShares: {
    type: String,
  },
  currentWiseDay: {
    type: String,
  },
  ownerlessSupply: {
    type: String,
  },
  circulatingSupply: {
    type: String,
  },
  liquidSupply: {
    type: String,
  },
  mintedSupply: {
    type: String,
  },
  ownedSupply: {
    type: String,
  },
  totalCashBack: {
    type: String,
  },
  uniswapSwaped: {
    type: Boolean,
  },
});

var global = mongoose.model("global", globalSchema);
module.exports = global;
