
/**
 * @fileOverview
 * profileService.js
 * Profile service for communicating with server side.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.Service',
        [
            '$',
            'Restangular',
            'utilsService',
            function ($, Restangular, utils) {
                var rest = Restangular.all('profile');
                var restAuth = Restangular.all('Auth');
                //Get profile info.
                function get() {
                    return rest.customGET("");
                }
                //Update general information.
                function updateGeneral(generalObj) {
                    return rest.one("general").customPUT(generalObj);
                }
                //Update physical information.
                function updatePhysicalInfo(physicalInfoObj) {
                    return rest.one("physicalinfo").customPUT(physicalInfoObj);
                }
                //Update extended physical information.
                function updatePhysicalInfoEx(physicalInfoExObj) {
                    return rest.one("physicalinfoex").customPUT(physicalInfoExObj);
                }
                //Update credentials.
                function updateCredentials(credentialsObj) {
                    return restAuth.one("ChangePassword").customPOST(credentialsObj);
                }
                //Update notifications.
                function updateNotifications(notificationsObj) {
                    return rest.one("notifications").customPUT(notificationsObj);
                }
                //Update privacy info.
                function updatePrivacy(privacyObj) {
                    return rest.one("privacy").customPUT(privacyObj);
                }
                //Get user general information.
                function getGeneral() {
                    return rest.one("general").get();
                }
                //Get user physical information.
                function getPhysicalInfo() {
                    return rest.one("physicalinfo").get();
                }
                //Get user credentials information.
                function getCredentials() {
                    return rest.one("credentials").get();
                }
                //Get user notifications information.
                function getNotifications() {
                    return rest.one("notifications").get();
                }
                //Get user privacy information.
                function getPrivacy() {
                    return rest.one("privacy").get();
                }
                //Get extended user's physical information.
                function getPhysicalInfoEx() {
                    return rest.one("physicalinfoex").get();
                }
                //Get user goal information.
                function getGoalInfo(isLast) {
                    if (!ng.isDefined(isLast) || isLast === null) {
                        isLast = true;
                    }
                    return rest.one("goals", isLast).get();
                }
                //Get user Weighting. True - Last entry. False - All entries.
                function getWeight(isLast) {
                    if (utils.isUndefinedOrNull(isLast)) {
                        isLast = true;
                    }
                    return rest.one("weighting", isLast).get();
                }
                //Calculate Recommended Daily Expenditure.
                function calculateRDE(rdeObj) {
                    return rest.customPOST(rdeObj, "goals");
                }
                //Save user Weighting.
                function saveWeight(userWeightObj) {
                    return rest.one("weighting").customPOST(userWeightObj);
                }
                var profileService = {
                    get: get,
                    getGeneral: getGeneral,
                    getGoalInfo: getGoalInfo,
                    getPhysicalInfo: getPhysicalInfo,
                    getPhysicalInfoEx: getPhysicalInfoEx,
                    getCredentials: getCredentials,
                    getNotifications: getNotifications,
                    getPrivacy: getPrivacy,
                    getWeight: getWeight,
                    updateGeneral: updateGeneral,
                    updatePhysicalInfo: updatePhysicalInfo,
                    updatePhysicalInfoEx: updatePhysicalInfoEx,
                    updateCredentials: updateCredentials,
                    updateNotifications: updateNotifications,
                    updatePrivacy: updatePrivacy,
                    calculateRDE: calculateRDE,
                    saveWeight: saveWeight
                };
                return profileService;
            }
        ]);
})(angular, fitotrack);