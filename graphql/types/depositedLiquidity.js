const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const depositedLiquidityType = new GraphQLObjectType({
  name: "depositedLiquidity",
  description: "depositedLiquidity type",
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: GraphQLString,
    },
    amount: {
      type: GraphQLString,
    },
    deployHash: {
      type: GraphQLString,
    },
  }),
});

module.exports = { depositedLiquidityType };
