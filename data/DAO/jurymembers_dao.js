"use strict";

/**
 * Created by kamis on 3/4/2016.
 *
 * This file contains
 *   1) The definition for the jury member data objects used in memory.
 *      Any changes to what data should be held in a jury member needs to be included in this file.
*    2) The methods to access a jury member from the database. This needs to be changed once
 *      a database is actually implemented - for the purposes of this demo, we are using a JSON file
 *      located at /data/totally-a-database/JuryRegisteredMembers_Master.json
 */

var fs = require('fs');
var async = require('async');

var dbFile = './data/totally-a-database/JuryRegisteredMembers_Master.json';

/**
 * Entry for the juror tracking database
 * @param juryID {number} Globally unique identifier of this person
 * @param firstName {string} Name of the juror
 * @param lastName {string} Name of the juror
 * @param address1 {string} Top address line of juror
 * @param address2 {string} Bottom address line of juror
 * @param phone {string|null} Phone number of juror
 * @param email {string|null} Email address of juror
 * @param canText {boolean} True if juror may receive text messages on the provided phone number
 * @param receiveCall {boolean} True if the juror would like to receive updates via automated phone call
 * @param receiveEmail {boolean} True if the juror would like to receive updates via email
 * @param receiveText {boolean} True if the juror would like to receive text message updates
 * @param deferCount {number?} (optional) Number of times this juror has deferred
 * @param hasVisited {boolean?} (optional) True if juror has visited the client before, false otherwise
 * @constructor
 */
var Juror = function (
    juryID, firstName, lastName, address1, address2,
    phone, email, canText, receiveCall,
    receiveEmail, receiveText, deferCount,
    hasVisited
) {
    this.JuryID = juryID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address1 = address1;
    this.address2 = address2;

    this.phone = phone;
    this.email = email;
    this.canText = !!canText;

    this.receiveCall = !!receiveCall;
    this.receiveEmail = !!receiveEmail;
    this.receiveText = !!receiveText;

    /**
     * The number of times this particular
     * @type {number}
     */
    this.deferCount = deferCount || 0;

    this.hasVisited = !!hasVisited || false;
};

/**
 * Invokes callback with true if the juror exists, false otherwise.
 * @param juryID {number} Juror ID to check if exists
 * @param callback {function (err: Error|null, result: boolean?)}
 */
var doesJurorExist = function (juryID, callback) {
    async.waterfall([
        /**
         * Opens the file, and retrieves the text
         * @param cb {function (err: Error|null, result: string?)}
         */
        function (cb) {
            fs.readFile(dbFile, 'utf8', cb);
        },

        /**
         * Parse the JSON retrieved from the file
         * @param fileText {string}
         * @param cb {function (err: Error|null, result: object?)}
         */
        function (fileText, cb) {
            try {
                cb(null, JSON.parse(fileText));
            } catch (e) {
                cb(e);
            }
        },

        /**
         * Check to see if a juror with the given ID exists in the database
         * @param database {object}
         * @param cb {function (err: Error|null, result: boolean?)}
         */
        function (database, cb) {
            cb(null, !!database['Jurors'][juryID]);
        }
    ], callback);
};

/**
 * Get a juror entry from the database
 *  If the juror does not exist in the database, an error is returned.
 * @param juryID {number} Globally unique identifying number of juror
 * @param callback {function (err: Error|null, result: Juror?)}
 */
var getJurorByID = function (juryID, callback) {
    fs.readFile(
        dbFile,
        'utf8',
        function (fileErr, fileContents) {
            if (fileErr) {
                callback(fileErr);
                return;
            }

            try {
                var jurors = JSON.parse(fileContents)['Jurors'];
                if (jurors[juryID]){
                    callback(null, new Juror(
                        jurors[juryID]['JuryID'],
                        jurors[juryID]['firstName'],
                        jurors[juryID]['lastName'],
                        jurors[juryID]['address1'],
                        jurors[juryID]['address2'],

                        jurors[juryID]['phone'],
                        jurors[juryID]['email'],
                        jurors[juryID]['canText'],

                        jurors[juryID]['receiveCall'],
                        jurors[juryID]['receiveEmail'],
                        jurors[juryID]['receiveText'],

                        jurors[juryID]['deferCount'],
                        jurors[juryID]['hasVisited']
                    ));
                } else {
                    callback(new Error('Juror by given ID does not exist in the database!'));
                }
            } catch (e) {
                callback(e);
            }
        }
    );
};

