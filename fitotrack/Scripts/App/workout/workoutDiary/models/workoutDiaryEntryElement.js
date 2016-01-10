
/**
 * @fileOverview
 * workoutDiaryEntryElement.js
 * Model for workout diary entry element.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.diary.EntryElement',
        [
            'common.creationInfo.Element',
            'workout.exercise.Element',
            'workout.diary.SetElement',
            'utilsService',
            function (CreationInfo, ExerciseElement, ExerciseSetElement, utils) {
                var WorkoutDiaryEntry = function (data) {
                    ng.extend(this, {
                        Internal: { 
                            isEditMode: false
                        },
                        workoutDiaryEntryId: undefined,
                        exercise: new ExerciseElement(),
                        date: undefined,
                        sets: [new ExerciseSetElement()],
                        burnedCalories: undefined,
                        creationInfo: new CreationInfo()
                    });
                    if (data) {
                        ng.extend(this, data);
                    }
                };
                return WorkoutDiaryEntry;
            }]);
})(angular, fitotrack);