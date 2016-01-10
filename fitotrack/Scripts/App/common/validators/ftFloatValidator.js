/**
 * @fileOverview
 * ftFloatValidator.js
 * Float validator.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftFloatValidator', 
        [
            'validation.patterns',
            function (validationPatterns) {

                return {
                    require: 'ngModel',
                    link: function ($scope, element, attrs, ngModel) {
                        ngModel.$validators.float = function (value) {
                            var result = true;
                            if (value && value.length > 0) {
                                result = validationPatterns.floatPattern.test(value);
                            }
                            return result;
                        };
                    }
                }
            }
        ]);

})(angular, fitotrack);