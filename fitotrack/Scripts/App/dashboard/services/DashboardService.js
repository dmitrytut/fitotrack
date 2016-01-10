
/**
 * @fileOverview
 * DashboardService.js
 * Dashboard service for communicating with server side.
 */

(function (ng, app) {
    'use strict';

    app.factory('dashboard.Service',
        [
            'moment',
            'Restangular',
            function (moment, Restangular) {
                var restFoodDiary = Restangular.all('fooddiary');
                var restWorkoutDiary = Restangular.all('workoutdiary');
                var restProfile = Restangular.all('profile');
                var today = moment().startOf("day").valueOf();

                //Get today's consumed nutrition information.
                function getNutritionInfo() {
                    return restFoodDiary.one("ninfo", today).get();
                };
                //Get today's burned calories.
                function getBurnerdCalories() {
                    return restWorkoutDiary.one("burnedcalories", today).get();
                };
                // Get user goal information for today.
                function getGoalInfo() {
                    return restProfile.one("goals", today).get();
                }
                
                var dashboardService = {
                    getNutritionInfo: getNutritionInfo,
                    getBurnerdCalories: getBurnerdCalories,
                    getGoalInfo: getGoalInfo
                };
                return dashboardService;
            }
        ]);
})(angular, fitotrack);