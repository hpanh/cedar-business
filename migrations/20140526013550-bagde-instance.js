var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `badgeInstance` ("
            + "`id`               BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "`userId`           BIGINT NOT NULL,"
            + "`issuedOn`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"
            + "`bagdeSlug`        VARCHAR(225) NOT NULL,"
            + "`bagdeName`        VARCHAR(225) NOT NULL,"
            + "`bagdeImageUrl`    VARCHAR(225) NOT NULL,"
            + "`issuer`           VARCHAR(225) NOT NULL,"
            + "FOREIGN KEY (userId) REFERENCES cedar_users(id)"
            + ") ENGINE=InnoDB;")
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `badgeinstance`;"),
        ], callback);
};
