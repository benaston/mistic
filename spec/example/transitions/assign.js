/* global require, module */
(function() {
	'use strict';

	var Transition = require('./transition');
	var state = require('/example/bug-state');

	var assign = new Transition({
		startStates: [state.open, state.assigned],
		endStates: [state.assigned],
		transitionAction: action,
	});

	function action(options, assigneeEmail) {
		options.statefulObject.bug.assigneeEmail = assigneeEmail;
	}

	assign._path_ = '/example/transitions/assign';

	module.exports = Object.freeze(assign);
}());