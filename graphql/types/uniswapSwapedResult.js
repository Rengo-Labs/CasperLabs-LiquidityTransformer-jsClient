const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const uniswapSwapedResultType = new GraphQLObjectType({
  name: "uniswapSwapedResult",
  description: "uniswapSwapedResult type",
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
  }),
});

module.exports = { uniswapSwapedResultType };
