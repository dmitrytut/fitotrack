
/**
 * @fileOverview
 * underscore.js
 * Module for underscore loading.
 */

var underscore = angular.module('underscore', []);

underscore.factory('_', function () {
    return window._;
});