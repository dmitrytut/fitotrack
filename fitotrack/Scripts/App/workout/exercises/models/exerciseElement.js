/**
 * @fileOverview
 * exerciseElement.js
 * Model for Exercise information.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.exercise.Element', [
        'workout.exercise.StepElement',
        'workout.exercise.MusclesElement',
        'workout.exercise.EquipmentElement',
        function (StepElement, MusclesElement, EquipmentElement) {
        var Exercise = function (data) {
            ng.extend(this, {
                exerciseId: undefined,
                complexity: undefined,
                title: undefined,
                description: undefined,
                steps: [new StepElement()],
                imageUrl: undefined,
                videoUrl: undefined,
                type:undefined,
                mainMuscles: [new MusclesElement()],
                canBeDoneAtHome: undefined,
                met: undefined,
                equipment: [new EquipmentElement()],
                creationTime:undefined,
                createUserId: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return Exercise;
    }]);
})(angular, fitotrack);