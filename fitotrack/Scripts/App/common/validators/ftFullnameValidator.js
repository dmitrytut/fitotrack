/**
 * @fileOverview
 * ftFullnameValidator.js
 * Fullname validator.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftFullnameValidator', 
        [
            'validation.patterns',
            function (validationPatterns) {

                return {
                    require: 'ngModel',
                    link: function ($scope, element, attrs, ngModel) {
                        ngModel.$validators.fullname = function (value) {
                            return validationPatterns.fullnamePattern.test(value);
                        };
                    }
                }
            }
        ]);

})(angular, fitotrack);