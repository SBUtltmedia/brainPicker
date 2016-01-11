import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList
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
      type: new GraphQLList(brainStructureType),
      description: 'The friends of the brainStructure, or an empty list if they have none.',
      resolve: (brainStructure, params, source, fieldASTs) => {
        var projections = getProjection(fieldASTs);
        return BrainStructure.find({
          _id: {
            // to make it easily testable
            $in: brainStructure.friends.map((id) => id.toString())
          }
        }, projections);
      },
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
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (root, {id}, source, fieldASTs) => {
          var projections = getProjection(fieldASTs);
          return BrainStructure.findById(id, projections);
        }
      }
    }
  })
});

export var getProjection;
export default schema;
