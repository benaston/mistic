# mistic

A simple state machine.

File size: **7176 bytes**.<br/>
Supported platforms: **browser and server**.<br/>
Supported language versions: **ES5+**.

Supports heirarchical states.

**Note:** When using **mistic** server-side, its constituent files currently need to be referred to directly. You will also need to install the following modules: `mixx`, `niid`, `partial-application`, `kwire`, `noopaam`, and `sprest`.

## Example

```javascript
var state = require('./mistic/state');
var stateful = require('./mistic/stateful');
var Transition = require('./mistic/transition');
var StateMachine = require('./mistic/machine');

// Your object type to make stateful.
function Bug(title) {
	this.title = title;
	this.assigneeEmail = null;
}

// Define the possible bug states.
var bugState = {
	open: Object.create(state, {
		value: { value: 'OPEN' }
	}),
	assigned: Object.create(state, {
		value: { value: 'ASSIGNED' }
	}),
	resolved: Object.create(state, {
		value: { value: 'RESOLVED' }
	})
};

// Define a wrapper around your object (decorator pattern).
// You can also make the object stateful directly.
function BugStateful(bug, machine) {
    this.bug = bug;
    this.machine = machine;
}

BugStateful.prototype = Object.create(stateful);

BugStateful.prototype.open = function() {
    return this.triggerTransition({targetState: bugState.open});
};

BugStateful.prototype.assign = function(assigneeEmail) {
    return this.triggerTransition({targetState: bugState.assigned}, assigneeEmail);
};

BugStateful.prototype.resolve = function() {
    return this.triggerTransition({targetState: bugState.resolved});
};

// Define the valid transitions for your stateful object.
var open = new Transition({
	startStates: [state.open],
	endStates: [state.open],
});

var assign = new Transition({
	startStates: [state.open, state.assigned],
	endStates: [state.assigned],
	transitionAction: function (options, assigneeEmail) {
		options.statefulObject.bug.assigneeEmail = assigneeEmail;
	}
});

var resolve = new Transition({
	startStates: [state.assigned],
	endStates: [state.resolved]
});

// Instantiate the state machine.
machine = new StateMachine({
    name: 'bug-tracker',
    transitions: [open, assign, resolve],
    initialState: state.open,
});

var bug = new Bug('bug title');
var statefulBug = new BugStateful(bug, machine);

// Trigger a state transition.
var result = statefulBug.assign(assigneeEmail);

// Transition is successful and affects the object.
expect(statefulBug.currentState.value === 'ASSIGNED').toBe(true);
expect(statefulBug.bug.assigneeEmail).toBe(assigneeEmail);
```

## License & Copyright

This software is released under the MIT License. It is Copyright 2015, Ben Aston. I may be contacted at ben@bj.ma.

## How to Contribute

Pull requests including bug fixes, new features and improved test coverage are welcomed. Please do your best, where possible, to follow the style of code found in the existing codebase.
