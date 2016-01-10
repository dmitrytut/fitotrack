
/**
 * @fileOverview
 * orderObjectBy.js
 * Filter for ordering objects by field. 
 */

(function (ng, app) {
    'use strict';

    app.filter('orderObjectBy', function () {
        return function (items, field, reverse) {
            var filtered = [];
            ng.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) {
                filtered.reverse();
            }
            return filtered;
        };
    });
})(angular, fitotrack);