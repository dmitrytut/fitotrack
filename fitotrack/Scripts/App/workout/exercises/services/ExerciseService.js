
/**
 * @fileOverview
 * exerciseService.js
 * Exercise service for communicating with server side.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.exercise.Service',
            function (Restangular) {
                var rest = Restangular.all('exercise');
                //Get exercise from FS server
                function get(id) {
                    return rest.get(id);
                }
                //Save exercise to FT server
                function save(exerciseElement) {
                    return 'udefined';
                }
                //Update exercise on FT server
                function update(exerciseElement) {
                    return 'undefined';
                }
                //Delete exercise from FT server
                function remove(id) {
                    return 'undefined';
                }
                //Search exercises
                function search(query, pageNum, pageSize) {
                    return rest.one('search').get({ q: query, pn: pageNum, ps: pageSize });
                }
                //Autocomplete for exercises
                function autocomplete(query) {
                    return rest.one('autocomplete').one(query).get().then(function (response) {
                        return response.suggestion;
                    });
                }

                var exerciseService = {
                    get: get,
                    save: save,
                    update: update,
                    remove: remove,
                    autocomplete: autocomplete,
                    search: search
                };
                return exerciseService;
            }
        );
})(angular, fitotrack);