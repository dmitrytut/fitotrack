/**
 * @fileOverview
 * profileCredentials.js
 * Model for user's Credentials information.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.model.Credentials', [function () {
        var credentials = function (data) {
            ng.extend(this, {
                email: undefined,
                oldPassword: undefined,
                newPassword: undefined,
                confirmPassword: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return credentials;
    }]);
})(angular, fitotrack);