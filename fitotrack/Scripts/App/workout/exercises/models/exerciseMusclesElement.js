/**
 * @fileOverview
 * exerciseMusclesElement.js
 * Model for Exercise muscles information.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.exercise.MusclesElement', function () {
        var ExerciseMuscles = function (data) {
            ng.extend(this, {
                title: undefined
                //cardio: undefined, 
                //full: undefined,
                //upperBody: undefined,
                //lowerBody: undefined,
                //neck: undefined,
                //shoulders: undefined,
                //chest: undefined,
                //biceps: undefined,
                //triceps: undefined,
                //forearms: undefined,
                //abs: undefined,
                //back: undefined,
                //glutes: undefined,
                //upperLegs: undefined,
                //lowerLegs: undefined,
                //traps: undefined,
                //delts: undefined,
                //upperAbs: undefined,
                //lowerAbs: undefined,
                //oblique: undefined,
                //lats: undefined,
                //middleBack: undefined,
                //lowerBack: undefined,
                //quadriceps: undefined,
                //hamstrings: undefined,
                //calves: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return ExerciseMuscles;
    });
})(angular, fitotrack);