/**
 * @fileOverview
 * profileNotifications.js
 * Model for user's Notifications information.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.model.Notifications', [function () {
        var notifications = function (data) {
            ng.extend(this, {
                pushNotifications: undefined,
                newsletter: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return notifications;
    }]);
})(angular, fitotrack);