/**
 * @fileOverview
 * profilePhysicalInfoEx.js
 * Model for extended user's Physical Information.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.model.PhysicalInfoEx',
        function () {
            return function(
                birthday,
                gender,
                height,
                weight,
                activityLevel) {
                this.birthday = birthday || undefined;
                this.gender = gender || undefined;
                this.height = height || undefined;
                this.weight = weight || undefined;
                this.activityLevel = activityLevel || undefined;
            };
        });
})(angular, fitotrack);