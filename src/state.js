/* global require, module */
;(function() {

	'use strict';

	var noop = require('noopaam');

	var state = {
		value: null, // Used for equality checks.
		entryAction: noop,
		exitAction: noop,
	};

	state._path_ = './state';

	module.exports = state;

}());