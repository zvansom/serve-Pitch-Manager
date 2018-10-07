const graphql = require('graphql');
const Pitch = require('../models/Pitch');
const User = require('../models/User');
const Client = require('../models/Client');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: ( ) => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    editor: { type: GraphQLString },
    email: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args){
        return User.findById(parent.user);
      },
    },
  }),
});

const PitchType = new GraphQLObjectType({
  name: 'Pitch',
  fields: ( ) => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    description: { type: GraphQLString },
    created: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args){
        return User.findById(parent.user);
      },
    },
    client: {
      type: ClientType,
      resolve(parent, args){
        return Client.findById(parent.client);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ( ) => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    pitches: {
      type: new GraphQLList(PitchType),
      resolve(parent, args){
        return Pitch.find({ user: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    pitch: {
      type: PitchType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        return Pitch.findById(args.id);
      },
    },
    pitches: {
      type: new GraphQLList(PitchType),
      resolve(parent, args){
        return Pitch.find({});
      }, 
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args){
        return User.find({});
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args){
        return Client.find({});
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});