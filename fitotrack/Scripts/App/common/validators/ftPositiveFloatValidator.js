/**
 * @fileOverview
 * ftPositiveFloatValidator.js
 * Numeric validator.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftPositiveFloatValidator',
        [
            'validation.patterns',
            function (validationPatterns) {

                return {
                    require: 'ngModel',
                    link: function ($scope, element, attrs, ngModel) {
                        ngModel.$validators.positiveFloat = function (value) {
                            var result = true;
                            if (value && value.length > 0) {
                                result = validationPatterns.positiveFloatPattern.test(value);
                            }
                            return result;
                        };
                    }
                }
            }
        ]);

})(angular, fitotrack);