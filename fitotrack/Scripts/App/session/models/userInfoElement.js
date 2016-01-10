/**
 * @fileOverview
 * userInfoElement.js
 * Model for user's profile information.
 */

(function (ng, app) {
    'use strict';

    app.factory('session.model.UserInfoElement',
        [
            'appCfg',
            function (appCfg) {
        var userInfoElement = function (data) {
            ng.extend(this, {
                userImagePath: undefined,
                userName: undefined,
                fullName: undefined,
                birthday: undefined,
                gender: undefined,
                location: undefined,
                weight: undefined,
                height: undefined,
                status: undefined,
                isStatusExists: function(){
                    var self = this;
                    return self.status && self.status.length > 0;
                },
                isUserImagePathExists: function () {
                    var self = this;
                    return self.userImagePath != null && ng.isDefined(self.userImagePath) && self.userImagePath.length > 0;
                },
                isMale: function () {
                    var self = this;
                    return self.gender == appCfg.Gender.Male;
                },
                isFemale: function () {
                    var self = this;
                    return self.gender == appCfg.Gender.Female;
                },
                ageStr: function () {
                    var self = this;
                    return moment(self.birthday).fromNow(true);
                }
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return userInfoElement;
    }]);
})(angular, fitotrack);