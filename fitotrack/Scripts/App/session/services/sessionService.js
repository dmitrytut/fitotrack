
/**
 * @fileOverview
 * sessionService.js
 * Session service for communicating with server side.
 */

(function (ng, app) {
    'use strict';

    app.factory('session.Service',
        [
            'Restangular',
            'utilsService',
            function (Restangular, utils) {
                var profileEndpoint = 'profile';
                var rest = Restangular.all(profileEndpoint);
                var restAuth = Restangular.all('auth');
                var restWithoutPrefix = Restangular.withConfig(function (RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl('');
                });
                var restAccount = restWithoutPrefix.all('Account');

                //Get user profile information.
                function getUserInfo() {
                    return rest.one("userinfo").get();
                };
                //Set user status.
                function setUserStatus(statusStr) {
                    return rest.one("status").customPOST({ status: statusStr });
                };
                //Logout function.
                function logout() {
                    return restAuth.one("logout").post();
                };

                var sessionService = {
                    getUserInfo: getUserInfo,
                    setUserStatus: setUserStatus,
                    logout: logout
                };

                return sessionService;
            }
        ]);
})(angular, fitotrack);