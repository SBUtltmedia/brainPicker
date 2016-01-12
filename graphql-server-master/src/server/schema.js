import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLFloat
} from 'graphql/type';

import co from 'co';
import BrainStructure from './brainStructure';

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
function getProjection (fieldASTs) {
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1;

    return projections;
  }, {});
}

var regionType = new GraphQLObjectType({
    name: 'Region',
    description: 'region',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The id of the brainStructure.',
      },
      points: {
        type: new GraphQLList(new GraphQLList(GraphQLFloat)),
        description: 'points',
      }
    })
});


var brainStructureType = new GraphQLObjectType({
  name: 'BrainStructure',
  description: 'BrainStructure creator',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the brainStructure.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the brainStructure.',
    },
    regions: {
      type: new GraphQLList(regionType),
      description: 'The friends of the brainStructure, or an empty list if they have none.',
    }
  })
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: function() {
          return 'world';
        }
      },
      brainStructure: {
        type: brainStructureType,
        args: {
          name: {
            name: 'name',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (root, {name}, source, fieldASTs) => {

            console.log("name", name);

          var projections = getProjection(fieldASTs);
          return BrainStructure.find({name: name}, projections);
        }
      }
    }
  })
});

export var getProjection;
export default schema;
