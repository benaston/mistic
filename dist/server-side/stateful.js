/* global require, module */ 
;(function() {

	'use strict';

	var need = require('niid').need;
	var partial = require('partial-application').partial;
	var spread = require('sprest').spread;
	var rest = require('sprest').rest;

	/**
	 * Expects a property named `machine`.
	 * @type {Object}
	 */
	var stateful = {

		get parentState() {
			return this.machine.parentState;
		},

		get currentState() {
			return this.machine.currentState;
		},

		/**
		 * `cb` is passed `transitionActionStatus`, so that 
		 * this can be used by client code.
		 */
		triggerTransition: function triggerTransition(options) {
			need(options, 'targetState');

			var transitionActionStatus;

			transitionActionStatus = spread(partial(this.machine.triggerTransition, {
					statefulObject: this,
					targetState: options.targetState
				}),
				rest(triggerTransition, arguments), this.machine);
			options.cb && options.cb(transitionActionStatus);

			return this;
		}

	};

	stateful._path_ = './stateful';

	module.exports = stateful;

}());