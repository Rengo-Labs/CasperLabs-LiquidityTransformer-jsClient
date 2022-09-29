const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const reservationReferralType = new GraphQLObjectType({
  name: "reservationReferral",
  description: "reservationReferral type",
  fields: () => ({
    _id: { type: GraphQLID },
    id: {
      type: GraphQLString,
    },
    transaction: {
      type: GraphQLString,
    },
    timestamp: {
      type: GraphQLString,
    },
    referrer: {
      type: GraphQLString,
    },
    referee: {
      type: GraphQLString,
    },
    actualWei: {
      type: GraphQLString,
    },
  }),
});

module.exports = { reservationReferralType };
