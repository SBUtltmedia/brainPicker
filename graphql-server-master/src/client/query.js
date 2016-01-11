import request from 'superagent';
import Debug from 'debug';

var debug = new Debug('client:query');

request
  .get('http://localhost:3000/data')
  .query({
    query: `{
      brainStructure(name: "Corpus Callosum") {
        name
        regions {
          id
        }
      }
    }`
  })
  .end(function (err, res) {
    debug(err || res.body);
    debug('regions', res.body.data.brainStructure.regions);
  });
