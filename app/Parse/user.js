const Parse = require('./base').getInstance();
const async = require('async');
const badgekitClient = require('../lib/badgekit-client');
const Profile = Parse.Object.extend("Profile");
const _ = require('underscore');

exports.currentUser = function currentUser() {
    return Parse.User.current();
}

exports.login = function login(username, password, callback) {
    Parse.User.logIn(username, password, {
        success: function (user) {
            if (!user) {
                return callback();
            };

            getProfile(user, function (err, user) {
                return callback(err, toCedarUser(user));
            });
        },
        error: function (user, err) {
            return callback(err);
        }
    });
}

exports.loginFacebook = function loginFacebook(facebookId, callback) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('facebookId', facebookId);
    query.first({
        success: function(user) {
            if (!user) {
                return callback();
            };

            getProfile(user, function (err, user) {
                return callback(err, toCedarUser(user));
            });
        },
        error: function(user, err) {
            return callback(err);
        }
    })
};

exports.loginEmail = function loginEmail(email, password, callback) {
    email = email.toLowerCase();
    var query = new Parse.Query(Parse.User);
    query.include("profile");
    query.equalTo("email", email);
    query.first({
        success: function (user) {
            if (!user) {
                return callback();
            };

            getProfile(user, function (err, user) {
                if (err) {
                    return callback(err);
                };

                var username =  user.get('username');
                return Parse.User.logIn(username, password, {
                    success: function (loginUser) {
                        if (!loginUser) {
                            return callback();
                        };

                        loginUser.set('profile', user.get('profile'));
                        return callback(null, toCedarUser(loginUser));
                    },
                    error: function (loginUser, err) {
                        return callback(err);
                    }
                });
            });
        },
        error: function (err) {
            return callback(err);
        }
    });
}

//use for facebook login and backfill profile
function getProfile(user, callback) {
    //If user profile is null or user profile is not null but don't actually have any data
    if (!user.get('profile') || !user.get('profile').get('name')) {
        query = new Parse.Query(Profile);
        query.equalTo('userId', user.id);
        query.first({
            success: function(profile) {
                if (profile) {
                    user.set('profile', profile);
                } else {
                    profile = new Profile();

                    if (user.get("name")) {
                        profile.set("name", user.get("name"));
                    };
                    profile.set("userId", user.id);
                    user.set('profile', profile);
                }
                return callback(null, user);
            },
            error: function(profile, err) {
                return callback(err);
            }
        })
    } else {
        return callback(null, user);
    }
}

//This will update facebookId field for user
//This is used when we want to add login with facebook to a normal account
exports.updateFacebookId = function updateFacebookId(userId, facebookId, callback) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('objectId', userId);
    query.first({
        success: function(user) {
            if (!user) {
                return callback();
            };

            user.set('facebookId', facebookId);
            user.save().then(
                function () {
                    return callback(null, toCedarUser(user));
                },
                function (err) {
                    if (err.code == 206) {
                        return callback(null, toCedarUser(user));
                    };
                    return callback(err);
                }
            );
        },
        error: function(user, err) {
            return callback(err);
        }
    })
}

//use for normal login account
exports.updateUser = function updateUser(user, callback) {
    var userProfile;
    var user;

    async.parallel([
        function (innerCallback) {
            updateProfile(user, user.id, function (err, profile) {
                if (err) {
                    return innerCallback(err);
                };

                userProfile = profile;
                return innerCallback();
            });
        },
        function (innerCallback) {
            var query = new Parse.Query(Parse.User);

            query.equalTo('objectId', user.id);
            query.first({
                success: function(parseUser) {
                    user = parseUser;
                    return innerCallback();
                },
                error: function(parseUser, err) {
                    return innerCallback(err);
                }
            });
        }],
        function (err, results) {
            if (err) {
                return callback(err);
            };

            if (userProfile && user) {
                user.set('profile', userProfile);
                user.save().then(
                    function () {
                        return callback(null, toCedarUser(user));
                    },
                    function (err) {
                        if (err.code == 206) {
                            return callback(null, toCedarUser(user));
                        };
                        return callback(err);
                    }
                );
            } else {
                return callback(null, user);
            }
        })
}

function updateProfile(data, userId, callback) {
    var query = new Parse.Query(Profile);

    if (data.imageData) {
        var file = new Parse.File(data.imageName, {base64: data.imageData});

        file.save().then(
            function () {
                query.equalTo("userId", data.id);
                query.first({
                    success: function(userProfile) {
                        if (!userProfile) {
                            var profile = new Profile();

                            profile.set('name', data.name);
                            profile.set('image', file);
                            profile.set('userId', data.id);

                            profile.save().then(
                                function () {
                                    return callback(null, profile);
                                },
                                function (err) {
                                    return callback(err);
                                });
                        } else {
                            userProfile.set("name", data.name);
                            userProfile.set("image", file);
                            userProfile.save().then(
                                function () {
                                    return callback(null, userProfile);
                                },
                                function (err) {
                                    return callback(err);
                                });
                        }
                    },
                    error: function(data, error) {
                        return callback(err);
                    }
                });
            },
            function (err) {
                return callback(err);
            }
        );
    } else {
        query.equalTo("userId", data.id);
        query.first({
            success: function(userProfile) {
                if (!userProfile) {
                    var profile = new Profile();

                    profile.set('name', data.name);
                    profile.set('userId', data.id);

                    profile.save().then(
                        function () {
                            return callback(null, profile);
                        },
                        function (err) {
                            return callback(err);
                        });
                } else {
                    userProfile.set("name", data.name);
                    userProfile.save().then(
                        function () {
                            return callback(null, userProfile);
                        },
                        function (err) {
                            return callback(err);
                        }
                    );
                }
            },
            error: function(data, error) {
                return callback(err);
            }
        });
    }
}

