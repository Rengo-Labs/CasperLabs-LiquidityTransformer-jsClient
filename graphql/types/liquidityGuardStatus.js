const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const liquidityGuardStatusType = new GraphQLObjectType({
  name: "liquidityGuardStatus",
  description: "liquidityGuardStatus type",
  fields: () => ({
    _id: { type: GraphQLID },
    id: {
      type: GraphQLString,
    },
    liquidityGuardStatus: {
      type: GraphQLString,
    },
  }),
});

module.exports = { liquidityGuardStatusType };
