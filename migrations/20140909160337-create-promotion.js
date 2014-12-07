var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `promotion` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "slug                   VARCHAR(100) NOT NULL UNIQUE,"
            + "author                 VARCHAR(255) NULL,"
            + "weight                 INT default 0,"
            + "imageFront             VARCHAR(1000) NOT NULL,"
            + "imageBack              VARCHAR(1000) NULL,"
            + "content                VARCHAR(255) NOT NULL,"
            + "sourceName             VARCHAR(255) NOT NULL,"
            + "sourceUrl              VARCHAR(255) NOT NULL,"
            + "status                 VARCHAR(20) NOT NULL,"
            + "createdTime            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastUpdated            TIMESTAMP NULL,"
            + "backgroundColor        VARCHAR(10) NOT NULL"
            + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;")
        ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `promotion`;"),
    ], callback);
};
