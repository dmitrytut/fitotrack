

/*! meal.food.ViewCtrl.js 
Controller for food view*/

(function (ng, app) {
    'use strict';

    app.controller('meal.food.ViewCtrl',
        [
            '_',
            '$scope',
            '$stateParams',
            'appService',
            'notificationService',
            'meal.food.Model',
            function (_, $scope, $stateParams, appSvc, notification, FoodModel) {

                var foodViewTitle = "Nutrition Information";
                appSvc.setTitle(foodViewTitle);

                //Идентификатор еды из URL
                var foodId = parseInt($stateParams.foodId);

                $scope.Model = new FoodModel();

                //Инициализация
                $scope.Init = function () {
                    if (!_.isNaN(foodId)) {
                        $scope.Model.Get(foodId).then(function () {
                            appSvc.setTitle("'" + $scope.Model.food.food_name + "' " + foodViewTitle);
                        });
                    }
                };
                $scope.Init();

                $scope.SwitchServing = function (ftServingId, servingId) {
                    $scope.currentServing = $scope.Model.SetCurrentServing(ftServingId, servingId);
                };

                $scope.IsServingsShow = function () {
                    return (
                        ($scope.Model.food.servings.serving) &&
                        ($scope.Model.food.servings.serving.length > 0));
                };
            }]);
})(angular, fitotrack);
