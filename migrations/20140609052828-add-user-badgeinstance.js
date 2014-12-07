var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` MODIFY `userId` VARCHAR(225)"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `badgeinstance` ADD ("
            + "`userName` VARCHAR(225), "
            + "`userImageUrl` VARCHAR(225), "
            + "`issuerUrl` VARCHAR(225)"
            + ");"
            ),
        db.runSql.bind(db,
        	"ALTER TABLE `userperformance` MODIFY `userId` VARCHAR(225)"
        	),
        db.runSql.bind(db,
        	"ALTER TABLE `userperformance` CHANGE `badgeInstanceCount` `badgeCount` BIGINT DEFAULT 0"
        	),
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db,
        	"ALTER TABLE `userperformance` CHANGE `badgeCount` `badgeInstanceCount` BIGINT DEFAULT 0"
        	),
        db.runSql.bind(db,
        	"ALTER TABLE `userperformance` MODIFY `userId` BIGINT;"
        	),
        db.runSql.bind(db,
        	"ALTER TABLE `badgeinstance` DROP `userName`;"
        	),
        db.runSql.bind(db,
        	"ALTER TABLE `badgeinstance` DROP `userImageUrl`;"
        	),
        db.runSql.bind(db,
        	"ALTER TABLE `badgeinstance` DROP `issuerUrl`;"
        	),
        db.runSql.bind(db,
        	"ALTER TABLE `badgeinstance` MODIFY `userId` BIGINT;"
        	),
        ], callback);
};
