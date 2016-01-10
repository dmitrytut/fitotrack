

/*! MealFoodSearchCtrl.js 
Controller for food search*/

(function (ng, app) {
    'use strict';

    app.controller('meal.food.SearchCtrl',
        [
            '_',
            '$scope',
            '$stateParams',
            '$location',
            'notificationService',
            'meal.food.Service',
            'meal.food.SearchModel',
            function (_, $scope, $stateParams, $location, notification, foodService, foodSearchModel) {

                //Внутреннее обозначение страниц
                $scope.Internal =
                {
                    pageSizes: [10, 25, 50]
                };

                //Модель
                $scope.Model = foodSearchModel;

                //Инициализация
                $scope.Init = function () {

                    //Очищаем модель
                    //$scope.Model.init();

                    if ($stateParams.query) {
                        //Поиск, если есть параметр query в URL
                        $scope.Model.query = $stateParams.query;
                        //if ($routeParams.pageNum) {
                        //    var pN = parseInt($routeParams.pageNum);
                        //    if (!_.isNaN(pN)) {
                        //        $scope.Model.pageNum = pN;
                        //    }
                        //}
                        //if ($routeParams.pageSize) {
                        //    var pS = parseInt($routeParams.pageSize);
                        //    if (!_.isNaN(pS)) {
                        //        $scope.Model.pageSize = pS;
                        //    }
                        //}
                        $scope.FoodSearch(/*$scope.Model.pageNum, $scope.Model.pageSize*/);
                    }
                };

                //Поиск
                $scope.FoodSearch = function (/*pN, pS*/) {
                    //$scope.Model.pageNum = pN || 0;
                    //$scope.Model.pageSize = pS || 10;
                    $scope.Model.pageNum = 0;
                    $scope.Model.search();
                };

                //Смена страницы
                $scope.ChangePage = function (page) {
                    $scope.Model.pageNum = page - 1;
                    $scope.Model.search();
                };

                //Из-за сложности ответа от FS нужно делать проверку на наличие результатов
                $scope.SearchResShow = function () {
                    return $scope.Model.IsSearchResShow();
                };

                //Автозаполнение еды 
                $scope.Autocomplete = function (val) {
                    return foodService.autocomplete(val);
                };

                $scope.Init();
            }]);
})(angular, fitotrack);
