
//
// Fitotrack App Interceptors

(function (ng, app) {
    "use strict";

    //
    // Error handling interceptor.
    app.factory("ft.ErrorHandler.Interceptor",
        [
            '$q',
            'notificationService',
            function ($q, notification) {
                return {
                    'response': function (response) {
                        //Will only be called for HTTP up to 300
                        return response;
                    },
                    'responseError': function (rejection) {
                        if (rejection) {
                            var errorStatus = "";
                            var errorMessage = "";

                            if (rejection.status !== null) {
                                errorStatus = rejection.status;
                            }
                            if (rejection.data != null &&
                                rejection.data.message !== null) {
                                errorMessage = rejection.data.message;
                            }

                            //Unauthorized access
                            if (errorStatus === 401) {
                                location.reload();
                            }

                            console.info(rejection);

                            notification.error(errorMessage, "Error " + errorStatus);
                        }
                        return $q.reject(rejection);
                    }
                };
            }
        ]);

    //
    // Cookie transformation interceptor.
    app.factory("ft.CookieTransform.Interceptor",
    [
        '$',
        '$q',
        'appCfg',
        function ($, $q, appCfg) {
            return {
                'request': function (request) {
                    // Update timezone offset cookie on every request.
                    var timezone_offset = (new Date().getTimezoneOffset()) * (-1);
                    $.cookie(appCfg.tzCookie, timezone_offset, { path: '/' });
                    return request;
                }
            };
        }
    ]);
})(angular, fitotrack);