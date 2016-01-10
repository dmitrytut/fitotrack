/**
 * @fileOverview
 * profilePrivacy.js
 * Model for user's Privacy information.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.model.Privacy', [function () {
        var privacy = function (data) {
            ng.extend(this, {
                privacyFlag: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return privacy;
    }]);
})(angular, fitotrack);