exports.createUser = function createUser(user, callback) {
    var newUser = new Parse.User();
    var profile = new Profile();

    profile.set('name', user.name);
    if (user.image) {
        profile.set('image', user.image);
    };

    newUser.set('username', user.username);
    newUser.set('password', user.password);
    newUser.set('email', user.email);
    newUser.set('profile', profile);
    if (user.imageId) {
        newUser.set('imageId', user.imageId);
    };

    if (user.facebookId) {
        newUser.set('facebookId', user.facebookId);
    };

    newUser.signUp(null, {
        success: function (user) {
            profile.set('userId', user.id);
            user.set('profile', profile);
            user.save(null, {
                success: function (user) {
                    return callback(null, toCedarUser(user));
                },
                error: function (user, err) {
                    debugger;
                    return callback(err);
                }
            });
        },
        error: function (user, err) {
            debugger;
            return callback(err);
        }
    })
}

exports.getTotalUser = function getTotalUser(callback) {
    var query = new Parse.Query(Parse.User);

    query.count({
        success: function(result) {
            return callback(null, result);
        },
        error: function(err) {
            return callback(err);
        }
    });
}

exports.getUsers = function getUsers (options, callback) {
    //Default variable as local because it's only used here.
    var defaultLimit = 40;
    var defaultPage = 1;
    var setting = {
        page: defaultPage,
        limit: defaultLimit
    }

    var query = new Parse.Query(Parse.User);

    if (typeof options == "function") {
        callback = options;
    } else {
        //Override setting if options is exist.
        setting = _.extend(setting, options);
    };

    query.include('profile');
    query.skip((setting.page-1) * setting.limit).limit(setting.limit).descending('createdAt');
    query.find({
        success: function(users) {
            async.each(users, function (user, innerCallback) {
                if (!user.get('profile')) {
                    getUserProfile(user.id, function (err, profile) {
                        if (err) {
                            return innerCallback(err);
                        };

                        user.set('profile', profile);
                        return innerCallback();
                    });
                } else {
                    return innerCallback();
                }
            }, function (err) {
                if (err) {
                    return callback(err);
                };
                var cedarUsers = users.map(toCedarUser);
                return callback(null, cedarUsers);
            })
        },
        error: function(users, err) {
            return callback(err);
        }
    });
}

exports.getUser = function getUser (username, callback) {
    if (!username) {
        return callback(new Error('username cannot be null or empty'));
    };

    var query = new Parse.Query(Parse.User);

    query.include('profile');
    query.equalTo('username', username);
    query.first({
        success: function(user) {
            if (user) {
                user = toCedarUser(user);
            };

            return callback(null, user);
        },
        error: function(user, err) {
            return callback(err);
        }
    });
}

exports.getUserById = function getUserById (userId, callback) {
    if (!userId) {
        return callback(new Error('userId cannot be null or empty'));
    };

    var query = new Parse.Query(Parse.User);

    query.include('profile');
    query.equalTo('objectId', userId);
    query.first({
        success: function(user) {
            return callback(null, toCedarUser(user));
        },
        error: function(user, err) {
            return callback(err);
        }
    });
}

exports.getUserByEmail = function getUserByEmail (email, callback) {
    if (!email) {
        return callback(new Error('email cannot be null or empty'));
    };

    var query = new Parse.Query(Parse.User);

    query.include('profile');
    query.equalTo('email', email);
    query.first({
        success: function(user) {
            if (user) {
                user = toCedarUser(user);
            };

            return callback(null, user);
        },
        error: function(user, err) {
            return callback(err);
        }
    });
}

exports.isEmailExist = function isEmailExist(email, callback) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('email', email).first({
        success: function (user) {
            if (user) {
                return callback(null, false);
            } else {
                return callback(null, true);
            }
        },
        error: function (err) {
            return callback(null, false);
        }
    });
}

exports.isUsernameExist = function isEmailExist(username, callback) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('username', username).first({
        success: function (user) {
            if (user) {
                return callback(null, false);
            } else {
                return callback(null, true);
            }
        },
        error: function (err) {
            return callback(null, false);
        }
    });
}

function getUserProfile(userId, callback) {
    var query = new Parse.Query(Profile);

    query.equalTo('userId', userId);
    query.first({
        success: function(profile) {
            return callback(null, profile);
        },
        error: function(profile, err) {
            return callback(err);
        }
    })
}

function getAllUsers(callback) {
    var query = new Parse.Query(Parse.User);

    query.find({
        success: function(users) {
            return callback(null, users);
        },
        error: function(users, err) {
            return callback(err);
        }
    })
}

function toCedarUser(ParseUser) {
    if (!ParseUser) {
        return ParseUser;
    };

    var profile = ParseUser.get('profile');
    var user = {
        id: ParseUser.id,
        name: ParseUser.get('name'),
        username: ParseUser.get('username'),
        email: ParseUser.get('email'),
        facebookId: ParseUser.get('facebookId'),
        imageUrl: ParseUser.get('imageId')
    }

    if (profile) {
        user.name = profile.get('name') ? profile.get('name') : ParseUser.get('name');
        user.imageUrl = profile.get('image') ? profile.get('image').url() : user.imageUrl;
    };

    if (user.email) {
        user.email = user.email.toLowerCase();
    };
    return user;
}