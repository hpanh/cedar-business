var getDb = require('../lib/db').getDb;

module.exports = function getScheduleCalendarModel(key) {
    var db = getDb(key);
    var scheduleCalendar;

    var ScheduleCalendar = db.table('scheduleCalendar', {
        fields: ['id',
            'promotionId',//mapping with id in promotion
            'dateOfWeek',
            'fromDate',//in code, we will have to validate if a period of time were set, we'll display the promotion in that particular period of time,
            'toDate',  //if they hadn't been set, then we'll display it as a recursive promotion based on dateOfWeek
            'deleted'
        ], relationships: {
            promotion: {
                type: 'hasOne',
                local: 'promotionId',
                foreign: { table: 'promotion', key: 'id' },
                optional: false
            }
        }
    });

    return ScheduleCalendar;
};
