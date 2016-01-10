
/**
 * @fileOverview
 * appSvc.js
 * Fitotrack app service.
 */

(function (ng, app, toastr) {
    'use strict';

    app.factory('appService',
        [
            'appCfg',
            'utilsService',
            function (appCfg, utils) {
                var _title;

                function setTitle(newTitle, fixedTitlePart, fixedTitlePartPosition, titleSeparator) {
                    if (utils.isUndefinedOrNull(newTitle)) {
                        newTitle = appCfg.defaultTitle;
                    }
                    if (utils.isUndefinedOrNull(fixedTitlePart)) {
                        fixedTitlePart = appCfg.defaultFixedTitlePart;
                    }
                    if (fixedTitlePartPosition !== 0 &&
                        fixedTitlePartPosition !== 1) {
                        fixedTitlePartPosition = appCfg.defaultFixedTitlePartPosition;
                    }
                    if (utils.isUndefinedOrNull(titleSeparator)) {
                        titleSeparator = appCfg.defaultTitleSeparator;
                    }
                    _title = (fixedTitlePartPosition === 0) ?
                        // Fixed part at the beginning
                        (fixedTitlePart + titleSeparator + newTitle) :
                        // Fixed part at the ending
                        (newTitle + titleSeparator + fixedTitlePart);
                }
                function title() {
                    return _title;
                }

                return {
                    setTitle: setTitle,
                    title: title
                };
            }
        ]);
})(angular, fitotrack, toastr);