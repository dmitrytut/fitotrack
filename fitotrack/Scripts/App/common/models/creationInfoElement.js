/**
 * @fileOverview
 * creationInfoElement.js
 * Model for CreationInfo Element.
 */

(function (ng, app) {
    'use strict';

    app.factory('common.creationInfo.Element', function () {
        var CreationInfo = function (data) {
            ng.extend(this, {
                creationTime: undefined,
                lastModifiedTime: undefined
            });
            if (data) {
                ng.extend(this, data);
            }
        };
        return CreationInfo;
    });
})(angular, fitotrack);