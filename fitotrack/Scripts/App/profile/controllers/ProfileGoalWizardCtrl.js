
/**
 * @fileOverview
 * ProfileGoalWizardCtrl.js
 * Controller for 'creating new goal' wizard.
 */

(function (ng, app) {
    'use strict';

    app.controller('profile.GoalWizard.Ctrl',
        [
            '$scope',
            '$rootScope',
            '$state',
            'utilsService',
            'physicalInfoEx',
            'profile.GoalWizard.Model',
            function ($scope, $rootScope, $state, utils, physicalInfoEx, ProfileGoalWizardModel) {

                // Create Goal Wizard Model.
                $scope.Model = new ProfileGoalWizardModel();
                // Fill the 'physicalInfoEx' with resolved object.
                if (!utils.isUndefinedOrNull(physicalInfoEx))
                {
                    utils.copyOnlyExisting(physicalInfoEx, $scope.Model.physicalInfoEx);
                }

                $scope.Internal = {
                    goalWeightMin: 0,
                    goalWeightMax: 1000,
                }

                // Forms.
                $scope.Forms = {
                    g_physicalinfoexForm: {},
                    g_goalparamsForm: {}
                };
                // Assosiate form with form object from template.
                $scope.setForm = function (name, form) {
                    if ($scope.Forms[name]) {
                        $scope.Forms[name] = form;
                    }
                };

                // Goal wizard steps.
                $scope.steps = ['g_physicalinfoex', 'g_goalparams', 'g_results'];
                $scope.step = 0;

                // 
                // Manipulations with steps.
                $scope.isFirstStep = function () {
                    return $scope.step === 0;
                };
                $scope.isPhysicalInfoExStep = function () {
                    return $scope.step === 0;
                };
                $scope.isGoalParamsStep = function () {
                    return $scope.step === 1;
                };
                $scope.isLastStep = function () {
                    return $scope.step === ($scope.steps.length - 1);
                };
                $scope.isCurrentStep = function (step) {
                    return $scope.step === step;
                };
                $scope.setCurrentStep = function (step) {
                    $scope.step = step;
                };
                $scope.getCurrentStep = function () {
                    return $scope.steps[$scope.step];
                };
                //
                // Buttons click handle.
                $scope.handlePrevious = function () {
                    if ($scope.isFirstStep()) {
                        $scope.exitModal(true);
                    } else {
                        $scope.step -= 1;
                    }
                };
                $scope.handleNext = function () {
                    if ($scope.isLastStep()) {
                        $scope.exitModal(false);
                    } else {
                        if ($scope.isPhysicalInfoExStep()) {
                            // Broadcast validation check event.
                            $scope.$broadcast('show-errors-check-validity');
                            if ($scope.Forms.g_physicalinfoexForm.$invalid) {
                                return;
                            }
                            // Update profile on server.
                            $scope.Model.updatePhysicalInfoEx().then(function () {
                                // Success.
                                // Broadcast extended physical activity changed event.
                                $rootScope.$broadcast("ftProfilePhysicalInfoExChanged", $scope.Model.physicalInfoEx);
                                // Broadcast profile changed event.
                                $rootScope.$broadcast("ftProfileChanged", $scope.Model.physicalInfoEx);
                                // Init goal weight with current.
                                $scope.Model.goal.goalWeight = $scope.Model.physicalInfoEx.weight;
                            });
                        }
                        if ($scope.isGoalParamsStep()) {
                            // Broadcast validation check event.
                            $scope.$broadcast('show-errors-check-validity');
                            if ($scope.Forms.g_goalparamsForm.$invalid) {
                                return;
                            }
                            $scope.calculateRde();
                        }
                        $scope.step += 1;
                    }
                };
                // Buttons label handling.
                $scope.getBackLabel = function () {
                    return ($scope.isFirstStep()) ? 'Cancel' : 'Back';
                };
                $scope.getNextLabel = function () {
                    if ($scope.isPhysicalInfoExStep()) {
                        return 'Yep, Correct';
                    }
                    if ($scope.isGoalParamsStep()) {
                        return 'Calculate';
                    }
                    if ($scope.isLastStep()){
                        return 'Ok';
                    }
                };

                // On target goal type changed function.
                $scope.targetGoalTypeChanged = function () {
                    if ($scope.Model.goal.goalType) {
                        var goalType = parseInt($scope.Model.goal.goalType);
                        switch (goalType) {
                            case $scope.Model.GOAL_TYPES.LoseWeight.value:
                                $scope.Internal.goalWeightMin = 0;
                                $scope.Internal.goalWeightMax = $scope.Model.physicalInfoEx.weight;
                                break;
                            case $scope.Model.GOAL_TYPES.MaintainWeight.value:
                                $scope.Internal.goalWeightMin = $scope.Model.physicalInfoEx.weight;
                                $scope.Internal.goalWeightMax = $scope.Model.physicalInfoEx.weight;
                                break;
                            case $scope.Model.GOAL_TYPES.GainWeight.value:
                                $scope.Internal.goalWeightMin = $scope.Model.physicalInfoEx.weight;
                                $scope.Internal.goalWeightMax = 1000;
                                break;
                        }
                    }
                };
                // Check goal weight.
                $scope.checkGoalWeight = function () {

                    // If get slim then not more than current
                    // If maintain then current
                    // If gain weight then more than current
                        
                    //if ($scope.Model.GOAL_TYPES.MaintainWeight.value == $scope.Model.goal.goalType) {
                    //    // Set goal weight to current.
                    //    $scope.Model.goal.goalWeight = $scope.Model.physicalInfoEx.weight;
                    //}
                };

                //
                // Calculate RDE.
                $scope.calculateRde = function () {
                    $scope.Model.calculateRde().then(function () {
                        // Broadcast physicalInfoEx changed event.
                        $rootScope.$broadcast("ftProfilePhysicalInfoExChanged", $scope.Model.physicalInfoEx);
                        // Broadcast goal changed event.
                        $rootScope.$broadcast("ftProfileGoalChanged", $scope.Model.goal);
                    });
                };
                
                // 
                // Exit from modal function.
                $scope.exitModal = function (isDismiss) {
                    // if dismiss is needed, then dismiss, else - close.
                    if (isDismiss) {
                        $scope.dismiss();
                    } else {
                        $scope.$close(true);
                    }
                };

                //
                // Dismiss the modal dialog.
                $scope.dismiss = function () {
                    $scope.$dismiss();
                };
            }
        ]);
})(angular, fitotrack);
