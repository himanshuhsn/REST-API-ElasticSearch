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
        let name = req.query.name;
        let two_grams = twoGrams(name);
        let body = makeBody(two_grams);

        search('netflix', body)
            .then(results => {
                res.send(results);
            })
            .catch(console.error);
    });

    // forms different 2grams from the given name
    function twoGrams(name){
        let ret_list = [];
        let words = name.split(" ");
        for(let i=0; i<words.length; i++) {
            let word = words[i];
            for(let j=0; j<word.length-1; j++){
                ret_list.push(word[j]+word[j+1]);
            }
        }
        return ret_list;
    }

    // make the body that is to be given to elasticsearch
    function makeBody(list){
        let lst = [];
        
        for(let i=0; i<list.length; i++){
            let obj = {term:{director:list[i]}};
            lst.push(obj);
        }
        let body = {
            "query": {
                "bool": {
                  "must": lst
                }
            }
        }
        return body;
    }

    // no test for this file
    module.exports = router;
}());
