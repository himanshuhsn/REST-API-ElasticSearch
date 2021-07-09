(function () {
  'use strict';

  const express = require('express');
  const router = express.Router();

  const elasticsearch = require('elasticsearch');
  const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

  const search = function search(index, body) {
    return esClient.search({ index: index, body: body });
  };

  router.get('/', (req, res) => {
    let q_and = req.query.q_and;
    let q1_or = req.query.q1_or;
    let q2_or = req.query.q2_or;

    let body = {
      "query": {
        "bool": {
          "should": [
            {
              "match_phrase_prefix": {
                "listed_in": `${q2_or}`
              }
            },
            {
              "match_phrase_prefix": {
                "listed_in": `${q1_or}`
              }
            }
          ],
          "filter": {
            "bool": {
              "must": [
                {
                  "match_phrase_prefix": {
                    "listed_in": `${q_and}`
                  }
                }
              ]
            }
          }
        }
      }
    };

    search('netflix', body)
      .then(results => {
        res.send(results);
      })
      .catch(console.error);
  });

  // only for testing purposes
  // all calls should be initiated through the module
  const test = function test() {
    let body = {
      "query": {
        "bool": {
          "should": [
            {
              "match_phrase_prefix": {
                "listed_in": "comedy"
              }
            },
            {
              "match_phrase_prefix": {
                "listed_in": "horror"
              }
            }
          ],
          "filter": {
            "bool": {
              "must": [
                {
                  "match_phrase_prefix": {
                    "listed_in": "drama"
                  }
                }
              ]
            }
          }
        }
      }
    };

    console.log(`retrieving all documents (displaying ${body.size} at a time)...`);
    search('netflix', body)
      .then(results => {
        console.log(`found ${results.hits.total} items in ${results.took}ms`);
        console.log(`returned article titles:`);
        results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.title}`));
      })
      .catch(console.error);
  };

  //test();

  module.exports = router;
}());
