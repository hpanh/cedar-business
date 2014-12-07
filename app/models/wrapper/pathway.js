const Pathway = require('../pathway')('DATABASE');
const PathwayCategory = require('../pathwayCategory')('DATABASE');
const PathwayBadge = require('../pathwayBadge')('DATABASE');
const PathwayInstance = require('../pathwayInstance')('DATABASE');
const PathwayPerformance = require('../pathwayPerformance')('DATABASE');
const BadgeInstance = require('../badgeInstance')('DATABASE');
const _ = require('underscore');
const async = require('async');
const badgekitClient = require('../../lib/badgekit-client');
const config = require('../../lib/config');
const DEFAULT_LIMIT = 15;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT = { Created: 'desc' };

var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//Get Pathway information not include badge relationship
/*Simple pathway {
    id: 1,
    name: 'webdev',
    description: 'pathway for webdev',
    type: 'disorder' | 'order',
    picture: 'http://lorempixel.com/500/500',
    systemSlug: 'toxbadge',
    issuerSlug: 'toxbadge',
    programSlug: NULL,
    created: '1970-01-01 00:00:01',
    lastUpdated: '1970-01-01 00:00:01',
    pathwayCategoryId: 5,
    category: {
        id: 5,
        name: 'web developer',
        description: 'web developer description'
    }
}*/
exports.getPathwayBySlug = function getPathwayBySlug(slug, callback) {
    if (!slug || typeof slug == 'function') {
        var err = new Error("`slug` is null or undefined");
        return callback(err);
    };

    Pathway.getOne({slug: slug}, {relationships: ['category']}, function (err, pathway) {
        return callback(err, pathway);
    });
}

//Get Pathway information with badge relationship
/*Detail pathway {
    id: 1,
    name: 'webdev',
    description: 'pathway for webdev',
    type: 'disorder' | 'order',
    picture: 'http://lorempixel.com/500/500',
    systemSlug: 'toxbadge',
    issuerSlug: 'toxbadge',
    programSlug: NULL,
    created: '1970-01-01 00:00:01',
    lastUpdated: '1970-01-01 00:00:01',
    pathwayCategoryId: 5,
    category: {
        id: 5,
        name: 'web developer',
        description: 'web developer description'
    },
    badges: [
        {
            {cedar badge standard properties}
            ...
            group: 0, // properties from pathway
            level: 1,
            parent: [1, 2, 3] //badge slug of parent badge, not the id
            children: [4, 5] //badge slug of children badge
        }
    ]
}*/
exports.getPathwayDetail = function getPathwayDetail(slug, callback) {
    if (!slug || typeof slug == 'function') {
        var err = new Error("`slug` is null or undefined");
        return callback(err);
    };

    Pathway.getOne({slug: slug}, {relationships: ['category', 'badges']}, function (err, pathway) {
        //Shallow copy array
        var copyPathwayBadges = pathway.badges.slice();
        var pathwayBadges = constructBadgeTree(null, copyPathwayBadges, []);
        getBadgekitBadges(pathwayBadges, function (err, badgekitBadges) {
            if (err) {
                return callback(err);
            };

            pathway.badges = badgekitBadges;
            return callback(err, pathway);
        });
    });
}

//Get a list of Pathways
/*[
    {simple pathway object},
    {simple pathway object},
    ...
]*/
exports.getPathways = function getPathways(options, callback){
    if (typeof options == 'function') {
        callback = options;
        options = {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sort: DEFAULT_SORT
        }
    };

    options.relationships = ['category'];

    Pathway.getAll(options, function (err, pathways) {
        return callback(err, pathways);
    });
}


//getPathwayPerformance receive pathway slug and return performance numbers of pathway.
/*Simple pathway {
    id: 1,
    name: 'webdev',
    description: 'pathway for webdev',
    type: 'disorder' | 'order',
    picture: 'http://lorempixel.com/500/500',
    systemSlug: 'toxbadge',
    issuerSlug: 'toxbadge',
    programSlug: NULL,
    created: '1970-01-01 00:00:01',
    lastUpdated: '1970-01-01 00:00:01',
    pathwayCategoryId: 5,
    category: {
        id: 5,
        name: 'web developer',
        description: 'web developer description'
    },
    performance: {
        id: 1
        badgeCount: 4,
        followerCount: 0,
        viewCount: 0,
        dropCount: 0,
        inprogressCount: 0,
        completedCount: 0,
        shareCount: 0,
        created: '1970-01-01 00:00:01',
        lastUpdated: '1970-01-01 00:00:01',
    }
}*/
exports.getPathwayPerformance = function getPathwayPerformance(slug, callback) {
    if (!slug || typeof slug == 'function') {
        var err = new Error("`slug` is null or undefined");
        return callback(err);
    };

    Pathway.getOne({slug: slug}, {relationships: ['category', 'performance']}, function (err, pathway) {
        //Shallow copy array
        return callback(err, pathway);
    });
}

