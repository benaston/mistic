/* global require, module */
(function() {
	'use strict';

	var state = require('./state');

	var bugState = {
		assigned: Object.create(state, {
			value: { value: 'ASSIGNED' }
		}),
		closed: Object.create(state, {
			value: { value: 'CLOSED' }
		}),
		deferred: Object.create(state, {
			value: { value: 'DEFERRED' }
		}),
		open: Object.create(state, {
			value: { value: 'OPEN' }
		}),
		resolved: Object.create(state, {
			value: { value: 'RESOLVED' }
		}),
		_path_: '/example/bug-state',
	};

	module.exports = Object.freeze(bugState);
}());