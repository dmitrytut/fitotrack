
/**
 * @fileOverview
 * DashboardCtrlInitData.js
 * Initialize init data for dashboard. Used in route resolve. 
 */

(function (ng, app) {
    'use strict';

    app.factory('dashboard.InitData',
        [
            '$q',
            'dashboard.Service',
            function ($q, dashboardService) {
                return function () {
                    var getNutritionInfo = dashboardService.getNutritionInfo();
                    var getBurnerdCalories = dashboardService.getBurnerdCalories();
                    var getGoalInfo = dashboardService.getGoalInfo();

                    return $q.all([getNutritionInfo, getBurnerdCalories, getGoalInfo]).then(function (results) {
                        return {
                            summaryNutritionInfo: results[0],
                            burnedCalories: results[1],
                            goalInfo: results[2]
                        };
                    });
                }
            }
        ]);
})(angular, fitotrack);