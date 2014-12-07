var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `userPerformance` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "userId                 BIGINT NOT NULL,"
            + "applyCount             BIGINT default 0,"
            + "badgeInstanceCount     BIGINT default 0,"
            + "FOREIGN KEY (userId) REFERENCES cedar_users(id)"
            + ") ENGINE=InnoDB;")
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `userPerformance`;"),
        ], callback);
};
