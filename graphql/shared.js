const User = require("../models/user");
const Global = require("../models/global");

const ZERO = "0";
const ONE = "1";
const WCSPR_PER_CSPR = "1000000000";

function csprVal(cspr) {
  return BigInt(cspr) * BigInt(WCSPR_PER_CSPR);
}

async function getOrCreateGlobal() {
  let global = await Global.findOne({ id: "0" });
  if (global == null) {
    let newData = new Global({
      id: "0",
      userCount: ZERO,
      reserverCount: ZERO,
      reservationReferrerCount: ZERO,
      cmStatusCount: ZERO,
      cmStatusInLaunchCount: ZERO,
      reservationCount: ZERO,
      reservationEffectiveWei: ZERO,
      reservationActualWei: ZERO,
      stakeCount: ZERO,
      stakerCount: ZERO,
      totalShares: ZERO,
      totalStaked: ZERO,
      sharePrice: null,
      sharePricePrevious: null,
      referrerShares: ZERO,
      currentWiseDay: null,
      ownerlessSupply: ZERO,
      circulatingSupply: ZERO,
      liquidSupply: ZERO,
      mintedSupply: ZERO,
      ownedSupply: ZERO,
      totalCashBack: ZERO,
      uniswapSwaped: false,
      totalScsprContributed: ZERO,
      totalTransferTokens: ZERO,
    });
    global = await Global.create(newData);
  }
  return global;
}

async function createUser(id) {
  let newData = new User({
    id: id,
    reservationEffectiveWei: ZERO,
    reservationActualWei: ZERO,
    reservationReferralActualWei: ZERO,
    reservationCount: ZERO,
    reservationDayCount: ZERO,
    reservationReferralCount: ZERO,
    scsprContributed: ZERO,
    transferTokens: ZERO,
    stakeCount: ZERO,
    cmStatus: false,
    cmStatusInLaunch: false,
    gasRefunded: ZERO,
  });
  let user = await User.create(newData);
  return user;
}
module.exports = {
  ZERO,
  ONE,
  WCSPR_PER_CSPR,
  csprVal,
  getOrCreateGlobal,
  createUser,
};
