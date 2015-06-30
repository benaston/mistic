;(function(root) {

	'use strict';

	var namespace = {};

	;
(function(namespace) {

	'use strict';

	/**
	 * Augments the window object with a 
	 * module and a require property to 
	 * emulate CommonJS in the browser.
	 * @param  {Object} appRoot The object to use as the root object for your 'modules' reqistered with kwire.
	 * @param  {Object} globalShadow An object to shadow the global object for testing purposes.
	 */
	function kwire(appRoot, globalShadow) {
		appRoot = appRoot == null ? {} : appRoot;
		globalShadow = globalShadow || window;

		if (typeof appRoot !== 'object') {
			throw 'root object must be an object.'
		}

		if (isServerSide() ||
			isUsingRequireJS() ||
			rootIsAlreadyConfigured(globalShadow)) {
			return;
		}

		globalShadow.module = {
			set exports(value) {
				if (value === undefined) {
					throw 'module not defined.';
				}
				if (value === null) { // null or undefined.
					return;
				}
				if (!value.hasOwnProperty('_path_')) {
					throw '_path_ own-property must be present on modules registered with kwire.';
				}

				if (typeof value._path_ !== 'string') {
					throw '_path_ own-property must be a string.';
				}

				appRoot[value._path_] = value;
			}
		};

		/**
		 * cb is optional.
		 */
		globalShadow.require = function(value, cb) {
			var valueIsArray = Array.isArray(value);
			if (value == null) {
				throw 'value not defined.'
			}
			if (typeof value !== 'string' && !valueIsArray) {
				throw 'value must be a string or an array.'
			}

			if (cb) {
				if (!valueIsArray) {
					return cb(appRoot[value]);
				}

				return cb.apply(null, value.map(function(v) {
					return appRoot[v];
				}));
			}

			var result = appRoot[value];

			return result === undefined ? globalShadow[camelify(value)] : result;
		};

	}

	function camelify(str) {
		return str.replace(/(\-([^-]{1}))/g, function(match, $1, $2) {
			return $2.toUpperCase();
		});
	}

	function isServerSide() {
		return (typeof exports === 'object') && module;
	}

	function isUsingRequireJS() {
		return (typeof define === 'function') && define.amd;
	}

	function rootIsAlreadyConfigured(globalShadow) {
		return (globalShadow.module && globalShadow.require);
	}

	kwire.camelify = camelify;
	namespace.kwire = kwire;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.kwire = namespace.kwire; // Browser
	}

}(this));
  
;(function(root) {

	'use strict';

	var namespace = {};

	;
(function(namespace) {

	'use strict';

	/**
	 * Expects an arguments object, followed by zero or more 
	 * string arguments, corresponding to argument names.
	 * If a single argument is supplied, then all arguments 
	 * are verified to be defined. If more than one argument 
	 * is supplied, then the arguments corresponding to indices 
	 * that do not contain an '_' (underscore) are checked to 
	 * be defined.
	 * @param  {Arguments} args  The arguments object to check.
	 * @return {undefined}
	 */
	function need(args) {
		var argsArray, restArgs;

		if (!args) {
			return args;
		}

		argsArray = Array.prototype.slice.call(args);
		restArgs = Array.prototype.slice.call(arguments, 1);

		if (isArgumentObject(args)) {
			return argCheck(argsArray, restArgs);
		}

		return objectCheck(args, restArgs);
	}

	function argCheck(args, restArgs) {
		var iterator, reduceFn;

		iterator = restArgs.length ? restArgs : args;
		reduceFn = iterator === args ? undefinedCheck : unneededCheck.bind(null, args);

		iterator.reduce(reduceFn, null);
	}

	function objectCheck(o, restArgs) {
		var iterator, reduceFn;

		iterator = restArgs.length ? restArgs : Object.keys(o);
		reduceFn = undefinedCheckIn.bind(null, o);

		iterator.reduce(reduceFn, null);
	}

	function undefinedCheckIn(o, p, c) {
		if (o[c] === undefined) {
			throw c + ' not defined.';
		}
	}

	function unneededCheck(args, p, c, i) {
		if (c === '_') {
			return;
		}

		if (args[i] === undefined) {
			throw c + ' not defined.';
		}
	}

	function undefinedCheck(p, c, i) {
		if (c === undefined) {
			throw 'argument not defined.';
		}
	}

	function isArgumentObject(item) {
		return Object.prototype.toString.call(item) === '[object Arguments]';
	}

	namespace.need = need;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.niid = namespace; // Browser
	}

}(this));

;(function(root) {

	'use strict';

	var namespace = {};

	;(function(namespace) {

	'use strict';

	function noop() {}

	noop.truthy = function() {
		return true;
	};

	noop.falsy = function() {
		return false;
	};

	noop.exception = function(str) {
		throw str;
	};

	namespace.noopaam = noop;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace.noopaam; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace.noopaam;
		}); // AMD
	} else {
		root.noopaam = namespace.noopaam; // Browser
	}

}(this));

;(function(root) {

	'use strict';

	var namespace = {};

	;(function(namespace) {

	'use strict';

	/**
	 * Partially apply a function.
	 * @param  {Function} fn      The function to partially apply.
	 * @return {Function}         The partially applied function.
	 */
	function partial(fn) {
		var args;

		if (typeof fn !== 'function') {
			throw 'First argument must be a function.';
		}

		if (arguments.length <= 1) {
			return fn;
		}

		args = Array.prototype.slice.call(arguments, 1);

		return function() {
			return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
		}
	}

	/**
	 * Partially apply a function, but ensure the returned function has an arity of one.
	 * @param  {Function} fn      The function to partially apply.
	 * @return {Function}         The partially applied function.
	 */
	function partialWithArityOfOne(fn) {
		var args = arguments;

		return function(a) {
			return partial.apply(this, args).apply(this, arguments);
		};
	}

	namespace.partial = partial;
	namespace.partial1 = partialWithArityOfOne;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.partialApplication = namespace; // Browser
	}

}(this));

;(function(root) {

	'use strict';

	var namespace = {};

	;(function(namespace) {

	'use strict';

	function rest(fn, args) {
		return Array.prototype.slice.call(args, fn.length);
	}

	function spread(fn, arr, target) {
		return fn.apply((target || this), arr);
	}

	namespace.rest = rest;
	namespace.spread = spread;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.sprest = namespace; // Browser
	}

}(this));

;(function(root) {

	'use strict';

	var namespace = {};

	;(function(namespace) {

	'use strict';

	var mixFn = (function() {
		return isES5() ? mixIntoObjectES5 : mixIntoObjectES3;
	}());

	/**
	 * Accepts an object and zero or more objects.
	 * Returns the function, modified so that the
	 * methods on the supplied objects are present
	 * on the function's prototype.
	 */
	function mix(target) {
		var objs = Array.prototype.slice.call(arguments, 1);

		switch (typeof target) {
			case 'function':
				mixFn(target.prototype, objs);
				return target;
			case 'object':
				return mixFn(target, objs);
		}

		return target;
	}

	function mixIntoObjectES3(target, objs) {
		var i, key, o;

		for (i = 0; i < objs.length; i++) {
			o = objs[i];

			if(o == null) { // null or undefined
				continue;
			}

			for (key in o) {
				if (!o.hasOwnProperty(key)) {
					continue;
				}

				target[key] = o[key];
			}
		}

		return target;
	}

	function mixIntoObjectES5(target, objs) {
		objs.forEach(function(o) {
			if(o == null) { // null or undefined
				return;
			}
			Object.keys(o).forEach(function(k) {
				var descriptor = Object.getOwnPropertyDescriptor(o, k);
				descriptor.configurable = true;
				Object.defineProperty(target, k, descriptor);
			});
		});

		return target;
	}

	function isES5() {
		return Object.getOwnPropertyDescriptor && Array.prototype.forEach;
	}

	namespace.mix = mix;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.mixx = namespace; // Browser
	}

}(this));

;(function(root) {
  'use strict';

  var namespace = {};

  kwire(namespace); // Configure window in browser for CommonJS module syntax.
  
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

  /* global module */ 
;(function() {

	'use strict';

	var transitionActionStatus = {
		NOT_RUN: 1,
		SUCCESS: 2,
		FAILED: 3,
	};

	transitionActionStatus._path_ = './transition-action-status';

	module.exports = transitionActionStatus;

}());
  
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

  if ((typeof exports === 'object') && module) {
    module.exports = namespace; // CommonJS
  } else if ((typeof define === 'function') && define.amd) {
    define(function() {
      return namespace;
    }); // AMD
  } else {
    root.eventApi = namespace; // Browser
  }
}(this));