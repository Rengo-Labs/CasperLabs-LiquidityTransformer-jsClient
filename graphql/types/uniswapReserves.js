const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
  } = require("graphql");
  
  const uniswapReservesType = new GraphQLObjectType({
    name: "uniswapReserves",
    description: "uniswapReserves type",
    fields: () => ({
      _id: { type: GraphQLID },
      id: {
        type: GraphQLString,
      },
      reserveA: {
        type: GraphQLString,
      },
      reserveB: {
        type: GraphQLString,
      },
      blockTimestampLast: {
        type: GraphQLString,
      },
      tokenA: {
        type: GraphQLString,
      },
      tokenB: {
        type: GraphQLString,
      },
      pair: {
        type: GraphQLString,
      },
    }),
  });
  
  module.exports = { uniswapReservesType };
  