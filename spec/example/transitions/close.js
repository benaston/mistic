/* global require, module */
(function() {
	'use strict';

	var Transition = require('./transition');
	var states = require('/example/bug-state');

	var close = new Transition({
		startStates: [states.resolved],
		endStates: [states.closed],
		transitionAction: action,
	});

	function action(options, closerEmail) {
		options.statefulObject.bug.assigneeEmail = null;
		options.statefulObject.bug.closerEmail = closerEmail;
	}

	close._path_ = '/example/transitions/close';

	module.exports = Object.freeze(close);
}());