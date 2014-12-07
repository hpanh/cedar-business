var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` CHANGE `bagdeSlug` `badgeSlug` VARCHAR(225)"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` CHANGE `bagdeName` `badgeName` VARCHAR(225)"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` CHANGE `bagdeImageUrl` `badgeImageUrl` VARCHAR(225)"
            ),
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` CHANGE `badgeSlug` `bagdeSlug` VARCHAR(225)"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` CHANGE `badgeName` `bagdeName` VARCHAR(225)"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` CHANGE `badgeImageUrl` `bagdeImageUrl` VARCHAR(225)"
            ),
        ], callback);
};
