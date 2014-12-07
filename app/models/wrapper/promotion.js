const Promotion = require('../promotion')('DATABASE');
const ScheduleCalendarWrapper = require('./scheduleCalendar');
const async = require('async');

exports.createPromotion = function createPromotion(promotion, callback) {
    Promotion.put(promotion, function(err, newPromotion){
        if (err) {
            return callback(err);
        }

        return callback(null, newPromotion);
    });
};

exports.getCurrentPromotions = function getCurrentPromotions(callback) {
    var promotionList = [];
    ScheduleCalendarWrapper.getCurrentScheduleCalendar(function(err, list) {
        if (err) {
            return callback(err);
        }

        list.forEach(function(schedule, index) {
            Promotion.getOne({id: schedule.promotionId, status: "active"}, function(err, promotion) {
                if (err) {
                    return callback(err);
                }

                if (promotion !== undefined) {
                    promotionList.push(promotion);
                }
            });
        });

        promotionList = promotionList.sort(function(obj1, obj2) {
            return obj2.weight - obj1.weight;
        });

        return callback(null, promotionList);
    });
}

exports.getPromotionBySlug = function getPromotionBySlug(slug, callback) {
    Promotion.getOne({slug: slug}, function(err, promotion) {
        if (err) {
            return callback(err);
        }

        ScheduleCalendar.getOne({promotionId: promotion.id, deleted: null}, function(err, schedule) {
            if (err) {
                return callback(err);
            }

            var selectedPromotion = {
                id: promotion.id,
                slug: promotion.slug,
                author: promotion.author,
                weight: promotion.weight,
                imageFront: promotion.imageFront,
                imageBack: promotion.imageBack,
                content: promotion.content,
                sourceName: promotion.sourceName,
                sourceUrl: promotion.sourceUrl,
                status: promotion.status,
                backgroundColor: promotion.backgroundColor,
                dateOfWeek: schedule.dateOfWeek,
                fromDate: schedule.fromDate,
                toDate: schedule.toDate
            };

            return callback(null, selectedPromotion);
        });
    });
}
