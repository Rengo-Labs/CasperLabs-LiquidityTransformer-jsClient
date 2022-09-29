const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const formedLiquidityType = new GraphQLObjectType({
  name: "formedLiquidity",
  description: "formedLiquidity type",
  fields: () => ({
    _id: { type: GraphQLID },
    id: {
      type: GraphQLString,
    },
    tokenA: {
      type: GraphQLString,
    },
    tokenB: {
      type: GraphQLString,
    },
    amountTokenA: {
      type: GraphQLString,
    },
    amountTokenB: {
      type: GraphQLString,
    },
    liquidity: {
      type: GraphQLString,
    },
    pair: {
      type: GraphQLString,
    },
    to: {
      type: GraphQLString,
    },
    coverAmount: {
      type: GraphQLString,
    },
  }),
});

module.exports = { formedLiquidityType };
