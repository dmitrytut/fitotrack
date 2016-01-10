
/**
 * @fileOverview
 * ftGoalProgress.js
 * Goal progress bar directive.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftGoalProgress',
        [
            '$timeout',
            'appCfg',
            function ($timeout, appCfg) {
                var ftGoalProgress = {
                    restrict: 'E',
                    templateUrl: '/tpl/partial?name=profile/ftGoalProgress/profile.ft.goal.progress',
                    scope: {
                        goalType: '=',
                        startWeight: '=',
                        goalWeight: '=',
                        currentWeight: '=',
                        descriptionShow: '&'
                    },
                    controller: ['$scope', function ($scope) {
                        $scope.Internal = {
                            maxValue: 0,
                            currentValue: 0,
                            goalCompletedPercent: 0,
                            descriptionShow: false
                        };

                        $scope.setProgressBar = function () {
                            var startWeight = $scope.startWeight;
                            var goalWeight = $scope.goalWeight;
                            var currentWeight = $scope.currentWeight;

                            switch ($scope.goalType) {
                                case appCfg.GoalTypes.LoseWeight.value:
                                    // Set max value and current value for LoseWeight goal type.
                                    $scope.Internal.maxValue = (startWeight !== 0 || goalWeight !== 0 || startWeight > goalWeight) ?
                                        (startWeight - goalWeight).toFixed(1) : 0;
                                    $scope.Internal.currentValue = (startWeight !== 0 || currentWeight !== 0) ?
                                        (startWeight - currentWeight).toFixed(1) : 0;
                                    break;
                                case appCfg.GoalTypes.GainWeight.value:
                                    // Set max value and current value for GainWeight goal type.
                                    $scope.Internal.maxValue = (startWeight !== 0 || goalWeight !== 0 || goalWeight > startWeight) ?
                                        (goalWeight - startWeight).toFixed(1) : 0;
                                    $scope.Internal.currentValue = (startWeight !== 0 || currentWeight !== 0) ?
                                        ((startWeight - currentWeight) * -1).toFixed(1) : 0;
                                    break;
                                case appCfg.GoalTypes.MaintainWeight.value:
                                default:
                                    $scope.Internal.maxValue = $scope.Internal.currentValue = 0;
                            }

                            // Max value can't be less than zero.
                            if ($scope.Internal.maxValue < 0) {
                                $scope.Internal.maxValue = 0;
                            }

                            // Calculate goal completed percentage.
                            $scope.Internal.goalCompletedPercent = ($scope.Internal.maxValue !== 0) ?
                                (($scope.Internal.currentValue * 100) / $scope.Internal.maxValue).toFixed(1) : 0;
                        };
                    }],
                    link: function (scope, element, attrs) {
                        if (!ng.isDefined(attrs.goalType)){
                            throw new Error("'goal-type' attribute is required.");
                        }
                        if (!ng.isDefined(attrs.startWeight)){
                            throw new Error("'start-weight' attribute is required.");
                        }
                        if (!ng.isDefined(attrs.goalWeight)){
                            throw new Error("'goal-weight' attribute is required.");
                        }
                        if (!ng.isDefined(attrs.currentWeight)){
                            throw new Error("'current-weight' attribute is required.");
                        }

                        scope.Internal.descriptionShow = ng.isDefined(attrs.descriptionShow) ? scope.descriptionShow() : false;
                        scope.setProgressBar();

                        // Setting values for progress bar.
                        scope.$watchCollection('[startWeight, goalWeight, currentWeight]', function (newValues, oldValues) {
                            if (newValues[0] != oldValues[0] ||
                                newValues[1] != oldValues[1] ||
                                newValues[2] != oldValues[2]) {
                                scope.setProgressBar();
                            }
                        });
                    }
                };
                return ftGoalProgress;
            }
        ]);
})(angular, fitotrack);