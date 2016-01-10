/**
 * @fileOverview
 * ftPositiveNumericValidator.js
 * Numeric validator.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftPositiveNumericValidator',
        [
            'validation.patterns',
            function (validationPatterns) {

                return {
                    require: 'ngModel',
                    link: function ($scope, element, attrs, ngModel) {
                        ngModel.$validators.positiveNumeric = function (value) {
                            var result = true;
                            if (value && value.length > 0) {
                                result = validationPatterns.positiveNumericPattern.test(value);
                            }
                            return result;
                        };
                    }
                }
            }
        ]);

})(angular, fitotrack);