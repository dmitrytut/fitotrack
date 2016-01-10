
/**
 * @fileOverview
 * ftOnPressEsc.js
 * Directive for doing something when user press Esc key.
 * Thanks to https://gist.github.com/EpokK for peace of code.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftOnPressEsc',
        [
            function () {
                return {
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        elem.bind("keydown keypress", function (event) {
                            if (event.which === 27) {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ftOnPressEsc);
                                });
                                event.preventDefault();
                            }
                        });
                    }
                };
            }
        ]);

})(angular, fitotrack);