//Get brief information of badge instance
/*Simple pathwayInstance {
    id: 1,
    userId: '0ad0s1a',
    slug: 'webdevinstance',
    pathwayId: 1,
    pathway: {
        //simple pathway object
    }
    completedBadgeCount: 0,
    status: 'in-progress' | 'dropped' | 'completed',
    created: '1970-01-01 00:00:01',
    lastUpdated: '1970-01-01 00:00:01',
}*/
exports.getPathwayInstance = function getPathwayInstance(slug, callback) {
    if (!slug || typeof slug == 'function') {
        var err = new Error("`slug` is null or undefined");
        return callback(err);
    };

    //Use sql raw to get Pathwayinstance. It helps to get Pathwayinstance with only Pathway and Pathwaycategory.
    //Build-in method will get all information include information of Pathwaybadge, which we don't need that.
    PathwayInstance.get(['SELECT * FROM $table '
                        + 'JOIN `pathway` ON pathwayId = pathway.id '
                        + 'JOIN `pathwayCategory` ON pathway.pathwayCategoryId = pathwayCategory.id '
                        + 'WHERE pathwayInstance.slug=?', [slug]], function (err, pathwayInstance) {
        return callback(err, pathwayInstance);
    })
}

//Get Pathwayinstance by Pathwayinstance's slug
//Data contain Pathway information and Pathway instance information (which badge is completed and which is not).
/*Simple pathwayInstance {
    id: 1,
    userId: '0ad0s1a',
    slug: 'webdevinstance',
    pathwayId: 1,
    pathway: {
        id: 1,
        name: 'webdev',
        description: 'pathway for webdev',
        type: 'disorder' | 'order',
        picture: 'http://lorempixel.com/500/500',
        systemSlug: 'toxbadge',
        issuerSlug: 'toxbadge',
        programSlug: NULL,
        created: '1970-01-01 00:00:01',
        lastUpdated: '1970-01-01 00:00:01',
        pathwayCategoryId: 5,
        category: {
            id: 5,
            name: 'web developer',
            description: 'web developer description'
        },
        badges: [
            {
                {cedar badge standard properties}
                ...
                group: 0, // properties from pathway
                level: 1,
                parent: [1, 2, 3], //badge slug of parent badge, not the id
                children: [4, 5], //badge slug of children badge
                completed: true | false //this doesn't exist in pathway detail
            },
            ...
        ]
    }
    completedBadgeCount: 0,
    status: 'in-progress' | 'dropped' | 'completed',
    created: '1970-01-01 00:00:01',
    lastUpdated: '1970-01-01 00:00:01',
}*/

exports.getPathwayInstanceDetail = function getPathwayInstanceDetail(slug, userId, callback) {
    if (!slug || typeof slug == 'function') {
        var err = new Error("`slug` is null or undefined");
        return callback(err);
    };

    Pathway.getOne({slug: slug}, {relationships: ['pathway'], relationshipsDepth: true}, function (err, pathway) {
        var copyPathwayBadges = pathway.badges.slice();
        var pathwayBadges = constructBadgeTree(null, copyPathwayBadges, []);

        getBadgekitBadges(pathwayBadges, function (err, badgekitBadges) {
            BadgeInstance.get({userId: userId}, function (err, badgeInstances) {
                badgekitBadges.forEach(function (badgekitBadge) {
                    badgekitBadge.completed = false;
                    for (var j = 0; j < badgeInstances.length; ++j) {
                        if (badgekitBadge.slug == badgeInstances[j].badgeSlug) {
                            badgekitBadge.completed = true;
                        };
                    };
                });
                pathway.badges = badgekitBadges;
                return callback(err, pathway);
            });
        });
    });
}

//Get a list of Pathwayinstances of a user
/*pathwayInstances [
    {simple pathwayInstance object},
    {simple pathwayInstance object},
    {simple pathwayInstance object}
    ...
]
*/
exports.getPathwayInstances = function getPathwayInstances(userId, callback) {
    if (!userId || typeof userId == 'function') {
        var err = new Error("`userId` is null or undefined");
        return callback(err);
    };

    PathwayInstance.get(['SELECT * FROM $table '
                        + 'JOIN `pathway` ON pathwayId = pathway.id '
                        + 'JOIN `pathwayCategory` ON pathway.pathwayCategoryId = pathwayCategory.id '
                        + 'WHERE pathwayInstance.userId=?', [userId]], function (err, pathwayInstance) {
        return callback(err, pathwayInstance);
    });
}

exports.createPathway = function createPathway(pathway, callback) {
    var pathwayBadges = _.clone(pathway.pathwayBadges);
    if (!_.isArray(pathwayBadges)) {
        pathwayBadges = [pathwayBadges];
    };
    delete pathway.pathwayBadges;

    var randomSlug = _.sample(possibleChar, 7).join('');
    pathway.slug = pathway.slug || randomSlug;

    async.series([
        function(innerCallback) {
            Pathway.put(pathway, function(err, result) {
                pathway.id = result.insertId;
                return innerCallback();
            })
        },
        function(innerCallback) {
            async.each(pathwayBadges, function(pathwayBadge, innerCallback) {
                pathwayBadge.pathwayId = pathway.id;
                PathwayBadge.put(pathwayBadge, function(err, result) {
                    pathwayBadge.id = result.insertId;
                    return innerCallback(err, result);
                });
            }, function(err) {
                return innerCallback();
            });
        }],
        function(err) {
            pathway.pathwayBadges = pathwayBadges;
            return callback(err, pathway);
        }
    )
}

