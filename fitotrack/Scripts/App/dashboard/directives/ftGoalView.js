
/**
 * @fileOverview
 * ftGoalView.js
 * Goal information view directive.
 * @param goalInfo - Goal information object ('profile.model.Goal').
 * @param currentWeight - Current weight of user.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftGoalView',
        [
            'appCfg',
            function (appCfg) {
                var ftGoalView = {
                    restrict: 'E',
                    templateUrl: '/tpl/partial?name=dashboard/ftGoalView/dashboard.ft.goal.view',
                    scope:{
                        goalInfo: '=',
                        currentWeight: '='
                    },
                    link: function (scope, element, attrs) {
                        if (!ng.isDefined(attrs.goalInfo)) {
                            throw new Error("'goal-info' attribute is required.");
                        }
                        if (!ng.isDefined(attrs.currentWeight)) {
                            throw new Error("'current-weight' attribute is required.");
                        }
                        //scope.goalInfo = scope.goalInfo();
                        //scope.currentWeight = scope.currentWeight();
                        // Check for goal information existing.
                        scope.isGoalExists = function () {
                            return scope.goalInfo!== null && ng.isDefined(scope.goalInfo) && scope.goalInfo.goalId;
                        };
                    }
                };
                return ftGoalView;
            }
        ]);
})(angular, fitotrack);