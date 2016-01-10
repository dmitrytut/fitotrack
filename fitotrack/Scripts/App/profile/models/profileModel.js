
/**
 * @fileOverview
 * profileModel.js
 * Profile model implementation.
 */

(function (ng, app, moment) {
    'use strict';

    app.factory('profile.Model',
    [
        '$q',
        'appCfg',
        'utilsService',
        'profile.Service',
        'profile.model.Element',
        'profile.model.PhysicalInfoEx',
        'profile.model.Goal',
        'LoadingClass',
        'communicationService',
        'notificationService',
        function ($q, appCfg, utils, profileService, ProfileElement, PhysicalInfoEx, Goal, LoadingClass, commSvc, notification) {
            function ProfileModel(generalObj, goalObj, physicalInfoObj, credentialsObj, notificationsObj, privacyObj) {
                this.GENDER = appCfg.Gender;
                this.ACTIVITY_LEVEL = appCfg.ActivityLevel;
                this.PRIVACY_FLAGS = appCfg.PrivacyFlags;
                this.GOAL_TYPES = appCfg.GoalTypes;
                this.GOAL_INTENSITY = appCfg.GoalIntensity;
                //
                // Some routine is in proccess.
                //this.isBusy = false;
                //
                // Profile model.
                this.profile = new ProfileElement(generalObj, goalObj, physicalInfoObj, credentialsObj, notificationsObj, privacyObj);
                //
                // Extended physical info model.
                this.physicalInfoEx = new PhysicalInfoEx();
                //
                // Loading class.
                this.loadingClass = new LoadingClass();
            }

            //
            // Methods.
            ProfileModel.prototype = {
                //
                // Init profile goal object.
                initProfileGoal: function () {
                    var self = this;
                    self.profile.goal = new Goal();
                },
                //
                // Set data to the profile property.
                setProfileProp: function (propName, propData) {
                    var self = this;
                    if (propName && self.profile.hasOwnProperty(propName) && !utils.isUndefinedOrNull(propData)) {
                        utils.resolveReferences(propData);
                        // Copy only properties that exists in destination object. 
                        utils.copyOnlyExisting(propData, self.profile[propName]);
                    }
                },
                //
                // Get data from server utility method.
                getInfo: function (serviceFunc, objectToFill) {
                    var deferred = $q.defer();
                    var self = this;

                    self.loadingClass.busy();

                    // Получаем информацию с сервера
                    commSvc.request(
                        serviceFunc,
                        function (data) {
                            utils.copyOnlyExisting(data, objectToFill);
                        },
                        null,
                        null,
                        "Error occurred while retrieving profile data. Please, refresh page or try again later."
                    ).finally(function () {
                        self.loadingClass.done();
                    });

                    return deferred.promise;
                },
                //
                // Get user's profile data.
                getProfile: function () {
                    var self = this;

                    return self.getInfo(profileService.get(), self.profile);
                },
                //
                // Get user's general info.
                getGeneral: function () {
                    var self = this;
                    return self.getInfo(profileService.getGeneral(), self.profile.general);
                },
                //
                // Get user's physical info.
                getPhysicalInfo: function () {
                    var self = this;
                    return self.getInfo(profileService.getPhysicalInfo(), self.profile.physicalinfo);
                },
                //
                // Get user's extended physical info.
                getPhysicalInfoEx: function () {
                    var self = this;
                    return self.getInfo(profileService.getPhysicalInfoEx(), self.physicalInfoEx);
                },
                //
                // Get user's extended credentials info.
                getCredentials: function () {
                    var self = this;
                    return self.getInfo(profileService.getCredentials(), self.profile.credentials);
                },
                //
                // Get user's extended notifications info.
                getNotifications: function () {
                    var self = this;
                    return self.getInfo(profileService.getNotifications(), self.profile.notifications);
                },
                //
                // Get user's privacy info.
                getPrivacy: function () {
                    var self = this;
                    return self.getInfo(profileService.getPrivacy(), self.profile.privacy);
                },
                //
                // Get user's goal info.
                getGoalInfo: function () {
                    var self = this;
                    return self.getInfo(profileService.getGoalInfo(true), self.profileGoal);
                },
                //
                // Update user's general info.
                updateGeneral: function () {
                    var self = this;
                    var deferred = $q.defer();
                    var generalObj = self.profile.general;

                    profileService.updateGeneral(generalObj).then(
                        function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                // Update general information.
                                utils.copyOnlyExisting(data, self.profile.general);
                                notification.success("Profile was successfully updated.");
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Error occurred while updating profile. Please, refresh page or try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        });

                    return deferred.promise;
                },
                //
                // Update user's physical info.
                updatePhysicalInfo: function () {
                    var self = this;
                    var deferred = $q.defer();
                    var physicalInfoObj = self.profile.physicalInfo;

                    profileService.updatePhysicalInfo(physicalInfoObj).then(
                        function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                // Update physical information.
                                utils.copyOnlyExisting(data, self.profile.physicalInfo);
                                notification.success("Profile was successfully updated.");
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Error occurred while updating profile. Please, refresh page or try again later.",
                                "Error " + response.status
                                );
                            deferred.reject(response.status);
                        });

                    return deferred.promise;
                },
                //
                // Update user credentials.
                updateCredentials: function () {
                    var self = this;
                    var deferred = $q.defer();
                    var credentialsObj = self.profile.credentials;

                    profileService.updateCredentials(credentialsObj).then(
                        function (data) {
                            // Clear credential data.
                            self.profile.credentials.oldPassword = undefined;
                            self.profile.credentials.newPassword = undefined;
                            self.profile.credentials.confirmPassword = undefined;
                            notification.success("Password was successfully changed.");
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Error occurred while password changing. Please, refresh page or try again later.",
                                "Error " + response.status
                                );
                            deferred.reject(response.status);
                        });

                    return deferred.promise;
                },
                //
                // Update user's notifications info.
                updateNotifications: function () {
                    var self = this;
                    var deferred = $q.defer();

                    profileService.updateNotifications(self.profile.notifications).then(
                        function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                // Update notifications.
                                utils.copyOnlyExisting(data, self.profile.notifications);
                                notification.success("Profile was successfully updated.");
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Error occurred while updating profile. Please, refresh page or try again later.",
                                "Error " + response.status
                                );
                            deferred.reject(response.status);
                        });

                    return deferred.promise;
                },
                //
                // Update user's privacy info.
                updatePrivacy: function () {
                    var self = this;
                    var deferred = $q.defer();

                    profileService.updatePrivacy(self.profile.privacy).then(
                        function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                // Update privacy.
                                utils.copyOnlyExisting(data, self.profile.privacy);
                                notification.success("Profile was successfully updated.");
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Error occurred while updating profile. Please, refresh page or try again later.",
                                "Error " + response.status
                                );
                            deferred.reject(response.status);
                        });

                    return deferred.promise;
                }
            };

            return ProfileModel;
        }]);
})(angular, fitotrack, moment);