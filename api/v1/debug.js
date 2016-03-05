"use strict";

/**
 * Created by kamis on 3/5/2016.
 */

var express = require('express');
var juror_dao = require('../../data/DAO/jurymembers_dao');
//var Juror = juror_dao.Juror;
var router = express.Router();

/**
 * Creates a random Juror entry with the given First Last name
 * @param firstname {string}
 * @param lastname {string}
 * @returns {Juror}
 */
//var createRandomJuror = function (firstname, lastname) {
//    return new Juror();
//};
//
//router.post('/juror', function (req, res) {
//    if (!req.body || !req.body['name_first'] || !req.body['name_last']) {
//        res.status(400).json({
//            is_valid: false,
//            error: 'Invalid POST parameters: Requires name_first, name_last'
//        });
//        return;
//    }
//
//    /**
//     * @type {Juror}
//     */
//    var newJuror = createRandomJuror(req.body['name_first'], req.body['name_last']);
//
//    juror_dao.saveNewJuror(
//        newJuror.firstName
//        ADDRESS1, ADDRESS2, PHONE, EMAIL, CANTEXT, RECEIVECALL,
//        RECEIVEEMAIL, RECEIVETEXT, DEFERCOUNT, function (error) {
//            if (error) {
//                res.status(500).json({
//                    is_valid: false,
//                    error: 'Unknown error: ' + error.message
//                });
//            } else {
//                res.status(200).json({
//                    is_valid: true,
//                    new_juror: 'foobar'
//                });
//            }
//        }
//    );
//});
//
module.exports = router;