// load all the things we need
var GithubStrategy   = require('passport-github').Strategy;

// load the auth variables
var configAuth = require('./auth');

var axios = require('axios');
var User  = require('./userModel');

var store = require('store');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GithubStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.githubAuth.clientID,
        clientSecret    : configAuth.githubAuth.clientSecret,
        callbackURL     : configAuth.githubAuth.callbackURL
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        User.findOne({ 'userId' : profile.id }, function(err, user) {

            User.create({
                userId: profile.id,
                token: token,
            }, function(err, user) {
                if (err){
                    // return done(err);
                }else{
                    return done(null, user);
                }
            });
        });
    });
}));
};