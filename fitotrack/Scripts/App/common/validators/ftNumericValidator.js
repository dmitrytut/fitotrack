/**
 * @fileOverview
 * ftNumericValidator.js
 * Numeric validator.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftNumericValidator', 
        [
            'validation.patterns',
            function (validationPatterns) {

                return {
                    require: 'ngModel',
                    link: function ($scope, element, attrs, ngModel) {
                        ngModel.$validators.numeric = function (value) {
                            var result = true;
                            if (value && value.length > 0) {
                                result = validationPatterns.numericPattern.test(value);
                            }
                            return result;
                        };
                    }
                }
            }
        ]);

})(angular, fitotrack);