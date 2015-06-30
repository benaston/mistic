/* global require, module */
(function() {
	'use strict';

	var Transition = require('./transition');
	var states = require('/example/bug-state');

	var resolve = new Transition({
		startStates: [states.assigned],
		endStates: [states.resolved],
		transitionAction: action,
	});

	function action(options) {
		options.statefulObject.bug.assigneeEmail = null;
	}

	resolve._path_ = '/example/transitions/resolve';

	module.exports = Object.freeze(resolve);
}());