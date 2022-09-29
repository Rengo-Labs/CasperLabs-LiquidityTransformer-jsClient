const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const userType = new GraphQLObjectType({
  name: "user",
  description: "user type",
  fields: () => ({
    _id: { type: GraphQLID },
    id: {
      type: GraphQLString,
    },
    transactions: {
      type: GraphQLString,
    },
    reservations: {
      type: GraphQLString,
    },
    reservationDays: {
      type: GraphQLString,
    },
    reservationEffectiveWei: {
      type: GraphQLString,
    },
    reservationActualWei: {
      type: GraphQLString,
    },
    reservationCount: {
      type: GraphQLString,
    },
    reservationDayCount: {
      type: GraphQLString,
    },
    reservationReferrals: {
      type: GraphQLString,
    },
    reservationReferralActualWei: {
      type: GraphQLString,
    },
    reservationReferralCount: {
      type: GraphQLString,
    },
    scsprContributed: {
      type: GraphQLString,
    },
    transferTokens: {
      type: GraphQLString,
    },
    stakes: {
      type: GraphQLString,
    },
    stakeReferrals: {
      type: GraphQLString,
    },
    stakeCount: {
      type: GraphQLString,
    },
    cmStatus: {
      type: GraphQLBoolean,
    },
    cmStatusInLaunch: {
      type: GraphQLBoolean,
    },
    gasRefunded: {
      type: GraphQLString,
    },
    refundTransaction: {
      type: GraphQLString,
    },
    cashBackAmount: {
      type: GraphQLString,
    },
    senderValue: {
      type: GraphQLString,
    },
    cashBackTransaction: {
      type: GraphQLString,
    },
  }),
});

module.exports = { userType };
