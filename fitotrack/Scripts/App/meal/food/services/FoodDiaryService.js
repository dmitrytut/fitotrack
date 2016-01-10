
//
//Food Diary service for communicating with server side

(function (ng, app) {
    'use strict';

    app.factory('meal.food.DiaryService',
            function (Restangular) {
                var foodDiaryEndpoint = 'fooddiary';
                var rest = Restangular.all(foodDiaryEndpoint);
                // Get food diary entries by date
                function getEntriesByDate(date) {
                    return rest.one('date', date).get();
                }
                // Save food diary entry
                function saveEntry(entry) {
                    return rest.post(entry);
                }
                // Edit food diary entry
                function editEntry(entryId, entry) {
                    return Restangular.one(foodDiaryEndpoint, entryId).customPUT(entry);
                }
                // Delete food from FT server
                function removeEntry(entryId) {
                    return Restangular.one(foodDiaryEndpoint, entryId).remove();
                } 
                // Get user goal information.
                function getGoalInfo(date) {
                    return Restangular.all('profile').one("goals", date).get();
                }
                // Get most popular food.
                function getMostPopularFood() {
                    return rest.one("popularfood").get();
                }

                var foodDiaryService = {
                    getEntriesByDate: getEntriesByDate,
                    saveEntry: saveEntry,
                    editEntry: editEntry,
                    removeEntry: removeEntry,
                    getGoalInfo: getGoalInfo,
                    getMostPopularFood: getMostPopularFood
                };
                return foodDiaryService;
            }
        );
})(angular, fitotrack);