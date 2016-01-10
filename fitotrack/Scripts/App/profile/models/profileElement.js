/**
 * @fileOverview
 * profileElement.js
 * Model for profile information.
 */

(function (ng, app ) {
    'use strict';

    app.factory('profile.model.Element', 
        [
            'profile.model.General',
            'profile.model.Goal',
            'profile.model.PhysicalInfo',
            'profile.model.Credentials',
            'profile.model.Notifications',
            'profile.model.Privacy',
            function (General, Goal, PhysicalInfo, Credentials, Notifications, Privacy) {
                function ProfileElement(generalObj, goalObj, physicalInfoObj, credentialsObj, notificationsObj, privacyObj) {
                    this.general = generalObj || new General();
                    this.goal = goalObj || new Goal();
                    this.physicalInfo = physicalInfoObj || new PhysicalInfo();
                    this.credentials = credentialsObj || new Credentials();
                    this.notifications = notificationsObj || new Notifications();
                    this.privacy = privacyObj || new Privacy();
                }

                return ProfileElement;
            }]);
})(angular, fitotrack);