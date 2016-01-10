
/**
 * @fileOverview
 * underscore.js
 * Module for moment library loading.
 */

var highchartsApp = angular.module('highchartsApp', []);

highchartsApp.factory('highcharts', function () {
    return window.Highcharts;
});