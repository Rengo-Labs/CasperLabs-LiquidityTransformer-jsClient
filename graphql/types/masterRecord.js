const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const masterRecordType = new GraphQLObjectType({
  name: "masterRecord",
  description: "masterRecord type",
  fields: () => ({
    _id: { type: GraphQLID },
    masterAddress: {
      type: GraphQLString,
    },
    amount: {
      type: GraphQLString,
    },
    source: {
      type: GraphQLString,
    },
  }),
});

module.exports = { masterRecordType };
