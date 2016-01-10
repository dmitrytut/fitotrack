
// 
// Application Controller

(function (ng, app) {
    "use strict";
    app.controller("AppCtrl",
        [
            '$scope',
            '$ftGlobal',
            'appService',
            'utilsService',
            'loadingService',
            function ($scope, $ftGlobal, appSvc, utils, loadingSvc, sessionModel) {

                $scope.App = appSvc;
                $scope.$ftGlobal = $ftGlobal;
                $scope.Session = $ftGlobal.session;

                // Init function.
                $scope.Init = function () {
                   // $ftGlobal.getSessionUserInfo();
                };

                // Set window title.
                $scope.appTitle = function () {
                    return appSvc.title();
                };

                // Watching for loading indicator.
                $scope.$watch(
                    function () {
                        return loadingSvc.isLoading();
                    },
                    function (value) {
                        $scope.isLoading = value;
                    });

                // Init Ctrl.
                $scope.Init();
            }
        ]);
})(angular, fitotrack);