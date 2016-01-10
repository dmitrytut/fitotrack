
/**
 * @fileOverview
 * foodNutritionElement.js
 * Nutrition elements.
 */

(function (ng, app) {
    'use strict';

    // Vital nutrition element.
    app.factory('meal.food.VitalNutritionElement', function () {
        var VitalNutrition = function (data) {
            ng.extend(this, {
                kcal: 0,
                carb: 0,
                protein: 0,
                fat: 0,
                sodium: 0,
                sugar: 0
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return VitalNutrition;
    });

    // Full nutrition element.
    app.factory('meal.food.NutritionElement', function () {
        var FullNutrition = function (data) {
            ng.extend(this, {
                kcal: 0,
                carbohydrate: 0,
                protein: 0,
                fat: 0,
                dietaryFiber: 0,
                sugars: 0,
                saturatedFat: 0,
                monounsaturatedFat: 0,
                polyunsaturatedFat: 0,
                transFat: 0,
                cholesterol: 0,
                sodium: 0,
                potassium: 0,
                calcium: 0,
                iron: 0,
                vitaminA: 0,
                vitaminC: 0
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return FullNutrition;
    });
})(angular, fitotrack);