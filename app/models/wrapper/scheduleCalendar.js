const ScheduleCalendar = require('../scheduleCalendar')('DATABASE');
const Promotion = require('../promotion')('DATABASE');
const getDb = require('../../lib/db').getDb;
const async = require('async');
const db = getDb('DATABASE');

exports.createScheduleCalendar = function createScheduleCalendar(data, callback) {
    Promotion.getOne({slug: data.slug}, function(err, promotion) {
        if (err) {
            return callback(err);
        }

        scheduleCalendar = { promotionId: promotion.id };

        if (data.type === 'dateOfWeek') {
            scheduleCalendar.dateOfWeek = data.dateOfWeek;
        } else {
            scheduleCalendar.fromDate  = data.fromDate;
            scheduleCalendar.toDate  = data.toDate;
        }

        ScheduleCalendar.put(scheduleCalendar, function(err, newScheduleCalendar){
            if (err) {
                return callback(err);
            }

            return callback(null, newScheduleCalendar);
        });
    });
}

exports.getCurrentScheduleCalendar = function getCurrentScheduleCalendar(callback) {
    var dateOfWeek = new Date().getDay();
    var validScheduleList = [];

    db.query('SELECT * FROM scheduleCalendar WHERE fromDate <= NOW() and toDate >= NOW() and deleted IS NULL;', function(err, resultFromToDate) {
        if (err) {
            return callback(err);
        }

        validScheduleList = validScheduleList.concat(resultFromToDate);

        db.query('SELECT * FROM scheduleCalendar WHERE dateOfWeek LIKE "%' + dateOfWeek + '%" and deleted IS NULL;', function(err, resultDateOfWeek) {
            if (err) {
                return callback(err);
            }

            validScheduleList = validScheduleList.concat(resultDateOfWeek);
            return callback(null, validScheduleList);
        });
    });
};
