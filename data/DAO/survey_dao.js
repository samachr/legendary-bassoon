"use strict";

/**
 * Data access object for survey questions and responses
 *
 * Created by kamis on 3/5/2016.
 */

/**
 * Contains information for a qualifying survey question
 * @param questionID {number} Unique ID of this survey question
 * @param questionText {string} Prompt text
 * @param expectedResponseType {string|Array.<string>} The string 'string', 'number', or an array
 *                              of strings representing the possible response values
 * @constructor
 */
var SurveyQuestion = function (questionID, questionText, expectedResponseType) {
    this.questionID = questionID;
    this.questionText = questionText;
    this.expectedResponseType = expectedResponseType;
};

/**
 * Key-value pair of ID of question, value of response
 * @param questionID {number} Unique ID of this survey question
 * @param responseValue {string|number} Value of the response
 * @constructor
 */
var SurveyResponse = function (questionID, responseValue) {
    this.questionID = questionID;
    this.responseValue = responseValue;
};

/**
 * Survey questions used for the development version of the site
 * @type {Array.<SurveyQuestion>}
 */
var DevSurvey = [
    new SurveyQuestion(0, 'What is your age?', ['Under 18', '18-70', '70+']),
    new SurveyQuestion(1, 'Are you a U.S. citizen?', ['Yes', 'No']),
    new SurveyQuestion(2, 'Is the address listed correct?', ['Yes', 'No']),
    new SurveyQuestion(3, 'Do you have any family members serving as police officers?', ['Yes', 'No']),
    new SurveyQuestion(4, 'Do you understand English?', ['Yes', 'No']),
    new SurveyQuestion(5, 'Do you speak English?', ['Yes', 'No']),
    new SurveyQuestion(6, 'Do you have a felony conviction?', ['Yes', 'No'])
];

/**
 * Get a list of the required survey questions
 * @param cb {function (err: Error|null, response: Array.<SurveyQuestion>?)}
 */
var getSurveyQuestions = function (cb) {
    // Simulate asynchronous call
    setTimeout(function () {
        cb(null, DevSurvey);
    }, 0);
};

exports.SurveyQuestion = SurveyQuestion;
exports.SurveyResponse = SurveyResponse;
exports.getSurveyQuestions = getSurveyQuestions;