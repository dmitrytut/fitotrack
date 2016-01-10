/**
 * @fileOverview
 * profilePhysicalInfo.js
 * Model for user's Physical information.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.model.PhysicalInfo', [function () {
        var physicalInfo = function (data) {
            ng.extend(this, {
                height: undefined,
                weight: undefined,
                activityLevel: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return physicalInfo;
    }]);
})(angular, fitotrack);