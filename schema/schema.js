const graphql = require('graphql');

// Require all models
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
      resolve(parent, args) {
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
    description: { type: GraphQLString },
    created: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.user);
      },
    },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.client);
      },
    },
    status: { type: GraphQLString },
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
      resolve(parent, args) {
        return Pitch.find({ user: parent.id });
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find({ user: parent.id });
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
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        return Client.findById(args.id);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPitch: {
      type: PitchType,
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        client: { type: GraphQLID },
        status: { type: GraphQLString },
      },
      resolve(parent, args) {
        let pitch = new Pitch({
          user: args.user,
          title: args.title,
          description: args.description,
          client: args.client,
          status: args.status,
        });
        return pitch.save();
      },
    },
    deletePitch: {
      type: PitchType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Pitch.findByIdAndDelete(args.id)
      }
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id)
      }
    },
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        editor: { type: GraphQLString },
        email: { type: GraphQLString },
        user: { type: new GraphQLNonNull(GraphQLID) },
        editingNotes: { type: GraphQLString },
        invoicingNotes: { type: GraphQLString },
      },
      resolve(parent, args){
        let client = new Client({
          name: args.name,
          editor: args.editor,
          email: args.email,
          user: args.user,
          editingNotes: args.editingNotes,
          invoicingNotes: args.invoicingNotes,
        });
        return client.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});