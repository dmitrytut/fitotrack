
/**
 * @fileOverview
 * summaryNutritionInfoElement.js
 * Element with consumed and planned nutrition information.
 */

(function (ng, app) {
    'use strict';

    app.factory('dashboard.SummaryNInfoElement',
        [
            'meal.food.NutritionElement',
            function (FoodNutrition) {
                var SummaryNInfoElement = function (data) {
                    ng.extend(this, {
                        consumedNInfo: new FoodNutrition(),
                        plannedNInfo: new FoodNutrition(),
                        plannedMealsCount: 0,
                        consumedMealsCount: 0
                    });
                    if (data) {
                        ng.extend(this, data);
                    }
                };
                return SummaryNInfoElement;
            }
        ]);
})(angular, fitotrack);