/**
 * @fileOverview
 * ftGoalWeightValidator.js
 * Goal weight validator. Goal weight is positive float number. 
 * Validation depends on goal type and current weight of user. 
 * If goal type is 'Get Slim', then goal weight must be lower than current user weight, 
 * if goal type is 'Maintaining weight', then goal weight must be equal to current user weight, 
 * if goal type is 'Gain weight', then goal weight must be greater than current user weight.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftGoalWeightValidator',
        [
            'appCfg',
            'validation.patterns',
            function (appCfg, validationPatterns) {
                return {
                    require: 'ngModel',
                    link: function ($scope, element, attrs, ngModel) {
                        ngModel.$validators.goalweight = function (value) {
                            var result = false;

                            // Goal weight must be a positive float number.
                            if (validationPatterns.positiveFloatPattern.test(value)) {
                                // Replace comma with point.
                                var goalWeight = parseFloat(value.replace(',', '.'));
                                var goalType = attrs.ftGoalWeightValidator.goalType;
                                var currentWeight = attrs.ftGoalWeightValidator.currentWeight;
                                if (goalType && currentWeight && validationPatterns.positiveFloatPattern.test(currentWeight)) {
                                    goalType = parseInt(goalType);
                                    currentWeight = parseFloat(currentWeight.replace(',', '.'));
                                    switch (goalType) {
                                        case appCfg.GoalTypes.LoseWeight.value:
                                            break;
                                        case appCfg.GoalTypes.MaintainWeight.value:
                                            break;
                                        case appCfg.GainWeight.LoseWeight.value:
                                            break;
                                    };
                                }
                            }
                            return result;
                        };
                    }
                }
            }
        ]);

})(angular, fitotrack);