
/*! profile.Ctrl.js 
Controller for profile*/

(function (ng, app) {
    'use strict';

    app.controller('profile.Ctrl',
        [
            '_',
            '$scope',
            '$rootScope',
            'appService',
            'utilsService',
            'profile.Model',
            'profileData',
            function (_, $scope, $rootScope, appSvc, utils, ProfileModel, profileData) {

                // Set window title.
                var profileTitle = "Profile";
                appSvc.setTitle(profileTitle);

                $scope.Model = new ProfileModel();

                // Storing profile data in model.
                if (profileData) {
                    utils.resolveReferences(profileData);
                    utils.copyOnlyExisting(profileData, $scope.Model.profile);
                }

                $scope.isBusy = false;
                $scope.Internal = {
                    goalProgress: 0
                };
                // Forms.
                $scope.Forms = {
                    generalInfoForm: {},
                    physicalInfoForm: {},
                    credentialsForm: {}
                };
                // Menu logic.
                $scope.menuItems = 
                    [
                        { 
                            name: "General",
                            state: "profile.general"
                        },
                        {
                            name: "Physical Info",
                            state: "profile.physicalinfo"
                        },
                        {
                            name: "Goals",
                            state: "profile.goals"
                        },
                        {
                            name: "Credentials",
                            state: "profile.credentials"
                        },
                        {
                            name: "Notifications",
                            state: "profile.notifications"
                        },
                        {
                            name: "Privacy",
                            state: "profile.privacy"
                        }
                    ];

                // Assosiate form with form object from template.
                $scope.setForm = function (name, form) {
                    if ($scope.Forms[name]) {
                        $scope.Forms[name] = form;
                    }
                };

                // Goal information existence.
                $scope.isGoalExists = function () {
                    return !utils.isUndefinedOrNull($scope.Model.profile.goal);
                };

                //
                // Get goal type title.
                $scope.getGoalTypeTitle = function () {
                    if (utils.isUndefinedOrNull($scope.Model.profile.goal) || 
                        utils.isUndefinedOrNull($scope.Model.profile.goal.goalType)) {
                        return undefined;
                    }

                    var goalType = _.find($scope.Model.GOAL_TYPES, function (item) {
                        return item.value == $scope.Model.profile.goal.goalType;
                    });
                    return goalType.title;
                };

                // Updating profile parts.
                $scope.UpdateGeneral = function () {
                    // Broadcast validation check event.
                    $scope.$broadcast('show-errors-check-validity');
                    if ($scope.Forms.generalInfoForm.$invalid) {
                        return;
                    }

                    $scope.Model.updateGeneral().then(function () {
                        // Emit profile changed event.
                        $scope.emitProfileChanged($scope.Model.profile.general);
                    });
                };
                $scope.UpdatePhysicalInfo = function () {
                    // Broadcast validation check event.
                    $scope.$broadcast('show-errors-check-validity');
                    if ($scope.Forms.physicalInfoForm.$invalid) {
                        return;
                    }

                    $scope.Model.updatePhysicalInfo().then(function () {
                        // Emit profile changed event.
                        $scope.emitProfileChanged($scope.Model.profile.physicalInfo);
                    });
                };
                $scope.UpdateCredentials = function () {
                    // Broadcast validation check event.
                    $scope.$broadcast('show-errors-check-validity');
                    if ($scope.Forms.credentialsForm.$invalid) {
                        return;
                    }

                    $scope.Model.updateCredentials();
                };
                $scope.UpdateNotifications = function () {
                    $scope.Model.updateNotifications();
                };
                $scope.UpdatePrivacy = function () {
                    $scope.Model.updatePrivacy();
                };

                // On user image succsessfully uploaded.
                $scope.onUserImageUpload = function () {
                    $scope.emitProfileChanged($scope.Model.profile.general);
                };

                // Emit ftProfileChanged event function.
                $scope.emitProfileChanged = function (data) {
                    $scope.$emit('ftProfileChanged', data);
                };

                // Watching for loading queue.
                $scope.$watch(
                    function () {
                        return $scope.Model.loadingClass.isLoading();
                    },
                    function (value) {
                        $scope.isBusy = value;
                    });

                // Change profile data on physicalInfoEx changed.
                $rootScope.$on("ftProfilePhysicalInfoExChanged", function (event, physicalInfoEx) {
                    if (utils.isUndefinedOrNull(physicalInfoEx) || event.defaultPrevented) {
                        return;
                    }

                    // Update General part.
                    utils.copyOnlyExisting(physicalInfoEx, $scope.Model.profile.general);
                    // Update PhysicalInfo part.
                    utils.copyOnlyExisting(physicalInfoEx, $scope.Model.profile.physicalInfo);
                });

                // Change profile goal on goal changed.
                $rootScope.$on("ftProfileGoalChanged", function (event, goal) {
                    if (utils.isUndefinedOrNull(goal) || event.defaultPrevented) {
                        return;
                    }

                    // If goal object undefined or null - initialize it.
                    if (utils.isUndefinedOrNull($scope.Model.profile.goal)) {
                        $scope.Model.initProfileGoal();
                    }
                    // Update Goal part.
                    utils.copyOnlyExisting(goal, $scope.Model.profile.goal);
                });
            }
        ]);
})(angular, fitotrack);
