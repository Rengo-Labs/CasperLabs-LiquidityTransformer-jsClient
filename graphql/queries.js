const { GraphQLList, GraphQLInt, GraphQLString } = require("graphql");

// import types
const { responseType } = require("./types/response");
const { userType } = require("./types/user");
const { globalType } = require("./types/global");

// import Models
const Response = require("../models/response");
const User = require("../models/user");
const Global = require("../models/global");

const responses = {
  type: GraphQLList(responseType),
  description: "Retrieves list of responses",
  args: {
    start: { type: GraphQLInt },
    end: { type: GraphQLInt },
  },
  async resolve(parent, args, context) {
    try {
      let responses = await Response.find();

      return responses.splice(args.start, args.end);
    } catch (error) {
      throw new Error(error);
    }
  },
};

const response = {
  type: responseType,
  description: "Retrieves response against Id",
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let response = await Response.findOne({ id: args.id });

      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const user = {
  type: userType,
  description: "Retrieves user against user",
  args: {
    user: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let user = await User.findOne({ id: args.user });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const global = {
  type: globalType,
  description: "Retrieves global against Id",
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let global = await Global.findOne({ id: args.id });

      return global;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = {
  responses,
  response,
  user,
  global,
};
