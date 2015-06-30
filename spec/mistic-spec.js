/* global require, describe, beforeEach, it, expect */
'use strict';

var StateMachine = require('./machine');
var transitions = require('/example/bug-transition');
var state = require('/example/bug-state');
var Bug = require('/example/bug');
var BugStateful = require('/example/bug-stateful');

describe('BugStateful', function() {

    var machine, bug;

    beforeEach(function() {
        machine = new StateMachine({
            name: 'bug-tracker',
            transitions: transitions,
            initialState: state.open,
        });

        bug = new Bug('bug title');
    });

    it('should be able to assign an open bug', function() {
        //arrange
        var stateful, result, assigneeEmail;

        stateful = new BugStateful(bug, machine);
        assigneeEmail = 'assignee@example.com';

        //act
        result = stateful.assign(assigneeEmail);

        //assert
        expect(stateful.currentState.value === 'ASSIGNED').toBe(true);
        expect(stateful.bug.assigneeEmail).toBe(assigneeEmail);
        expect(result).toBe(stateful);
    });

    it('should be able to assign an assigned bug', function() {
        //arrange
        var stateful, assigneeEmail1, assigneeEmail2;

        stateful = new BugStateful(bug, machine);
        assigneeEmail1 = 'assignee2@example.com';
        assigneeEmail2 = 'assignee2@example.com';

        //act
        stateful.assign(assigneeEmail1);
        stateful.assign(assigneeEmail2);

        //assert
        expect(stateful.currentState.value === 'ASSIGNED').toBe(true);
        expect(stateful.bug.assigneeEmail).toBe(assigneeEmail2);
    });

    it('bug is already assigned and self transition is not permitted transition not run', function() {
        //arrange
        var stateful, assigneeEmail1, assigneeEmail2, exceptionCaught;

        machine = new StateMachine({
            name: 'bug-tracker',
            transitions: transitions,
            initialState: state.open,
            permitSelfTransition: false,
        });

        stateful = new BugStateful(bug, machine);
        assigneeEmail1 = 'assignee2@example.com';
        assigneeEmail2 = 'assignee2@example.com';
        exceptionCaught = false;

        //act
        stateful.assign(assigneeEmail1);
        try {
            stateful.assign(assigneeEmail2);
        } catch (e) {
            exceptionCaught = true;
        }

        //assert
        expect(exceptionCaught).toBe(true);
        expect(stateful.currentState.value === 'ASSIGNED').toBe(true);
        expect(stateful.bug.assigneeEmail).toBe(assigneeEmail1);
    });

    it('throws an exception when an invalid transition is attempted', function() {
        //arrange
        var stateful, errorMessage;

        stateful = new BugStateful(bug, machine);

        //act
        try {
            stateful.resolve();
        } catch(e) {
            errorMessage = e;
        }

        //assert
        expect(errorMessage).toBe('invalid state transition. current: OPEN target: OPEN');
    });

});