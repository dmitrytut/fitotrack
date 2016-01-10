
/**
 * @fileOverview
 * globalService.js
 * Service for global information and entities.
 */

(function (ng, app) {
    'use strict';

    app.factory('$ftGlobal', 
        [
            '$q',
            '$rootScope',
            'utilsService',
            'session.Service',
            'communicationService',
            'session.model.UserInfoElement',
            function ($q, $rootScope, utils, sessionSvc, commSvc, UserInfoElement ) {
                
                //
                // Session.

                // Global session object.
                var session = {
                    userInfo: new UserInfoElement()
                };
                // Get user information for session object.
                var getSessionUserInfo = function () {
                    var self = this;
                    var deferred = $q.defer;
                    commSvc.request(
                        sessionSvc.getUserInfo(),
                        function (data) {
                            utils.copyOnlyExisting(data, self.session.userInfo);
                        },
                        null,
                        null,
                        "Error occurred while retrieving user information. Please, refresh page or try again later."
                    );
                    return deferred.promise;
                };
                // 
                // Global listner for profile changed event.
                $rootScope.$on("ftProfileChanged", function (event, profileData) {
                    if (utils.isUndefinedOrNull(profileData) || event.defaultPrevented) {
                        return;
                    }
                    // Update session user information.
                    utils.copyOnlyExisting(profileData, session.userInfo);
                });

                return {
                    //Session.
                    session: session,
                    getSessionUserInfo: getSessionUserInfo
                };
            }
        ]);
})(angular, fitotrack, toastr);