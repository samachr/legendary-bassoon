"use strict";

/**
 * Created by kamis on 3/5/2016.
 */

var express = require('express');
var juror_dao = require('../../data/DAO/jurymembers_dao');
var Juror = juror_dao.Juror;
var router = express.Router();

/**
 * Creates a random Juror entry with the given First Last name
 * @param firstname {string}
 * @param lastname {string}
 * @returns {Juror}
 */
var createRandomJuror = function (firstname, lastname) {
    var randomAddress1 = [
        "103 Edgewood Avenue",
        "4447 Confederate Drive",
        "2625 Simpson Street",
        "4802 Butternut Lane",
        "2654 Buckhannan Avenue",
        "1176 Hart Country Lane",
        "1253 Melody Lane",
        "3043 Gorby Lane"
    ];
    var randomAddress2 = [
        "Cicero, NY 13039",
        "Little York, IL 61453",
        "Breese, IL 62230",
        "Syracuse, NY 13202",
        "Appling, GA 30802",
        "Richmond, VA 23220",
        "Jackson, MS 39201",
        "Fresno, CA 93721"
    ];
    var randomPhoneNumbers = [
        "903-388-4065",
        "907-943-5083",
        "832-558-7689",
        "361-331-4809",
        "612-877-4529",
        "804-954-3051",
        "412-665-4666",
        "832-593-2084"
    ];
    var randomDeferCounts = [
        0, 1, 2, 3, 4, 5, 6
    ];

    var getRandomFrom = function (a) {
        return a[parseInt(Math.random() * a.length)];
    };

    var randBool = function () {
        return Math.random() > 0.5;
    };

    return new Juror(
        0,
        firstname, lastname, getRandomFrom(randomAddress1),
        getRandomFrom(randomAddress2), getRandomFrom(randomPhoneNumbers),
        firstname + '.' + lastname + '@gmail.com',
        randBool(), randBool(), randBool(), randBool(),
        'new',
        getRandomFrom(randomDeferCounts),
        '', []
    );
};

router.post('/juror', function (req, res) {
    if (!req.body || !req.body['name_first'] || !req.body['name_last']) {
        res.status(400).json({
            is_valid: false,
            error: 'Invalid POST parameters: Requires name_first, name_last'
        });
        return;
    }

    /**
     * @type {Juror}
     */
    var newJuror = createRandomJuror(req.body['name_first'], req.body['name_last']);

    juror_dao.saveNewJuror(
        newJuror.firstName, newJuror.lastName,
        newJuror.address1, newJuror.address2,
        newJuror.phone, newJuror.email, newJuror.canText,
        newJuror.receiveCall, newJuror.receiveEmail,
        newJuror.receiveText, newJuror.deferCount,
        function (error) {
            if (error) {
                res.status(500).json({
                    is_valid: false,
                    error: 'Unknown error: ' + error.message
                });
            } else {
                res.status(200).json({
                    is_valid: true,
                    new_juror: newJuror
                });
            }
        }
    );
});

module.exports = router;