var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
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
            + ") ENGINE=InnoDB;")
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `cedar_users`;"),
        ], callback);
};