exports.updatePathway = function updatePathway(pathway, callback) {
    Pathway.put(pathway, function(err, result) {
        return callback(err, result);
    })
}

exports.deletePathway = function deletePathway(pathwaySlug, callback) {
    Pathway.getOne({slug: pathwaySlug}, function(err, pathway) {
        async.series([
            function(innerCallback) {
                PathwayBadge.del({pathwayId: pathway.id}, function(err, result) {
                    innerCallback(err, result);
                });
            },
            function(innerCallback) {
                Pathway.del({slug: pathwaySlug}, function(err, result) {
                    innerCallback(err, result);
                })
            }],
            function(err) {
                return callback(err);
            })
    });
}

exports.getPathwayCategory = function getPathwayCategory(callback) {
    PathwayCategory.get(function(err, categories) {
        return callback(err, categories);
    });
}

//The originalArray is the array of badges retrieve from pathwayBadge.
//It contain parentId which we need to convert these object into simple objects.
//The function start with looping through the originalArray to find badges that have parentId equal badgeSlug
//If the resultArray is empty we will convert these badges into simple badges and add to resultArray.
//If the resultArray is not empty we need to do 2 step:
//Step 1: find the parent badges, if exist, update the badges earlier as children of these parent badges.
//Step 2: find earlier badges in the resultArray, if exist, this mean, these badges have multiple parents
//(2 rows in database with different parentId) and therefore it appear again. We only need to update the parents
//of these badges with parentBadgeSlug or badgeSlug and end.

//This is a recursive function, badgeSlug start with NULL, which will find from root.
//resultArray also start with empty, as the function go deeper, the resultArray will be added with new element.

/* originalArray is from pathway.badges [
    {
        id: 1,
        badgeSlug: '23asd24m5',
        parentBadgeSlug: '39jdjah4s',
        group: 0,
        level: 0,
        pathwayId: 1
    },
    {...}
]
*/

/* resultArray [
    {
        badgeSlug: 'asd2d4f',
        parent: ['223sa', 'asd'],
        children: ['axb'],
        group: 0,
        level: 1,
        completed: false //`completed` is always false because it will be determined later
    },
    {...}
]
 */
function constructBadgeTree(badgeSlug, originalArray, resultArray) {
    for (var i = 0; i < originalArray.length; ++i) {
        if (originalArray[i].parentBadgeSlug === badgeSlug) {

            //Find parent badges in resultArray
            for (var j = 0; j < resultArray.length; ++j) {
                if (badgeSlug && resultArray[j].badgeSlug === badgeSlug) {
                    //Update children for parent
                    resultArray[j].children.push(originalArray[i].badgeSlug);
                }
            }

            //Check if the badge is added to resultArray
            for (var j = 0; j < resultArray.length; ++j) {
                //If exist, the badge has multiple parents
                if(resultArray[j].badgeSlug === originalArray[i].badgeSlug) {
                    //Update parents for the badge
                    resultArray[j].parent.push(badgeSlug);
                    //Remove the badge.
                    originalArray.splice(i, 1);
                    return resultArray;
                }
            };

            //Define a simple object to contain badge information and pathway relationship
            var obj = {
                id: originalArray[i].id,
                badgeSlug: originalArray[i].badgeSlug,
                parent: !badgeSlug ? [] : [badgeSlug],
                children: [],
                completed: false,
                group: originalArray[i].group,
                level: originalArray[i].level,
            }
            resultArray.push(obj);
            originalArray.splice(i, 1); //remove the obj from array
            --i;
            constructBadgeTree(obj.badgeSlug, originalArray, resultArray);
        }
    };

    return resultArray;
}

//Merge pathwayBadge and badge into one obj
//pathwayBadge contains information about badge relationship.
//It will add group, level, children, parent and completed from pathway to original badge
function toPathwayBadge(pathwayBadge, badge) {

    if (pathwayBadge.completed) {
        badge.completed = pathwayBadge.completed;
    };

    badge.id = pathwayBadge.id;
    badge.group = pathwayBadge.group;
    badge.level = pathwayBadge.level;
    badge.children = pathwayBadge.children;
    badge.parent = pathwayBadge.parent;

    return badge;
}


function getBadgekitBadges(pathwayBadges, callback){
    var badges = [];
    async.each(pathwayBadges, function(pathwayBadge, innerCallback) {
        badgekitClient.getBadge({
            system: config('SYSTEM'),
            badge: {slug: pathwayBadge.badgeSlug}
        }, function (err, badge) {
            if (err) {
                return innerCallback(err);
            };

            badge = badgekitClient.toCedarBadge(badge);
            badges = badges.concat(toPathwayBadge(pathwayBadge, badge));

            return innerCallback();
        });
    },
    function (err) {
        return callback(err, badges);
    });
}
