/**
 * @fileOverview
 * validationPatterns.js
 * Patterns for validation.
 */

(function (ng, app) {
    'use strict';

    app.constant('validation.patterns', {
        // Numeric values.
        numericPattern: /^\-?\d*$/,
        // Positive numeric values.
        positiveNumericPattern: /^\d*$/,
        // Numeric values with float dot and comma (. and ,).
        floatPattern: /^\-?\d+((\.|\,)\d+)?$/,
        // Positive numeric values with float dot and comma (. and ,).
        positiveFloatPattern: /^\d+((\.|\,)\d+)?$/
    });

})(angular, fitotrack);