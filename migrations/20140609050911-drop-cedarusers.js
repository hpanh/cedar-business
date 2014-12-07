var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "ALTER TABLE `badgeInstance` DROP FOREIGN KEY `badgeinstance_ibfk_1`"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `userPerformance` DROP FOREIGN KEY `userperformance_ibfk_1`"
            ),
        db.runSql.bind(db,
            "DROP TABLE `cedar_users`"
            )
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `cedar_users` ("
            + "`id` BIGINT        AUTO_INCREMENT PRIMARY KEY,"
            + "`externalId`       VARCHAR(50) NULL,"
            + "`personaId`        BIGINT NULL,"
            + "`email`            VARCHAR(100),"
            + "`password`         VARCHAR(100) NULL,"
            + "`avatarUrl`        TEXT NULL,"
            + "`name`             VARCHAR(100) NULL"
            + ") ENGINE=InnoDB;"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `userPerformance` "
            + "ADD CONSTRAINT `userperformance_ibfk_1` "
            + "FOREIGN KEY (`userId`) REFERENCES `cedar_users` (`id`);"
            ),
        db.runSql.bind(db,
            "ALTER TABLE `badgeInstance` "
            + "ADD CONSTRAINT `badgeinstance_ibfk_1` "
            + "FOREIGN KEY (`userId`) REFERENCES `cedar_users` (`id`);"
            ),
        ], callback);
};
