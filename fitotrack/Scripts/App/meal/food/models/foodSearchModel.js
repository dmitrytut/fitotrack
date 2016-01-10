//
//Model for search entity

//**** OLD STYLED

(function (ng, app) {
    'use strict';

    app.factory('meal.food.SearchModel', 
        [
            'meal.food.SearchBaseModel',
            'meal.food.Service', 
            'notificationService',
            function (FoodSearchBaseModel, foodService, notification) {
                var Model = new FoodSearchBaseModel();
                return Model;
            }
        ]);

})(angular, fitotrack);