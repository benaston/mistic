/* global require, module */
(function() {
	'use strict';

	var Transition = require('./transition');
	var states = require('/example/bug-state');

	var defer = new Transition({
		startStates: [states.open, states.assigned],
		endStates: [states.deferred],
		transitionAction: action,
	});

	function action(options) {
		options.statefulObject.bug.assigneeEmail = null;
	}

	defer._path_ = '/example/transitions/defer';

	module.exports = Object.freeze(defer);
}());