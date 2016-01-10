
//
//Food service for communicating with server side

(function (ng, app) {
    'use strict';

    app.factory('meal.food.Service',
            function (Restangular) {
                var rest = Restangular.all('food');
                //Get food from FS server
                function get(id) {
                    return rest.one('getfsFood', id).get();
                }
                //Save food to FT server
                function save(foodElement) {
                    return rest.post(foodElement);
                }
                //Update food on FT server
                function update(foodElement) {
                    return 'undefined';
                }
                //Delete food from FT server
                function remove(id) {
                    return 'undefined';
                }
                //Search for food
                function search(query, pageNum, pageSize) {
                    return rest.one('search').get({q:query, pn:pageNum, ps:pageSize});
                }
                //Autocomplete for food
                function autocomplete(query) {
                    return rest.one('autocomplete', query).get().then(function (response) {
                        return response.suggestion;
                    });
                }
                var foodService = {
                    get: get,
                    save: save,
                    update: update,
                    remove: remove,
                    search: search,
                    autocomplete: autocomplete
                };
                return foodService;
            }
        );
})(angular, fitotrack);