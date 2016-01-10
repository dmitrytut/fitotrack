//
//Model for Serving element

//**** OLD STYLED

(function (ng, app) {
    'use strict';

    app.factory('meal.food.ServingElement', [function () {
        var Serving = function (data) {
            ng.extend(this, {
                ft_serving_id: 0,
                serving_description: "",
                serving_id: 0,
                metric_serving_amount: 0,
                metric_serving_unit: 0,
                number_of_units: 0,
                measurement_description: "",
                calories: 0,
                carbohydrate: 0,
                protein: 0,
                fat: 0,
                fiber: 0,
                sugar: 0,
                saturated_fat: 0,
                monounsaturated_fat: 0,
                polyunsaturated_fat: 0,
                trans_fat: 0,
                cholesterol: 0,
                sodium: 0,
                potassium: 0,
                calcium: 0,
                iron: 0,
                vitamin_a: 0,
                vitamin_c: 0,
                create_user: 0,
                creation_time: 0
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return Serving;
    }]);
})(angular, fitotrack);