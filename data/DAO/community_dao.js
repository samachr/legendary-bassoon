/**
 * Created by kamis on 3/4/2016.
 *
 * Purpose: Access data from community pool.
 *   Grabs relevant information for potential jury members from
 *   driver's license records, tax records, utility records, etc.
 * This is quite likely not actually important, and not used - this
 *   serves as dummy placeholder data while we do not actually have
 *   accessible data.
 */

"use strict";

var fs = require('fs');

/**
 * Member of the community - entry which will be extracted from DAO
 * @param name {string} Full name of person in question
 * @param address1 {string} Top line of physical mailing address
 * @param address2 {string} Bottom line of physical mailing address
 * @constructor
 */
var CommunityMember = function (name, address1, address2) {
    this.name = name;
    this.address1 = address1;
    this.address2 = address2;
};

/**
 * Receive a random list of community members from underlying data storage
 * @param count {number} Number of results to retrieve. For this demo, this number
 *                       must be less than the total number of community members
 * @param callback {function(error, Array.<CommunityMember>)}
 *                       Callback method to be invoked when retrieval is finished
 */
var getRandomCommunityPool = function (count, callback) {
    fs.readFile(
        './data/totally-a-database/CommunityMembers_Master.json',
        'utf8',
        function (readFileError, dbText) {
            if (readFileError) {
                callback(readFileError);
                return;
            }

            try {
                var db = JSON.parse(dbText);
                if (count > db['Community'].length) {
                    cb(new Error('Cannot retrieve a population larger than the master population - create more population entries!'));
                    return;
                }

                var copy = [];
                var i;
                for (i = 0; i < db['Community'].length; i++) {
                    copy.push(db['Community'][i]);
                }

                var toReturn = [];
                for (i = 0; i < count; i++) {
                    var next = parseInt(Math.random() * copy.length);
                    toReturn.push(new CommunityMember(copy[next]['name'], copy[next]['address1'], copy[next]['address2']));
                    copy.splice(next, 1);
                }

                callback(null, toReturn);
            } catch (e) {
                callback(e);
            }
        }
    );
};

exports.CommunityMember = CommunityMember;
exports.getRandomCommunityPool = getRandomCommunityPool;
exports.DATA_VERSION = 1;