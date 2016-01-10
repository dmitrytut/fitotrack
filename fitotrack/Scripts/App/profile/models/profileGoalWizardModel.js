
/**
 * @fileOverview
 * profileGoalWizardModel.js
 * Goal wizard model implementation.
 */

(function (ng, app) {
    'use strict';

    app.factory('profile.GoalWizard.Model',
    [
        '$q',
        'appCfg',
        'utilsService',
        'profile.Service',
        'profile.model.Element',
        'profile.model.PhysicalInfoEx',
        'profile.model.Goal',
        'communicationService',
        'notificationService',
        function ($q, appCfg, utils, profileService, ProfileElement, PhysicalInfoEx, Goal, commSvc, notification) {
            function ProfileGoalWizardModel() {
                //
                // Constants.
                this.GENDER = appCfg.Gender;
                this.ACTIVITY_LEVEL = appCfg.ActivityLevel;
                this.GOAL_TYPES = appCfg.GoalTypes;
                this.GOAL_INTENSITY = appCfg.GoalIntensity;
                //
                // Extended Physical Information Model.
                this.physicalInfoEx = new PhysicalInfoEx();
                // 
                // Initialize new goal object.
                this.initGoal();
            }

            //
            // Methods
            ProfileGoalWizardModel.prototype = {
                // 
                // Get information from server.
                getInfo: function (serviceFunc, objectToFill) {
                    //var deferred = $q.defer();
                    var self = this;

                    // Invoke request to server and handle the results
                    return commSvc.request(
                                serviceFunc,
                                function (data) {
                                    utils.copyOnlyExisting(data, objectToFill);
                                },
                                null,
                                null,
                                "Error occurred while retrieving profile data. Please, refresh page or try again later."
                            );
                },
                //
                // Get extended physical information.
                getPhysicalInfoEx: function () {
                    var self = this;
                    return self.getInfo(profileService.getPhysicalInfoEx(), self.physicalInfoEx);
                },
                //
                // Update extended physical information.
                updatePhysicalInfoEx: function () {
                    var self = this;
                    var deferred = $q.defer();
                    var physicalInfoExObj = self.physicalInfoEx;

                    profileService.updatePhysicalInfoEx(physicalInfoExObj).then(
                        function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                utils.copyOnlyExisting(data, self.physicalInfoEx);
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
                // Calculate recommended daily expenditure and additional goal parameters.
                calculateRde: function () {
                    //var deferred = $q.defer();
                    var self = this;
                    var rdeObj = {
                        physicalInfoEx: {},
                        goal: {}
                    };

                    //self.goal.startWeight = self.physicalInfoEx.weight;
                    self.goal.rde = undefined;
                    self.goal.goalId = undefined;
                    self.goal.estimatedFinishDate = undefined;
                    // Copy model's physicalInfoEx object to rdeObj.
                    ng.extend(rdeObj.physicalInfoEx, self.physicalInfoEx);
                    // Create a new Goal object and set values to the necessary properties.
                    rdeObj.goal = new Goal();
                    rdeObj.goal.goalType = self.goal.goalType;
                    rdeObj.goal.intensity = self.goal.intensity;
                    rdeObj.goal.goalWeight = self.goal.goalWeight;
                    ng.extend(rdeObj.goal, self.goal);

                    // Invoke request to server and handle the results
                    return commSvc.request(
                            profileService.calculateRDE(rdeObj),
                            function (data) {
                                // Copy new physicalInfoEx object if exists
                                if (data.hasOwnProperty('physicalInfoEx')) {
                                    utils.copyOnlyExisting(data.physicalInfoEx, self.physicalInfoEx);
                                }
                                // Copy new goal object if exists
                                if (data.hasOwnProperty('goal')) {
                                    utils.copyOnlyExisting(data.goal, self.goal);
                                }
                            },
                            null,
                            null,
                            "Error occurred while retrieving goal data. Please, refresh page or try again later."
                        );

                    //return deferred.promise;
                },
                //
                // Init goal object.
                initGoal: function () {
                    var self = this;
                    self.goal = new Goal();
                    //
                    // Set default values for the goal.
                    self.goal.goalType = 1;
                    self.goal.intensity = 1;
                }
            };

            return ProfileGoalWizardModel;
        }]);
})(angular, fitotrack);