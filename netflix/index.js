const express = require('express');
const app = express();

const for_adult = require('./A/for_adult');
const for_child = require('./A/for_child');
const page_movies = require('./B/page_movies');
const page_tvshows = require('./B/page_tvshows');
const prefix_match = require('./C/prefix_match');
const genre_match = require('./C/genre_match');
const exact_match = require('./C/exact_match');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/InfoSearch/for_adult', for_adult);
app.use('/InfoSearch/for_child', for_child);
app.use('/InfoSearch/page_movies', page_movies);
app.use('/InfoSearch/for_child', page_tvshows);
app.use('/InfoSearch/prefix_match', prefix_match);
app.use('/InfoSearch/genre_match', genre_match);
app.use('/InfoSearch/exact_match', exact_match);

app.get('/', (req, res) => {
    res.send("Welcome to NETFLIX search by InfoSearch\n");
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listining on port ${port}`));
