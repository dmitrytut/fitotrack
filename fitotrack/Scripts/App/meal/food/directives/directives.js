
//
//Directives for Food

(function (ng, app) {
    'use strict';

    //
    // Food search results

    app.directive('ftFoodSearchResults', function () {
        var ftFoodSearchResults = {
            restrict: 'E',
            replace: false,
            templateUrl: '/tpl/partial?name=meal/food/food.search.results'
        };
        return ftFoodSearchResults;
    });
})(angular, fitotrack);