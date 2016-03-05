"use strict";

/**
 * Endpoints for /api/v1/survey/*
 *
 * Created by kamis on 3/5/2016.
 */

var express = require('express');
var async = require('async');
var juror_dao = require('../../data/DAO/jurymembers_dao');
var survey_dao = require('../../data/DAO/survey_dao');
var SurveyResponse = survey_dao.SurveyResponse;


var router = express.Router();

router.get('/', function (req, res) {
    survey_dao.getSurveyQuestions(function (err, questionList) {
        if (err) {
            res.status(500).json({
                is_valid: false,
                error: 'Unknown error: ' + err.message
            });
        } else {
            res.status(200).json({
                is_valid: true,
                questionList: questionList
            });
        }
    });
});

router.post('/', function (req, res) {
    if (!req.body || !req.body['juror_id'] || !req.body['responses']) {
        res.status(400).json({
            is_valid: false,
            error: 'Invalid body parameters. Required parameters: juror_id (number), responses (Array.<SurveyResponse>)'
        });
        return;
    }

    async.waterfall([
        /**
         * Get survey questions
         * @param cb
         */
        function (cb) {
            survey_dao.getSurveyQuestions(cb);
        },

        /**
         * Make sure request body has responses to all survey questions
         * @param survey_questions {Array.<SurveyQuestion>}
         * @param cb {function (err: Error|null)}
         */
        function (survey_questions, cb) {
            var missingResponses = [];
            var invalidResponses = [];
            var responses;
            try {
                responses = JSON.parse(req.body['responses']);
            } catch (e) {
                cb(e);
                return;
            }
            for (var i = 0; i < survey_questions.length; i++) {
                if (!responses[survey_questions[i].questionID]) {
                    missingResponses.push(survey_questions[i].questionID);
                } else {
                    if (survey_questions[i].expectedResponseType === 'string') {
                        // Handle string case
                    } else if (survey_questions[i].expectedResponseType === 'number') {
                        // Handle number case
                        if (isNaN(parseInt(responses[survey_questions[i].questionID]))) {
                            invalidResponses.push({ 'id': survey_questions[i].questionID, 'error': 'Expected numeric parameter, received ' + responses[survey_questions[i].questionID] });
                        }
                    } else {
                        var isCorrect = false;
                        for (var j = 0; j < survey_questions[i].expectedResponseType.length; j++) {
                            if (responses[survey_questions[i].questionID] == survey_questions[i].expectedResponseType[j]) {
                                isCorrect = true;
                            }
                        }
                        if (!isCorrect) {
                            invalidResponses.push({ 'id': survey_questions[i].questionID, 'error': 'Value must be one of the following: ' + JSON.stringify(survey_questions[i].expectedResponseType) + ', received ' + responses[survey_questions[i].questionID]});
                        }

                    }
                }
            }
            if (missingResponses.length > 0 || invalidResponses.length > 0) {
                res.status(400).json({
                    is_valid: false,
                    missingResponseIDs: missingResponses,
                    invalidResponses: invalidResponses
                });
            } else {
                cb(null);
            }
        },

        /**
         * Make sure juror with given ID exists
         * @param cb {function (err: Error|null, doesExist: boolean?)}
         */
        function (cb) {
            juror_dao.doesJurorExist(req.body['juror_id'], cb);
        },

        /**
         * If the juror exists, get information
         * @param doesJurorExist {boolean}
         * @param cb {function (err: Error|null, jurorData: Juror?)}
         */
        function (doesJurorExist, cb) {
            if (!doesJurorExist) {
                res.status(200).json({
                    is_valid: false,
                    juror_id: req.body['juror_id'],
                    error: 'No juror with the given ID in database'
                });
            } else {
                juror_dao.getJurorByID(req.body['juror_id'], cb);
            }
        },

        /**
         * Update juror data, save to database
         * @param jurorData {Juror}
         * @param cb {function (err: Error|null)}
         */
        function (jurorData, cb) {
            jurorData.surveyResponses = JSON.parse(req.body['responses']);
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
                is_valid: true
            });
        }
    });
});

module.exports = router;