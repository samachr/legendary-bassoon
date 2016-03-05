/**
 * Created by kamis on 3/4/2016.
 *
 * Main entry point of the application
 */
"use strict";

var express = require('express');

var app = express();

app.use(express.static('public'));

app.listen(1337, function () {
    console.log('Express app started on port 3000');
});

require('./data/DAO/community_dao').DEBUG.getRandomCommunityPool(5, 3, function (err, result) {
    if (err) {
        console.error('ERROR:', err);
    } else {
        console.log('RESULT:', result);
    }
});