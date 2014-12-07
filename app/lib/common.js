//Former: utils.js

const validate = require('./validate');
const fs = require('fs');
const ParseImage = require('../Parse/image');
const async = require('async');
const _ = require('underscore');
//In byte
const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ['image/png', 'image/svg+xml', 'image/jpeg']

//Only use for saving upload file
//Return file with name, mimetype and url
exports.saveUploadImage = function saveUploadImage(uploadFileObject, callback) {
    if (validate.validateImage(uploadFileObject, MAX_SIZE, VALID_TYPES)) {
        fs.readFile(uploadFileObject.path, function(err, data) {
            if (err) {
                return callback(err);
            };

            var file;
            async.parallel([
                function (innerCallback) {
                    ParseImage.saveImage(uploadFileObject.originalname, uploadFileObject.mimetype, data.toString('base64'), function(err, resultFile) {
                        file = resultFile;
                        return innerCallback(err, file);
                    })
                },
                function (innerCallback) {
                    fs.unlink(uploadFileObject.path, function(err) {
                        return innerCallback(err);
                    })
                }],
                function (err) {
                    return callback(err, file);
                })
        })
    } else {
        var types = VALID_TYPES.join(' ');
        var err = new Error('Image is not valid. Filetype have to be one of these type: '
        + types + ' and no greater than ' + MAX_SIZE + 'byte');

        return callback(err);
    }
}

exports.randomString = function randomString(len) {
    var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    //_.sample will generate a combination of randomly charater from the possibleChar string into an array
    //join('') will join all elements of the array into a string.
    var str = _.sample(possibleChar, len).join('');

    return str;
};
