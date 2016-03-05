"use strict";

/**
 * Created by kamis on 3/4/2016.
 *
 * Utility methods for use in DAO objects.
 */

var parseJSON = function (text, cb) {
    try {
        cb(null, JSON.parse(text));
    } catch (e) {
        cb(e);
    }
};

exports.parseJSON = parseJSON;