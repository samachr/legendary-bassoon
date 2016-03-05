/**
 * Created by kamis on 3/4/2016.
 *
 * Main entry point of the application
 */

var express = require('express');

var app = express();

app.use(express.static('public'));

app.listen(1337, function () {
    console.log('Express app started on port 3000');
});