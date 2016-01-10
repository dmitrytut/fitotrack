/**
 * @fileOverview
 * exerciseEquipmentElement.js
 * Model for equipment used for Exercise.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.exercise.EquipmentElement', function () {
        var ExerciseEquipment = function (data) {
            ng.extend(this, {
                title: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return ExerciseEquipment;
    });
})(angular, fitotrack);