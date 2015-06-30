/* global require, module */
(function() {
    'use strict';
    
    function Bug(title) {
        this.title = title;
        this.assigneeEmail = null;
        this.closedByName = null;
    }

    Bug._path_ = '/example/bug';

    module.exports = Bug;
}());