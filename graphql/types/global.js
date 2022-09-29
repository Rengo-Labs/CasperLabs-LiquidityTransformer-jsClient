const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const globalType = new GraphQLObjectType({
  name: "global",
  description: "global type",
  fields: () => ({
    _id: { type: GraphQLID },
    id: {
      type: GraphQLString,
    },
    userCount: {
      type: GraphQLString,
    },
    reserverCount: {
      type: GraphQLString,
    },
    reservationReferrerCount: {
      type: GraphQLString,
    },
    cmStatusCount: {
      type: GraphQLString,
    },
    cmStatusInLaunchCount: {
      type: GraphQLString,
    },
    reservationCount: {
      type: GraphQLString,
    },
    reservationEffectiveWei: {
      type: GraphQLString,
    },
    reservationActualWei: {
      type: GraphQLString,
    },
    totalScsprContributed: {
      type: GraphQLString,
    },
    totalTransferTokens: {
      type: GraphQLString,
    },
    stakeCount: {
      type: GraphQLString,
    },
    stakerCount: {
      type: GraphQLString,
    },
    totalShares: {
      type: GraphQLString,
    },
    totalStaked: {
      type: GraphQLString,
    },
    sharePrice: {
      type: GraphQLString,
    },
    sharePricePrevious: {
      type: GraphQLString,
    },
    referrerShares: {
      type: GraphQLString,
    },
    currentWiseDay: {
      type: GraphQLString,
    },
    ownerlessSupply: {
      type: GraphQLString,
    },
    circulatingSupply: {
      type: GraphQLString,
    },
    liquidSupply: {
      type: GraphQLString,
    },
    mintedSupply: {
      type: GraphQLString,
    },
    ownedSupply: {
      type: GraphQLString,
    },
    totalCashBack: {
      type: GraphQLString,
    },
    uniswapSwaped: {
      type: GraphQLBoolean,
    },
  }),
});

module.exports = { globalType };
