/**
 * @fileOverview
 * profileGeneral.js
 * Model for user's General information.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.model.General', [function () {
        var general = function (data) {
            ng.extend(this, {
                userImagePath: undefined,
                userName: undefined,
                fullName: undefined,
                birthday: undefined,
                gender: undefined,
                location: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return general;
    }]);
})(angular, fitotrack);