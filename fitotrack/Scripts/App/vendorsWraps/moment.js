
/**
 * @fileOverview
 * underscore.js
 * Module for moment library loading.
 */

var momentApp = angular.module('momentApp', []);

momentApp.factory('moment', function () {
    return window.moment;
});