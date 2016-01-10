
/**
 * @fileOverview
 * ftBlur.js
 * Directive for doing something on element blur event.
 * @param ftBlur - Callback that need to execute on blur event,
 * @param ftBlurIgnore - List of element id's divided by comma that will ignore if they will be related target.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftBlur', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('blur', function (e) {
                    // Split ignored element id's into array.
                    var ignoreList = (attr.ftBlurIgnore !== undefined) ? attr.ftBlurIgnore.replace(', ', ',').split(',') : [];

                    if (e.relatedTarget && ng.isDefined(e.relatedTarget.id)) {
                        for (var i = 0; i < ignoreList.length; i++) {
                            // If related terget is in ignore list than do nothing and return.
                            if (e.relatedTarget.id === ignoreList[i]) {
                                return;
                            }
                        }
                    }
                    // Apply on blur callback.
                    scope.$apply(function () {
                        scope.$eval(attr.ftBlur);
                    });
                });
            }
        };
    });
})(angular, fitotrack);