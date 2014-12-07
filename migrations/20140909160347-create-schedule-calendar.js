var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `scheduleCalendar` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "promotionId            BIGINT NOT NULL,"
            + "dateOfWeek             VARCHAR(100) NULL DEFAULT NULL,"
            + "fromDate               TIMESTAMP NULL DEFAULT NULL,"
            + "toDate                 TIMESTAMP NULL DEFAULT NULL,"
            + "deleted                TIMESTAMP NULL DEFAULT NULL,"
            + "CONSTRAINT `promotion_scheduleCalendar` FOREIGN KEY (promotionId) REFERENCES promotion(id)"
            + ") ENGINE=InnoDB  DEFAULT CHARSET=utf8;")
        ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `scheduleCalendar`;"),
    ], callback);
};
