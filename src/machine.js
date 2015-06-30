/* global require, module */ 
;(function() {

	'use strict';

	var mix = require('mixx').mix;
	var need = require('niid').need;
	var partial = require('partial-application').partial;
	var spread = require('sprest').spread;
	var rest = require('sprest').rest;

	var transitionHelper = require('./transition-helper');

	var defaultOptions = Object.freeze({
		name: undefined,
		transitions: undefined,
		initialState: undefined,
		finalState: null,
		parentMachine: null,
		permitSelfTransition: true,
		bypassTransitionBehaviorForSelfTransition: false
	});

	function Machine(options) {
		need(options = mix({}, defaultOptions, options), 'name', 'transitions', 'initialState');

		mix(this, options); // Add `options` directly to `this`.

		this.currentState = this.initialState;
		this.children = {};

		if (this.parentMachine) {
			this.parentMachine.children[this.name] = this;
		}
	}

	Machine.prototype.triggerTransition = function triggerTransition(options) {
		need(options = mix({
			machine: this
		}, options), 'statefulObject', 'targetState');

		return spread(partial(transitionHelper.triggerTransition, options),
			rest(triggerTransition, arguments));
	};

	Machine._path_ = './machine';

	module.exports = Machine;

}());