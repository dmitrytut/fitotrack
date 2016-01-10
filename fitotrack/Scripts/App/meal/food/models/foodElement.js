//
//Model for Food element

//**** OLD STYLED

(function (ng, app) {
    'use strict';

    app.factory('meal.food.Element', [
        '_',
        'meal.food.ServingElement',
        function (_, ServingElement) {
            var Food = function (data) {
                ng.extend(this, {
                    ft_food_id: 0,
                    food_id: 0,
                    food_name: '',
                    food_type: '',
                    brand_name: '',
                    servings: {
                        serving: _.toArray({ e: new ServingElement() })
                    },
                    create_user: 0,
                    creation_time: 0
                });
                if (data) {
                    ng.extend(this, data);
                }
            };
            return Food;
        }]);
})(angular, fitotrack);