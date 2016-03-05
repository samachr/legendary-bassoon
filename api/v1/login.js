"use strict";

/**
 * Created by kamis on 3/4/2016.
 *
 * Contains definitions for all /api/v1/login/* endpoints
 */

var express = require('express');
var async = require('async');
var juror_dao = require('../../data/DAO/jurymembers_dao');
var Juror = juror_dao.Juror;

var router = express.Router();

router.post('/verification', function (req, res) {
    if (!req.body || !req.body['juror_id'] || !req.body['last_name']) {
        res.status(400).json({
            'is_valid': false,
            'error': 'POST parameters juror_id and last_name required'
        });
        console.log('/api/v1/login/verification - Invalid POST parameters');
        return;
    }

    async.waterfall([
        /**
         * Check to see if given juror exists
         * @param cb {function (err: Error|null, doesJurorExist: boolean?)}
         */
        function (cb) {
            juror_dao.doesJurorExist(req.body['juror_id'], cb);
        },

        /**
         * Gets juror data if exists, or returns false.
         * @param doesJurorExist {boolean}
         * @param cb {function (err: Error|null, jurorData: Juror=)}
         */
        function (doesJurorExist, cb) {
            if (doesJurorExist) {
                juror_dao.getJurorByID(req.body['juror_id'], cb);
            } else {
                cb(null, null);
            }
        },

        /**
         *
         * @param jurorData {Juror}
         * @param cb {function (err: Error|null)}
         */
        function (jurorData, cb) {
            if (!jurorData) {
                // Juror does not exist
                res.status(200).json({
                    is_valid: false,
                    error: 'Juror with given ID not found',
                    juror_id: req.body['juror_id']
                });
                console.log('/api/v1/login/verification - Juror with ID', req.body['juror_id'], 'not found');
            } else if (jurorData.lastName.toLowerCase() == req.body['last_name'].toLowerCase()) {
                // Valid last name
                res.status(200).json({
                    is_valid: true,
                    juror_id: req.body['juror_id'],
                    status: jurorData.registrationStatus
                });
                console.log('/api/v1/login/verification - Juror found');
            } else {
                // Invalid last name
                res.status(200).json({
                    is_valid: false,
                    error: 'Incorrect last name',
                    juror_id: req.body['juror_id']
                });
                console.log('/api/v1/login/verification - Invalid last name, expected', jurorData.lastName);
            }
            cb(null);
        }
    ], function (err) {
        if (err) {
            res.status(400).json({
                is_valid: false,
                error: 'Unknown error: ' + err.message
            });
        }
    });
});

//router.post('/password', function (req, res) {
//    if (!req.body || !req.body['juror_id'] || !req.body['last_name']) {
//
//    }
//});

module.exports = router;