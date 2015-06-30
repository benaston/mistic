/* global require, module */
(function() {
	'use strict';

	var Transition = require('./transition');
	var state = require('/example/bug-state');

	var open = new Transition({
		startStates: [state.closed],
		endStates: [state.open],
	});

	open._path_ = '/example/transitions/open';

	module.exports = Object.freeze(open);
}());