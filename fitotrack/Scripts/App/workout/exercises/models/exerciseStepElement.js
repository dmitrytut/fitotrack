/**
 * @fileOverview
 * exerciseStepElement.js
 * Model for Exercise step information.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.exercise.StepElement', function () {
        var ExerciseStep = function (data) {
            ng.extend(this, {
                title: undefined,
                description: undefined,
                order: undefined,
                imageUrl: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return ExerciseStep;
    });
})(angular, fitotrack);