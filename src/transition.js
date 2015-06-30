/* global require, module */
;(function() {

	'use strict';

	var mix = require('mixx').mix;
	var need = require('niid').need;
	var noop = require('noopaam');

	var defaultOptions = Object.freeze({
		startStates: undefined,
		endStates: undefined,
		condition: noop.truthy,
		transitionAction: noop.truthy
	});

	function Transition(options) {
		need(options = mix({}, defaultOptions, options), 'startStates', 'endStates');

		mix(this, options);
	}

	Transition._path_ = './transition';

	module.exports = Transition;

}());