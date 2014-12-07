const _pathway = require('../app/models/wrapper/pathway');
const should = require('should');
const _ = require('underscore');

var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

describe('Pathway', function() {
    var randomSlug = _.sample(possibleChar, 7).join('');
    var testPathway = {
        slug: randomSlug,
        name: 'IT Pathway',
        description: 'Wonderful things about IT',
        type: 'disorder',
        picture: 'http://lorempixel.com',
        pathwayCategoryId: 1,
        totalBadge: 0,
        systemSlug: '12',
        pathwayBadges: [
            {
                badgeSlug: 'asdasd',
                parentBadgeSlug: 'asddas'
            },
            {
                badgeSlug: '12asdasd',
                parentBadgeSlug: 'asddas'
            },
            {
                badgeSlug: 'as232dasd',
                parentBadgeSlug: 'asddas'
            }
        ]
    }

    it('can create', function(done) {
        _pathway.createPathway(testPathway, function(err, pathway) {
            should.not.exist(err);

            _pathway.getPathwayDetail(testPathway.slug, function(err, innerPathway) {
                should.not.exist(err);
                innerPathway.name.should.equal(testPathway.name);
                innerPathway.description.should.equal(testPathway.description);
                innerPathway.picture.should.equal(testPathway.picture);
                done();
            })
        });
    })

    it('can get', function(done) {
        _pathway.getPathwayDetail(testPathway.slug, function(err, innerPathway) {
            should.not.exist(err);
            innerPathway.name.should.equal(testPathway.name);
            innerPathway.description.should.equal(testPathway.description);
            innerPathway.picture.should.equal(testPathway.picture);
            done();
        })
    })

    it('can get pathway category', function(done) {
        _pathway.getPathwayCategory(function(err, categories) {
            should.not.exist(err);
            categories.should.have.length(10);
            categories[0].name.should.equal('IT consultant');
            done();
        });
    })

    it('can delete', function(done) {
        _pathway.deletePathway(testPathway.slug, function(err, pathway) {
            should.not.exist(err);
            done();
        });
    })
})