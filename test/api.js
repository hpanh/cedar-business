const assert = require('assert');
const should = require('should');
const request = require('request');
const config = require('./config');
const _ = require('underscore');

describe('Badges api', function(){
    var testUrl = config.CEDAR_WEBSITE + '/api/badges';
    const testOptions = {
        url: testUrl,
        method: 'GET',
        json: true,
    }

    it('can get a list of badges', function(done) {
        request(testOptions, function(err, response, badges) {
            should.not.exist(err);
            badges.length.should.be.above(0);
            done();
        })
    });

    it('can get badges with limit and page', function(done) {
        var options = {
            qs: {
                limit: 5,
                page: 2,
            }
        }
        options = _.extend(testOptions, options);

        request(options, function(err, response, badges) {
            should.not.exist(err);
            badges.should.have.length(5);
            done();
        })
    });

    it('can get all badges', function(done) {
        var options = {
            qs: {
                limit: -1,
                page: -1,
            }
        }
        options = _.extend(testOptions, options);

        request(options, function(err, response, badges) {
            should.not.exist(err);
            badges.length.should.above(20);
            done();
        })
    });

    it('can get a badge with badgeSlug', function(done) {
        var url = testUrl + '/best-shot-of-the-month';
        var options = _.extend(testOptions, {url: url});

        request(options, function(err, response, badge) {
            should.not.exist(err);
            done();
        })
    });

    it('receive 500 when getting a unexist badge', function(done) {
        var url = testUrl + '/asdsad';
        var options = _.extend(testOptions, {url: url});

        request(options, function(err, response, badge) {
            should.not.exist(err);
            response.statusCode.should.equal(500);
            done();
        })
    });
})

describe('Issuer Api', function() {
    var testUrl = config.CEDAR_WEBSITE + '/api/issuers';
    const testOptions = {
        url: testUrl,
        method: 'GET',
        json: true
    }

    it('can get a list of issuers', function(done) {
        request(testOptions, function(err, response, issuers) {
            should.not.exist(err);
            response.statusCode.should.equal(200);
            done();
        });
    });

    it('can get all issuers', function(done) {
        var options = {
            qs: {
                limit: -1,
                page: -1
            }
        }

        var options = _.extend(testOptions, options);

        request(options, function(err, response, issuers) {
            should.not.exist(err);
            response.statusCode.should.equal(200);

            issuers.should.have.length(5);
            done();
        })
    });

    it('can get issuers with limit and page', function(done) {
        var options = {
            qs: {
                limit: 2,
                page: 1
            }
        }

        var options = _.extend(testOptions, options);

        request(options, function(err, response, issuers) {
            should.not.exist(err);
            response.statusCode.should.equal(200);

            issuers.should.have.length(2);
            done();
        })
    });
});

describe('User api', function() {
    var testUrl = config.CEDAR_WEBSITE + '/api/users';
    const testOptions = {
        url: testUrl,
        method: 'GET',
        json: true
    }

    it('can get users', function(done) {
        request(testOptions, function(err, response, users) {
            should.not.exist(err);
            users.length.should.be.above(0);
            users.length.should.be.above(39);
            done();
        })
    })

    it('can get users with limit', function(done) {
        var options = {
            qs: {
                limit: 50,
                page: 1
            }
        }

        var options = _.extend(testOptions, options);
        request(options, function(err, response, users) {
            should.not.exist(err);
            users.length.should.be.above(0);
            users.length.should.be.above(40);
            done();
        })
    })

    it('can get all users', function(done) {
        var options = {
            qs: {
                limit: 50,
                page: -1
            }
        }

        var options = _.extend(testOptions, options);
        request(options, function(err, response, users) {
            should.not.exist(err);
            users.length.should.be.above(0);
            users.length.should.be.above(40);
            done();
        })
    })
})