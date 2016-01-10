
/**
 * @fileOverview
 * app.js
 * Fitotrack App module declaration.
 */

var fitotrack = angular.module('fitotrack', [
    'ngRoute',
    'ngSanitize',
    'restangular',
    'ui.bootstrap',
    'ui.router',
    'ui.mask',
    'jquery',
    'underscore',
    'momentApp',
    'highchartsApp',
    'highcharts-ng',
    'ui.bootstrap.showErrors',
    'daterangepicker',
    'LocalStorageModule'
]);

(function (ng, app) {
    "use strict";

    app.run(
        [
            '$templateCache',
            '$rootScope',
            '$state',
            '$modalStack',
            'notificationService',
            'highcharts',
            function ($templateCache, $rootScope, $state, $modalStack, notification, highcharts) {
                //
                // Own services configuration.
                
                // Highcharts.
                // Configure to use user's timezone instead of UTC.
                highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                ////

                // Catching up a state change start event
                $rootScope.$on('$stateChangeStart', function () {
                    // Dismiss top modal dialog when state change started
                    var top = $modalStack.getTop();
                    if (top) {
                        $modalStack.dismiss(top.key);
                    }
                });
                // Catching up a successful state change in ui-router
                $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                    // Remember previous state
                    $rootScope.$previousState = from;
                });
                // Catching up the errors when state changes in ui-router
                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    event.preventDefault();
                    notification.log(error.message);
                });
            }
        ]);
})(angular, fitotrack);