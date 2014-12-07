var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
    async.series([
        db.runSql.bind(db,
            "ALTER TABLE `promotion` ADD INDEX  promotion_slug (slug);"
        ),
        db.runSql.bind(db,
            "ALTER TABLE `scheduleCalendar` "
            + "ADD INDEX scheduleCalendar_fromDate (fromDate),"
            + "ADD INDEX scheduleCalendar_toDate (toDate);")
        ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.runSql.bind(db, "DROP INDEX scheduleCalendar_fromDate on `scheduleCalendar`;"),
        db.runSql.bind(db, "DROP INDEX scheduleCalendar_toDate on `scheduleCalendar`;"),
        db.runSql.bind(db, "DROP INDEX promotion_slug on `promotion`;")
        ], callback);
};
