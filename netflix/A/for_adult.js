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
      res.send("Please mention the text");
    });

    router.get('/:req_text', (req,res) => {
      let req_text = req.params.req_text;
      let body = {
        "from": 0,
        "size": 5,
        "query": {
          "bool": {
            "should": [
              {
                "regexp": {
                  "type": `${req_text}.*`
                }
              },
              {
                "regexp": {
                  "title": `${req_text}.*`
                }
              },
              {
                "regexp": {
                  "director": `${req_text}.*`
                }
              },
              {
                "regexp": {
                  "cast": `${req_text}.*`
                }
              },
              {
                "regexp": {
                  "country": `${req_text}.*`
                }
              },
              {
                "regexp": {
                  "rating": `${req_text}.*`
                }
              },
              {
                "regexp": {
                  "listed_in": `${req_text}.*`
                }
              },
              {
                "regexp": {
                  "description": `${req_text}.*`
                }
              }
            ]
          }
        }
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
            "from": 0,
            "size": 5,
            "query": {
              "bool": {
                "should": [
                  {
                    "regexp": {
                      "type": "terrifying.*"
                    }
                  },
                  {
                    "regexp": {
                      "description": "terrifying.*"
                    }
                  },
                  {
                    "regexp": {
                      "title": "terrifying.*"
                    }
                  }
                ]
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