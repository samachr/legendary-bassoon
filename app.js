/**
 * Created by kamis on 3/4/2016.
 *
 * Main entry point of the application
 */
"use strict";

var express = require('express');
var bodyParser = require('body-parser');

var api_v1 = {
    'login': require('./api/v1/login')
};

var app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Public serving files
app.use(express.static('public'));

// API endpoint connecting
app.use('/api/v1/login', api_v1.login);

app.listen(1337, function () {
    console.log('Express app started on port 1337');
});

var TEST = require('./data/DAO/jurymembers_dao');

TEST.saveNewJuror('Kamaron', 'Peterson',
'123 Merrill Hall', 'Logan, UT 84321', '(469) 525-0284',
null, true, true, false, false, 0, function () {});