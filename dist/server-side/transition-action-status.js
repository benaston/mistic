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