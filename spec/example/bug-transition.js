/* global require, module */
(function() {
	'use strict';

	var assign = require('/example/transitions/assign');
	var close = require('/example/transitions/close');
	var defer = require('/example/transitions/defer');
	var open = require('/example/transitions/open');
	var resolve = require('/example/transitions/resolve');

	var transitions = [assign, close, defer, open, resolve];

	transitions._path_ = '/example/bug-transition';

	module.exports = transitions;
}());