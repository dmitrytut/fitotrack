
/**
 * @fileOverview
 * ftOnPressEnter.js
 * Directive for doing something when user press Enter key.
 * Thanks to https://gist.github.com/EpokK for peace of code.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftOnPressEnter',
        [
            function () {
                return {
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        elem.bind("keydown keypress", function (event) {
                            if (event.which === 13) {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ftOnPressEnter);
                                });
                                event.preventDefault();
                            }
                        });
                    }
                };
            }
        ]);

})(angular, fitotrack);