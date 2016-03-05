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
    if (!req.body || isNaN(parseInt(req.body['juror_id'])) || !req.body['last_name']) {
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
            res.status(500).json({
                is_valid: false,
                error: 'Unknown error: ' + err.message
            });
        }
    });
});

router.post('/password/set', function (req, res) {
    if (!req.body || isNaN(parseInt(req.body['juror_id'])) || !req.body['password']) {
        res.status(400).json({
            is_valid: false,
            error: 'Invalid request body: Need juror_id and password'
        });
        return;
    }

    async.waterfall([
        /**
         * Make sure juror with given ID exists
         * @param cb {function (err: Error|null, res: boolean?)}
         */
        function (cb) {
            juror_dao.doesJurorExist(req.body['juror_id'], cb);
        },

        /**
         * Fetch juror data
         * @param doesJurorExist {boolean}
         * @param cb {function (err: Error|null, jurorData: Juror?)}
         */
        function (doesJurorExist, cb) {
            if (!doesJurorExist) {
                res.status(200).json({
                    is_valid: false,
                    error: 'Juror with given JurorID does not exist',
                    juror_id: req.body['juror_id']
                });
                return;
            }
            juror_dao.getJurorByID(req.body['juror_id'], cb);
        },

        /**
         * Update password of the juror (if exists) and
         *  save back to database.
         * @param jurorData {Juror}
         * @param cb {function (err: Error|null)}
         */
        function (jurorData, cb) {
            if (req.body['password'] == '') {
                res.status(200).json({
                    is_valid: false,
                    error: 'Password must not be empty',
                    juror_id: req.body['juror_id'],
                });
                return;
            }
            jurorData.password = req.body['password'];
            jurorData.registrationStatus = 'active';
            juror_dao.updateJurorInfo(req.body['juror_id'], jurorData, cb);
        }
    ], function (err) {
        if (err) {
            res.status(500).json({
                is_valid: false,
                error: 'Unknown error: ' + err.message
            });
        } else {
            res.status(200).json({
                is_valid: true,
                juror_id: req.body['juror_id']
            });
        }
    });
});

router.post('/password', function (req, res) {
    if (!req.body || isNaN(parseInt(req.body['juror_id'])) || !req.body['password']) {
        res.status(400).json({
            is_valid: false,
            error: 'Invalid request body: Need juror_id and password'
        });
        return;
    }

    async.waterfall([
        /**
         * Make sure juror with provided ID exists
         * @param cb {function (err: Error|null, doesExist: boolean?)}
         */
        function (cb) {
            juror_dao.doesJurorExist(req.body['juror_id'], cb);
        },

        /**
         * Get juror data
         * @param jurorExists {boolean}
         * @param cb {function (err: Error|null, jurorData: Juror?)}
         */
        function (jurorExists, cb) {
            if (!jurorExists) {
                res.status(200).json({
                    is_valid: false,
                    error: 'Juror with given ID does not exist',
                    juror_id: req.body['juror_id']
                });
                return;
            }

            juror_dao.getJurorByID(req.body['juror_id'], cb);
        },

        /**
         * Check the provided password against the given juror data
         * @param jurorData {Juror}
         */
        function (jurorData) {
            if (jurorData.password == req.body['password']) {
                jurorData.password = null;
                res.status(200).json({
                    is_valid: true,
                    juror_data: jurorData
                });
            } else {
                res.status(200).json({
                    is_valid: false,
                    error: 'Incorrect password',
                    juror_id: req.body['juror_id']
                });
            }
        }
    ], function (err) {
        if (err) {
            res.status(500).json({
                is_valid: false,
                error: 'Unknown error: ' + err.message
            });
        }
    });
});

router.get('/user/:id', function (req, res) {
    if (!req.params || isNaN(parseInt(req.params.id)) || isNaN(parseInt(req.params.id))) {
        res.status(400).json({
            is_valid: false,
            error: 'Format: /user/:id, with integer id'
        });
        return;
    }

    async.waterfall([
        /**
         * Make sure juror with given ID exists
         * @param cb {function (err: Error|null, res: boolean?)}
         */
        function (cb) {
            juror_dao.doesJurorExist(req.params.id, cb);
        },

        /**
         * If juror exists, get the juror with the given information
         * @param doesJurorExist {boolean}
         * @param cb {function (err: Error|null, res: Juror?)}
         */
        function (doesJurorExist, cb) {
            if (!doesJurorExist) {
                res.status(200).json({
                    is_valid: false,
                    error: 'No juror exists with given ID',
                    juror_id: req.params.id
                });
                return;
            }

            juror_dao.getJurorByID(req.params.id, cb);
        },

        /**
         * Strip password from data, return to user
         * @param jurorData {Juror}
         * @param cb {function (err: Error|null)}
         */
        function (jurorData, cb) {
            jurorData.password = null;
            res.status(200).json({
                is_valid: true,
                juror_data: jurorData
            });
            cb(null);
        }
    ], function (err) {
        if (err) {
            res.status(500).json({
                is_valid: false,
                error: 'Unknown error: ' + err.message
            });
        }
    });
});

module.exports = router;
