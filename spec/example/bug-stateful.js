/* global require, module */
(function() {
    'use strict';

    var mix = require('mixx').mix;
    var stateful = require('./stateful');    
    var state = require('/example/bug-state');

    function BugStateful(bug, machine) {
        this.bug = bug;
        this.machine = machine; // Used by stateful methods.
    }

    mix(BugStateful.prototype, stateful);

    BugStateful.prototype.open = function() {
        return this.triggerTransition({targetState: state.open});
    };

    BugStateful.prototype.assign = function(assigneeEmail) {
        return this.triggerTransition({targetState: state.assigned}, assigneeEmail);
    };

    BugStateful.prototype.defer = function() {
        return this.triggerTransition({targetState: state.deferred});
    };

    BugStateful.prototype.resolve = function() {
        return this.triggerTransition({targetState: state.resolved});
    };

    BugStateful.prototype.close = function(closerEmail) {
        return this.triggerTransition({targetState: state.deferred}, closerEmail);
    };

    BugStateful._path_ = '/example/bug-stateful';

    module.exports = BugStateful;
}());