@@kwire
  
@@niid

@@noopaam

@@partial-application

@@sprest

@@mixx

;(function(root) {
  'use strict';

  var namespace = {};

  kwire(namespace); // Configure window in browser for CommonJS module syntax.
  
  @@transition-helper

  @@machine
  
  @@state

  @@stateful

  @@transition-action-status
  
  @@transition

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