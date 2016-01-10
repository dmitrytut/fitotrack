
/**
 * @fileOverview
 * DashboardCtrl.js
 * Controller for App Dashboard.
 */

(function (ng, app) {
    'use strict';

    app.controller('dashboard.Ctrl',
        [
            '$scope',
            '$rootScope',
            'appService',
            'utilsService',
            'dashboard.Model',
            'dashboardInitialData',
            function ($scope, $rootScope, appSvc, utils, DashboardModel, dashboardInitialData) {
                
                var dashboardTitle = "Dashboard";
                appSvc.setTitle(dashboardTitle);

                $scope.Model = new DashboardModel();

                // Storing initial dashboard data in model.
                if (dashboardInitialData) {
                    utils.resolveReferences(dashboardInitialData);
                    if (!utils.isUndefinedOrNull(dashboardInitialData.summaryNutritionInfo)) {
                        // Object.
                        utils.copyOnlyExisting(dashboardInitialData.summaryNutritionInfo, $scope.Model.summaryNutritionInfo);
                    }
                    if (!utils.isUndefinedOrNull(dashboardInitialData.burnedCalories)) {
                        // Just value.
                        $scope.Model.burnedCalories = dashboardInitialData.burnedCalories;
                    }
                    if (!utils.isUndefinedOrNull(dashboardInitialData.goalInfo)) {
                        // Object.
                        utils.copyOnlyExisting(dashboardInitialData.goalInfo, $scope.Model.goalInfo);
                    }
                }

                $scope.Internal = {
                };

                // Initialization.
                $scope.Init = function () {
                    // Update remaining local function.
                    var updateRemainingWatch = function(objName){
                        $scope.$watch(objName, function (newValue, oldValue) {
                            if (newValue !== oldValue){
                                $scope.Model.updateRemaining();
                            }
                        }, true);
                    };

                    // Watch for data changes.
                    updateRemainingWatch('Model.summaryNutritionInfo');
                    updateRemainingWatch('Model.burnedCalories');
                    updateRemainingWatch('Model.goalInfo');

                    // Run update remaining for first time.
                    $scope.Model.updateRemaining();
                };

                // Display specific part of the date.
                $scope.ShowDateParts = function (part) {
                    return $scope.Model.showDateParts($scope.Model.date, part);
                };

                // Invoke Init.
                $scope.Init();
            }
        ]);
})(angular, fitotrack);