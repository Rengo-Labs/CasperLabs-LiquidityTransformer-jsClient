const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const transactionType = new GraphQLObjectType({
  name: "transaction",
  description: "transaction type",
  fields: () => ({
    _id: { type: GraphQLID },
    id: {
      type: GraphQLString,
    },

    blockNumber: {
      type: GraphQLString,
    },

    timestamp: {
      type: GraphQLString,
    },

    sender: {
      type: GraphQLString,
    },

    referral: {
      type: GraphQLString,
    },

    reservations: {
      type: GraphQLString,
    },
  }),
});

module.exports = { transactionType };
