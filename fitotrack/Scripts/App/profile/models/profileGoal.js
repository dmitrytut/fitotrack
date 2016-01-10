/**
 * @fileOverview
 * profileGoal.js
 * Model for user's Goal Information.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.model.Goal',
        function () {
            var Goal = function (data) {
                ng.extend(this, {
                    //
                    // Goal Id.
                    goalId: 0,
                    //
                    // Goal type.
                    goalType: undefined,
                    //
                    // Goal Intensity.
                    intensity: undefined,
                    //
                    // User's weight at goal creation.
                    startWeight: undefined,
                    //
                    // User's goal weight.
                    goalWeight: undefined,
                    //
                    // Recommended daily expenditure (kcal).
                    rde: undefined,
                    //
                    // Estimated goal finish date.
                    estimatedFinishDate: undefined,
                    //
                    // Goal creation time.
                    creationTime: undefined
                });
                if (data) {
                    ng.extend(this, data);
                }
            };
            return Goal;

            //return function (
            //    goalId,
            //    goalType,
            //    intensity,
            //    startWeight,
            //    goalWeight,
            //    rde,
            //    estimatedFinishDate,
            //    creationTime) {
            //    //
            //    // Goal Id
            //    this.goalId = goalId || 0;
            //    //
            //    // Goal type
            //    this.goalType = goalType || undefined;
            //    //
            //    // Goal Intensity
            //    this.intensity = intensity || undefined;
            //    //
            //    // User's weight at goal creation
            //    this.startWeight = startWeight || undefined;
            //    //
            //    // User's goal weight
            //    this.goalWeight = goalWeight || undefined;
            //    //
            //    // Recommended daily expenditure (kcal)
            //    this.rde = rde || undefined;
            //    //
            //    // Estimated goal finish date
            //    this.estimatedFinishDate = estimatedFinishDate || undefined;
            //    //
            //    // Goal creation time
            //    this.creationTime = creationTime || undefined;
            //};
        });
})(angular, fitotrack);