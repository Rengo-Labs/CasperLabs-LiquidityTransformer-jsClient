const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const scsprLiquidityType = new GraphQLObjectType({
  name: "scsprLiquidity",
  description: "scsprLiquidity type",
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: GraphQLString,
    },
    amount: {
      type: GraphQLString,
    },
  }),
});

module.exports = { scsprLiquidityType };
