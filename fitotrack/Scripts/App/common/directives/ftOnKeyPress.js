
/**
 * @fileOverview
 * ftOnKeyPress.js
 * Directive for doing something when user press key of specific key code.
 * Thanks to https://gist.github.com/EpokK for peace of code. 
 * 
 * Key code attribute 'ft-key-code' should be set explicitly on element. If no Enter(13) code is used.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftOnKeyPress',
        [
            function () {
                return {
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        var keyCode = 13;
                        if (ng.isDefined(attrs.ftKeyCode)) {
                            keyCode = scope.$eval(attrs.ftKeyCode);
                        }
                        elem.bind("keydown keypress", function (event) {
                            if (event.which === keyCode) {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ftOnKeyPress);
                                });
                                event.preventDefault();
                            }
                        });
                    }
                };
            }
        ]);

})(angular, fitotrack);