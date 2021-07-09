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

  router.get('/', (req,res) => {
    let pageSize = req.query.ps;
    let pageNumber = req.query.pn;

    let from = pageSize*(pageNumber-1);

    let body = {
      "from": from,
      "size": pageSize,
      "query": {
        "match_phrase": {
          "type": "tv show"
        }
      },
      "sort": [
        { "release_year": "desc" }
      ]
    };

    search('netflix', body)
    .then(results=>{
      res.send(results);
    })
    .catch(console.error);
  });

  // only for testing purposes
  // all calls should be initiated through the module
  const test = function test() {
    let body = {
      "from": 81,
      "size": 10,
      "query": {
        "match_phrase": {
          "type": "movie"
        }
      },
      "sort": [
        { "release_year": "desc" }
      ]
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
