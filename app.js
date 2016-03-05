/**
 * Created by kamis on 3/4/2016.
 *
 * Main entry point of the application
 */
"use strict";

var express = require('express');
var bodyParser = require('body-parser');

var api_v1 = {
    'login': require('./api/v1/login'),
    'survey': require('./api/v1/survey'),
    'debug': require('./api/v1/debug')
};

var app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Public serving files
app.use(express.static('public'));

// API endpoint connecting
app.use('/api/v1/login', api_v1.login);
app.use('/api/v1/survey', api_v1.survey);
app.use('/api/v1/debug', api_v1.debug);

app.listen(1337, function () {
    console.log('Express app started on port 1337');
});
