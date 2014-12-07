const interviewInstances = require('../app/questionaire').interviewInstances;
const should = require('should');
const _ = require('underscore');

describe('Quesionare Instance API', function() {
    it('can get instance by slug', function(done) {
        interviewInstances.getInstanceBySlug('74b924a0-5d8d-11e4-b491-b9aa87b2ada7', function (err, instance) {
            should.not.exist(err);
            instance.should.not.empty;
            done();
        })
    })

    it('should get null when slug is empty', function(done) {
        interviewInstances.getInstanceBySlug('', function (err, instance) {
            should.not.exist(err);
            should.not.exist(instance);
            done();
        })
    })

    it('can get instance by email', function(done) {
        interviewInstances.getInstanceBySlug('caodunganh@gmail.com', function (err, instance) {
            should.not.exist(err);
            instance.should.not.empty;
            done();
        })
    })

    it('can get instances with limit 5 and page 1', function(done) {
        var option = {
            limit: 5,
            page: 1
        }

        interviewInstances.getInstances(option, function (err, result) {
            debugger;
            should.not.exist(err);
            result.instances.length.should.equal(5);
            done();
        })
    })

    it('can get many instances', function(done) {
        interviewInstances.getInstances(function (err, result) {
            should.not.exist(err);
            result.instances.length.should.above(5);
            done();
        })
    })
})