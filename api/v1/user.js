"use strict";

/**
 * Endpoints for dealing with user information
 *
 * Created by kamis on 3/5/2016.
 */

var express = require('express');
var async = require('async');
var juror_dao = require('../../data/DAO/jurymembers_dao');
var survey_dao = require('../../data/DAO/survey_dao');
var Juror = juror_dao.Juror;

var route = express.Router();

route.post('/update', function (req, res) {
    if (!req.body || !req.body['juror_id']) {
        res.status(400).json({
            is_valid: false,
            error: 'Required parameters: juror_id'
        });
        return;
    }

    async.waterfall([
        /**
         * Check to make sure juror with given ID exists
         * @param cb {function (err: Error|null, exists: boolean?)}
         */
        function (cb) {
            juror_dao.doesJurorExist(req.body['juror_id'], cb);
        },

        /**
         * Load the juror from the database
         * @param doesExist {boolean}
         * @param cb {function (err: Error|null, jurorData: Juror?)}
         */
        function (doesExist, cb) {
            if(!doesExist) {
                res.status(200).json({
                    is_valid: false,
                    error: 'No juror by given Id found',
                    juror_id: req.body['juror_id']
                });
            } else {
                juror_dao.getJurorByID(req.body['juror_id'], cb);
            }
        },

        /**
         * Update juror data, write back to file
         * @param jurorData {Juror}
         * @param cb {function (err: Error|null, res: Juror?)}
         */
        function (jurorData, cb) {
            if (req.body['firstName']) {
                jurorData.firstName = req.body['firstName'];
            }
            if (req.body['lastName']) {
                jurorData.lastName = req.body['lastName'];
            }
            if (req.body['address1']) {
                jurorData.address1 = req.body['address1'];
            }
            if (req.body['address2']) {
                jurorData.address2 = req.body['address2'];
            }
            if (req.body['phone']) {
                jurorData.phone = req.body['phone'];
            }
            if (req.body['email']) {
                jurorData.email = req.body['email'];
            }
            if (req.body.hasOwnProperty('canText')) {
                jurorData.canText = !!req.body['canText'];
            }
            if (req.body.hasOwnProperty('receiveCall')) {
                jurorData.receiveCall = !!req.body['receiveCall'];
            }
            if (req.body.hasOwnProperty('receiveEmail')) {
                jurorData.receiveEmail = !!req.body['receiveEmail'];
            }
            if (req.body.hasOwnProperty('receiveText')) {
                jurorData.receiveText = !!req.body['receiveText'];
            }
            if (req.body['registrationStatus']) {
                jurorData.registrationStatus = req.body['registrationStatus'];
            }
            if (!isNaN(parseInt(req.body['deferCount']))) {
                jurorData.deferCount = req.body['deferCount'];
            }
            if (req.body['password']) {
                jurorData.password = req.body['password'];
            }
            juror_dao.updateJurorInfo(req.body['juror_id'], jurorData, function (err) {
                cb(err, jurorData);
            });
        }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                is_valid: false,
                error: 'Unknown server error: ' + err.message
            });
            console.error(err);
        } else {
            res.status(200).json({
                is_valid: true,
                juror_id: req.body['juror_id'],
                juror_data: result
            });
        }
    });
});

module.exports = route;