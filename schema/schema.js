const graphql = require('graphql');
const Pitch = require('../models/Pitch');
const User = require('../models/User');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const PitchType = new GraphQLObjectType({
  name: 'Pitch',
  fields: ( ) => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    description: { type: GraphQLString },
    created: { type: GraphQLString },
    authorId: {
      type: UserType,
      resolve(parent, args){
        console.log('parent', parent)
        return User.findById(parent.authorId);
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
        console.log('parent id', parent.id);
        return Pitch.find({ authorId: parent.id });
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});