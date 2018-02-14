var express  = require('express');

module.exports = function(app, passport) {

	app.get('/auth/github', passport.authenticate('github', { scope : 'user,repo' }));

	// handle the callback after github has authenticated the user
	app.get('/auth/callback', passport.authenticate('github', {
		successRedirect : 'http://localhost:3001/onboarding/session-picker',
		failureRedirect : '/error'
	}));

	// get user
	app.get('/local/session', function(req, res) {
		res.json(req.user);
	});
};