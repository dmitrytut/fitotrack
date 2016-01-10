
/**
 * @fileOverview
 * ftAccountLogout.js
 * Logout directive.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftAccountLogout', [
        '$location',
       'session.Service',
        function ($location, sessionService) {
        var ftAccountLogout = {
            restrict: 'E',
            replace: true,
            scope: {},
            template: "<a role='menuitem' tabindex='-1' href=''>Logout</a>",
            link: function ($scope, elem, attrs) {
                elem.bind('click', function () {
                    sessionService.logout().then(function () {
                        // Logout successfull. Redirect to root.
                        document.location.href = "/";
                    });
                });
            }
        };
        return ftAccountLogout;
    }]);
})(angular, fitotrack);