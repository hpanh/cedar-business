var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `badgePerformance` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "badgeSlug              VARCHAR(225) NOT NULL,"
            + "earnerCount            BIGINT default 0,"
            + "applyCount             BIGINT default 0,"
            + "shareCount             BIGINT default 0,"
            + "viewCount              BIGINT default 0"
            + ") ENGINE=InnoDB;")
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `badgePerformance`;"),
        ], callback);
};