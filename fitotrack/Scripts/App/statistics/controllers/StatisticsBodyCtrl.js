
/**
 * @fileOverview
 * DashboardCtrl.js
 * Controller for App Statistics.
 */

(function (ng, app) {
    'use strict';

    app.controller('statistics.body.Ctrl',
        [
            '_',
            'moment',
            '$scope',
            '$rootScope',
            '$state',
            '$stateParams',
            'appCfg',
            'appService',
            'utilsService',
            '$interval',
            function (_, moment, $scope, $rootScope, $state, $stateParams, appCfg, appSvc, utils, $interval) {
                
                // Internal variables.
                $scope.Internal = {
                    state: $scope.$parent.Public.states.body,
                    chosenPeriod: {}
                };
                
                // Init controller.
                $scope.BodyInit = function () {
                    // Get parent chosenPeriod as initial period.
                    ng.extend($scope.Internal.chosenPeriod, $scope.$parent.Public.chosenPeriod);
                };
                $scope.BodyInit();

                $scope.$on('ftStatsChosenPeriodChanged', function (event, stateId, newChosenPeriod) {
                    console.log("Body reported: Parent chosenPeriod is changed and it is...");
                    if (stateId === $scope.Internal.state.id) {
                        if (!utils.isUndefinedOrNull(newChosenPeriod) &&
                            !utils.isUndefinedOrNull(newChosenPeriod.startDate) &&
                            !utils.isUndefinedOrNull(newChosenPeriod.endDate) &&
                            newChosenPeriod.startDate.isValid() &&
                            newChosenPeriod.endDate.isValid()) {
                            if (!newChosenPeriod.startDate.isSame($scope.Internal.chosenPeriod.startDate) ||
                                !newChosenPeriod.endDate.isSame($scope.Internal.chosenPeriod.endDate)) {
                                console.log("Not equal to internal! See yourself:");
                                console.log(newChosenPeriod);
                                $scope.Internal.chosenPeriod = newChosenPeriod;
                            }
                            else {
                                console.log("Equal to the internal!");
                            }
                        }
                    }
                    else {
                        console.log("Ohh it's not me...");
                    }
                }, true)
            }
        ]);
})(angular, fitotrack);