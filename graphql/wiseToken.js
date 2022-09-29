require("dotenv").config();
const { getOrCreateGlobal, createUser, ZERO, ONE } = require("./shared");
const { GraphQLString, GraphQLBoolean } = require("graphql");
var WiseTokenContract = require("../JsClients/WISETOKEN/wiseTokenFunctionsForBackend/functions");

const Stake = require("../models/stake");
const User = require("../models/user");
const UniswapReserves = require("../models/uniswapReserves");
const LiquidityGuardStatus = require("../models/liquidityGuardStatus");

const Response = require("../models/response");
const { responseType } = require("./types/response");

const handleGiveStatus = {
  type: responseType,
  description: "Handle Give Status",
  args: {
    referrerId: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      //let referrerID = call.inputs._referrer.toHex();
      let referrerID = args.referrerId;
      let referrer = await User.findOne({ id: referrerID });
      if (referrer == null) {
        referrer = await createUser(referrerID);
      }
      if (referrer.cmStatus === false) {
        referrer.cmStatus = true;
        referrer.cmStatusInLaunch = true;

        let global = await getOrCreateGlobal();
        global.cmStatusCount = (
          BigInt(global.cmStatusCount) + BigInt(ONE)
        ).toString();
        global.cmStatusInLaunchCount = (
          BigInt(global.cmStatusInLaunchCount) + BigInt(ONE)
        ).toString();
        await global.save();
      }

      await referrer.save();
      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const handleStakeStart = {
  type: responseType,
  description: "Handle Stake Start",
  args: {
    stakerAddress: { type: GraphQLString },
    referralAddress: { type: GraphQLString },
    referralShares: { type: GraphQLString },
    stakeID: { type: GraphQLString },
    stakedAmount: { type: GraphQLString },
    stakesShares: { type: GraphQLString },
    startDay: { type: GraphQLString },
    lockDays: { type: GraphQLString },
    daiEquivalent: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let global = await getOrCreateGlobal();
      global.stakeCount = (BigInt(global.stakeCount) + BigInt(ONE)).toString();

      let stakerID = args.stakerAddress;
      let staker = await User.findOne({ id: stakerID });

      if (staker == null) {
        staker = await createUser(stakerID);
        global.userCount = (BigInt(global.userCount) + BigInt(ONE)).toString();
        global.stakerCount = (
          BigInt(global.stakerCount) + BigInt(ONE)
        ).toString();
      }
      staker.stakeCount = (BigInt(staker.stakeCount) + BigInt(ONE)).toString();
      await staker.save();

      let referrerID = args.referralAddress;
      let referrer = await User.findOne({ id: referrerID });

      if (referrer == null) {
        referrer = await createUser(referrerID);
        global.userCount = (BigInt(global.userCount) + BigInt(ONE)).toString();
      }
      if (BigInt(args.referralShares) > BigInt(ZERO)) {
        if (referrer.cmStatus === false) {
          global.cmStatusCount = (
            BigInt(global.cmStatusCount) + BigInt(ONE)
          ).toString();
        }
        referrer.cmStatus = true;
      }
      await referrer.save();
      await global.save();

      let newData = new Stake({
        id: args.stakeID,
        staker: staker.id,
        referrer: referrer.id,
        principal: args.stakedAmount,
        shares: args.stakesShares,
        cmShares: args.referralShares,
        currentShares: args.stakesShares,
        startDay: args.startDay,
        lockDays: args.lockDays,
        daiEquivalent: args.daiEquivalent,
        reward: ZERO,
        closeDay: ZERO,
        penalty: ZERO,
        scrapedYodas: ZERO,
        sharesPenalized: ZERO,
        referrerSharesPenalized: ZERO,
        scrapeCount: ZERO,
        lastScrapeDay: null,
      });

      await Stake.create(newData);

      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const handleStakeEnd = {
  type: responseType,
  description: "Handle Stake End",
  args: {
    stakeID: { type: GraphQLString },
    closeDay: { type: GraphQLString },
    rewardAmount: { type: GraphQLString },
    penaltyAmount: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let stake = await Stake.findOne({ id: args.stakeID });
      stake.id = args.stakeID;
      stake.closeDay =args.closeDay;
      stake.penalty = args.penaltyAmount;
      stake.reward = args.rewardAmount;

      await stake.save();

      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};
const handleInterestScraped = {
  type: responseType,
  description: "Handle Interest Scraped",
  args: {
    stakeID: { type: GraphQLString },
    scrapeDay: { type: GraphQLString },
    scrapeAmount: { type: GraphQLString },
    stakersPenalty: { type: GraphQLString },
    referrerPenalty: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let stake = await Stake.findOne({ id: args.stakeID });
      stake.scrapeCount = (BigInt(stake.scrapeCount) + BigInt(ONE)).toString();
      stake.lastScrapeDay = args.scrapeDay;
      stake.scrapedYodas = (
        BigInt(stake.scrapedYodas) + BigInt(args.scrapeAmount)
      ).toString();
      stake.currentShares = (
        BigInt(stake.currentShares) - BigInt(args.stakersPenalty)
      ).toString();
      stake.sharesPenalized = (
        BigInt(stake.sharesPenalized) + BigInt(args.stakersPenalty)
      ).toString();
      stake.referrerSharesPenalized = (
        BigInt(stake.referrerSharesPenalized) + BigInt(args.referrerPenalty)
      ).toString();
      await stake.save();
      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const handleNewGlobals = {
  type: responseType,
  description: "Handle New Globals",
  args: {
    totalShares: { type: GraphQLString },
    totalStaked: { type: GraphQLString },
    shareRate: { type: GraphQLString },
    referrerShares: { type: GraphQLString },
    currentWiseDay: { type: GraphQLString },
    wiseAddress: { type: GraphQLString },
    UNISWAP_PAIR: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let global = await getOrCreateGlobal();
      global.totalShares = args.totalShares;
      global.totalStaked = args.totalStaked;
      global.sharePrice = args.shareRate;
      global.referrerShares = args.referrerShares;
      global.currentWiseDay = args.currentWiseDay;
      global.ownerlessSupply =  (await WiseTokenContract.balanceOf(args.wiseAddress,args.UNISWAP_PAIR.toLowerCase())).toString();
      global.circulatingSupply = (await WiseTokenContract.getTotalSupply(args.wiseAddress)).toString();

      global.liquidSupply = (
        BigInt(global.circulatingSupply) - BigInt(global.ownerlessSupply)
      ).toString();
      global.mintedSupply = (
        BigInt(global.circulatingSupply) + BigInt(global.totalStaked)
      ).toString();
      global.ownedSupply = (
        BigInt(global.liquidSupply) + BigInt(global.totalStaked)
      ).toString();
      await global.save();

      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};
const handleNewSharePrice = {
  type: responseType,
  description: "Handle New Share Price",
  args: {
    newSharePrice: { type: GraphQLString },
    oldSharePrice: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let global = await getOrCreateGlobal();
      global.sharePrice = args.newSharePrice;
      global.sharePricePrevious = args.oldSharePrice;
      await global.save();
      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const handleUniswapReserves = {
  type: responseType,
  description: "Handle Uniswap Reserves",
  args: {
    reserveA: { type: GraphQLString },
    reserveB: { type: GraphQLString },
    blockTimestampLast: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let uniswapReservesResult = await UniswapReserves.findOne({
        id:
          process.env.WISETOKEN_PACKAGE_HASH +
          " - " +
          process.env.SYNTHETIC_CSPR_PACKAGE +
          " - " +
          process.env.PAIR_PACKAGE_HASH,
      });
      if (uniswapReservesResult == null) {
        let newData = new UniswapReserves({
          id:
            process.env.WISETOKEN_PACKAGE_HASH +
            " - " +
            process.env.SYNTHETIC_CSPR_PACKAGE +
            " - " +
            process.env.PAIR_PACKAGE_HASH,
          reserveA: args.reserveA,
          reserveB: args.reserveB,
          blockTimestampLast: args.blockTimestampLast,
          tokenA: process.env.WISETOKEN_PACKAGE_HASH,
          tokenB: process.env.SYNTHETIC_CSPR_PACKAGE,
          pair: process.env.PAIR_PACKAGE_HASH,
        });
        await UniswapReserves.create(newData);
      } else {
        uniswapReservesResult.reserveA = args.reserveA;
        uniswapReservesResult.reserveB = args.reserveB;
        uniswapReservesResult.blockTimestampLast = args.blockTimestampLast;
        await uniswapReservesResult.save();
      }
      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const handleLiquidityGuardStatus = {
  type: responseType,
  description: "Handle LiquidityGuardStatus",
  args: {
    liquidityGuardStatus: { type: GraphQLBoolean },
  },
  async resolve(parent, args, context) {
    try {
      let liquidityGuardStatusResult = await LiquidityGuardStatus.findOne({
        id: "0",
      });
      if (liquidityGuardStatusResult == null) {
        let newData = new LiquidityGuardStatus({
          id: "0",
          liquidityGuardStatus: args.liquidityGuardStatus,
        });
        await LiquidityGuardStatus.create(newData);
      } else {
        liquidityGuardStatusResult.liquidityGuardStatus =
          args.liquidityGuardStatus;
        await liquidityGuardStatusResult.save();
      }
      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = {
  handleGiveStatus,
  handleStakeStart,
  handleStakeEnd,
  handleInterestScraped,
  handleNewGlobals,
  handleNewSharePrice,
  handleUniswapReserves,
  handleLiquidityGuardStatus,
};
