
/**
 * @fileOverview
 * jquery.js
 * Module for jquery library loading.
 */

var jquery = angular.module('jquery', []);

jquery.factory('$', function () {
    return window.$;
});