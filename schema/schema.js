const graphql = require('graphql');
const Pitch = require('../models/Pitch');

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
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    pitch: {
      type: PitchType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        console.log('parent', parent);
        console.log('args', args);
        return Pitch.findById(args.id);
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});