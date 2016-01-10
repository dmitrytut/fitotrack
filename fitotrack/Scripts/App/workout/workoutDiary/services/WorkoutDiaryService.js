
/**
 * @fileOverview
 * WorkoutDiaryService.js
 * Workout diary service for communicating with server side.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.diary.Service',
            function (Restangular) {
                var workoutDiaryEndpoint = 'workoutdiary';
                var rest = Restangular.all(workoutDiaryEndpoint);
                // Get workout diary entries by date.
                function getEntriesByDate(date) {
                    return rest.one('date', date).get();
                }
                // Save workout diary entry.
                function saveEntry(entry) {
                    return rest.post(entry);
                }
                // Edit workout diary entry.
                function editEntry(entryId, entry) {
                    return Restangular.one(workoutDiaryEndpoint, entryId).customPUT(entry);
                }
                // Delete workout entry.
                function removeEntry(entryId) {
                    return Restangular.one(workoutDiaryEndpoint, entryId).remove();
                }
                // Delete workout set.
                function removeWorkoutSet(entryId) {
                    return rest.one('set', entryId).remove();
                }

                var workoutDiaryService = {
                    getEntriesByDate: getEntriesByDate,
                    saveEntry: saveEntry,
                    editEntry: editEntry,
                    removeEntry: removeEntry,
                    removeWorkoutSet: removeWorkoutSet
                };
                return workoutDiaryService;
            }
        );
})(angular, fitotrack);