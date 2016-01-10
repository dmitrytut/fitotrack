/**
 * @fileOverview
 * dashboardModel.js
 * Model for dashboard.
 */

(function (ng, app) {
    'use strict';

    app.factory('dashboard.Model',
    [
        'moment',
        '$q',
        'appCfg',
        'utilsService',
        'notificationService',
        'dashboard.SummaryNInfoElement',
        'meal.food.NutritionElement',
        'profile.model.Goal',
        function (
            moment,
            $q,
            appCfg,
            utils,
            notification,
            SummaryNInfoElement,
            FoodNutrition,
            GoalInfo) {
            function dashboardModel() {
                //
                // Today's nutrition information.
                this.summaryNutritionInfo = new SummaryNInfoElement();
                //
                // Today's burned calories.
                this.burnedCalories = 0;
                //
                // Goal information for today.
                this.goalInfo = new GoalInfo({
                    goalId: 0,
                    goalType: 0,
                    intensity: 0,
                    startWeight: 0,
                    goalWeight: 0,
                    rde: 0,
                    estimatedFinishDate: 0,
                    creationTime: 0
                });
                //
                // Remaining nutritions.
                this.remainingInfo = new FoodNutrition();
                //
                // Current user's weight.
                this.currentWeight = undefined;
                //
                // Today date.
                this.date = moment().startOf("day").valueOf();
            }

            dashboardModel.prototype = {
                //
                // Show part of the date. 
                // Params: 
                // 'monthDay' - month day (number), 'weekDay' - title of the week day (text), 
                // 'month' - month (number), 'monthTitle' - title of the month (text), 
                // 'year' - year (number)
                showDateParts: function (date, part) {
                    if (utils.isUndefinedOrNull(date)) {
                        return null;
                    }
                    switch (part) {
                        case "monthDay":
                            return moment(date).date();
                        case "weekDay":
                            return moment().weekday(moment(date).day()).format('ddd');
                        case "month":
                            return moment(date).month();
                        case "monthTitle":
                            return moment().month(moment(date).month()).format('MMMM');
                        case "year":
                            return moment(date).year();
                        default:
                            return null;
                    }
                },
                //
                // Update remaining nutritions.
                updateRemaining: function () {
                    var self = this;

                    // Check if something vital is undefined or null.
                    if (utils.isUndefinedOrNull(self.burnedCalories)) {
                        self.burnedCalories = 0;
                    }
                    // Use only already consumed nutritions (not planned).
                    if (utils.isUndefinedOrNull(self.summaryNutritionInfo.consumedNInfo.kcal)) {
                        self.summaryNutritionInfo.consumedNInfo.kcal = 0;
                    }

                    if (!utils.isUndefinedOrNull(self.goalInfo.rde) ||
                        self.goalInfo.rde !== 0) {
                        self.remainingInfo.kcal = self.goalInfo.rde - self.summaryNutritionInfo.consumedNInfo.kcal + self.burnedCalories;
                        // Other nutrtion elements.
                    } else {
                        self.remainingInfo.kcal = 0;
                        // Other nutrtion elements.
                    }

                }

            };

            return dashboardModel;
        }]);
})(angular, fitotrack);