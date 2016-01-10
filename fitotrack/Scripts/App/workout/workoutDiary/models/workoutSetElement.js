/**
 * @fileOverview
 * workoutSetElement.js
 * Model for workout set information.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.diary.SetElement', function () {
        var WorkoutSet = function (data) {
            ng.extend(this, {
                workoutSetId: 0,
                order: 1,
                reps: 1,
                weight: 0,
                rest: 0,
                duration: 0,
                distance: 0,
                isCompleted: false,
                Internal: {
                    isEditMode: false
                }
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return WorkoutSet;
    });
})(angular, fitotrack);