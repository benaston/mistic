/* global require, module */ 
;(function() {

	'use strict';

	var mix = require('mixx').mix;
	var need = require('niid').need;
	var partial = require('partial-application').partial;
	var spread = require('sprest').spread;
	var rest = require('sprest').rest;

	var transitionHelper = {};

	var defaultOptions = Object.freeze({
		statefulObject: undefined,
		machine: undefined,
		targetState: undefined,
	});

	transitionHelper.triggerTransition = function triggerTransition(options) {
		need(options = mix({}, defaultOptions, options));

		if (options.machine.currentState.value === options.targetState.value &&
			!options.machine.permitSelfTransition) {
			throw 'self transition exception';
		}

		if (options.machine.finalState && options.machine.currentState.value === options.machine.finalState.value) {
			throw 'final state transition exception';
		}

		if (options.machine.currentState.value === options.targetState.value &&
			options.machine.bypassTransitionBehaviorForSelfTransition) {
			return;
		}

		return performTransition(options,
			getTransition(options),
			rest(triggerTransition, arguments));
	};

	function performTransition(options, transition, restArgs) {
		if (transition &&
			spread(partial(transition.condition, options.targetState, options.statefulObject), restArgs)) {
			return runTransitionSteps(options, restArgs, transition);
		}

		if (!options.machine.parent) {
			throw 'invalid state transition. current: ' +
			options.machine.currentState.value + ' target: ' + options.targetState.value;
		}

		return spread(partial(options.machine.parent.triggerTransition, options.targetState), restArgs);
	}

	function runTransitionSteps(options, restArgs, transition) {
		var result;

		spread(options.machine.currentState.exitAction, restArgs);
		result = spread(partial(transition.transitionAction, options), restArgs);
		spread(options.targetState.entryAction, restArgs);
		options.machine.currentState = options.targetState;

		return result;
	}

	function getTransition(options) {
		return options.machine.transitions
			.find(function(t) {
				return t.startStates.some(function(s) {
					return s.value === options.machine.currentState.value;
				}) && t.endStates.some(function(e) {
					return e.value === options.targetState.value;
				});
			});
	}

	transitionHelper._path_ = './transition-helper';

	module.exports = transitionHelper;

}());