/**
 * Create a new juror record and add it to the database, from the information given.
 * @param firstName {string} First name of the juror
 * @param lastName {string} Last name of the juror
 * @param address1 {string} Top address line of juror
 * @param address2 {string} Bottom address line of juror
 * @param phone {string|null} Phone number of juror
 * @param email {string|null} Email address of juror
 * @param canText {boolean} True if juror may receive text messages on the provided phone number
 * @param receiveCall {boolean} True if the juror would like to receive updates via automated phone call
 * @param receiveEmail {boolean} True if the juror would like to receive updates via email
 * @param receiveText {boolean} True if the juror would like to receive text message updates
 * @param deferCount {number} Number of times this juror has deferred
 * @param callback {function (err: Error|null)} Callback method to invoke on completion of request
 */
var saveNewJuror = function (
    firstName, lastName, address1, address2,
    phone, email, canText, receiveCall,
    receiveEmail, receiveText, deferCount,
    callback
) {
    async.waterfall(
        [
            // Get next juror ID from database
            function(cb) {
                fs.readFile(
                    dbFile,
                    function (fileErr, fileResult) {
                        if (fileErr) {
                            cb(fileErr);
                        } else {
                            try {
                                cb(null, JSON.parse(fileResult));
                            } catch (e) {
                                cb(e);
                            }
                        }
                    }
                );
            },

            // Create new entry, update next ID
            function (fileData, cb) {
                try {
                    fileData['Jurors'][fileData['nextUID']] = new Juror(
                        fileData['nextUID'],
                        firstName, lastName, address1, address2,
                        phone, email, canText, receiveCall,
                        receiveEmail, receiveText, deferCount
                    );
                    cb(null, fileData);
                    fileData['nextUID']++;
                } catch (e) {
                    cb(e);
                }
            },

            // Save database back to file
            function (updatedFileData, cb) {
                fs.writeFile(dbFile, JSON.stringify(updatedFileData, null, 2), function (writeErrors) {
                    if (writeErrors) {
                        cb(writeErrors);
                    } else {
                        cb();
                    }
                });
            }
        ],
        callback
    );
};

/**
 * Update the juror record with the given ID to match the information in 'newDAta'
 * @param juryID {number} Globally unique jury ID of the object to update
 * @param newData {Juror} New information for the juror with the given ID
 * @param callback {function (err: Error|null)} Callback method to invoke when finished - given an error if appropriate
 */
var updateJurorInfo = function (juryID, newData, callback) {
    async.waterfall([
        /**
         * Read in the file for use later
         * @param cb {function (err: Error|null, result: string?)}
         */
        function (cb) {
            fs.readFile(dbFile, 'utf8', cb);
        },
        /**
         * Parse the JSON file into a JavaScript object
         * @param cb {function (err: Error|null, result: object?)}
         * @param fileText {string} Text of the file, freshly read
         */
        function (fileText, cb) {
            try {
                cb(null, JSON.parse(fileText));
            } catch (e) {
                cb(e);
            }
        },
        /**
         * Update the entry in question
         * @param cb {function (err: Error|null, fileData: object?)}
         * @param fileData {object}
         */
        function (fileData, cb) {
            if (!fileData['Jurors'][juryID]) {
                cb(new Error('No juror with given JurorID - cannot update'));
            } else {
                fileData['Jurors'][juryID] = newData;
                cb(null, fileData);
            }
        },

        /**
         * Save back out to the file
         * @param cb {function (err: Error?)}
         * @param updatedFileData {object}
         */
        function (updatedFileData, cb) {
            fs.writeFile(dbFile, JSON.stringify(updatedFileData, null, 2), function (writeErrors) {
                if (writeErrors) {
                    cb(writeErrors);
                } else {
                    cb();
                }
            });
        }
    ], callback);
};

exports.Juror = Juror;
exports.getJurorByID = getJurorByID;
exports.saveNewJuror = saveNewJuror;
exports.updateJurorInfo = updateJurorInfo;
exports.doesJurorExist = doesJurorExist;
