var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` ADD (`userEmail` VARCHAR(225))"
            )
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` DROP `userEmail`)"
            )
        ], callback);
};
