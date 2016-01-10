/**
 * @fileOverview
 * ftCompareToValidator.js
 * Equality of two fields values validation.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftCompareToValidator', function () {
        return {
            require: 'ngModel',
            scope: {
                compareTo: "=ftCompareToValidator"
            },
            link: function ($scope, element, attrs, ngModel) {
                ngModel.$validators.compareTo = function (value) {
                    return value === $scope.compareTo;
                };
                $scope.$watch("compareTo", function () {
                    ngModel.$validate();
                });
            }
        }
    });
})(angular, fitotrack);