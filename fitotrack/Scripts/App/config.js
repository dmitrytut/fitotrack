
/**
 * @fileOverview
 * config.js
 * Fitotrack App configuration.
 */


(function (ng, app) {
    "use strict";
    
    // Configure interceptors.
    app.config(
    [
        '$httpProvider',
        function ($httpProvider) {
            //
            // Interceptor for errors handling.
            $httpProvider.interceptors.push("ft.ErrorHandler.Interceptor");

            //
            // Interceptor for cookie transformation.
            $httpProvider.interceptors.push("ft.CookieTransform.Interceptor");
        }
    ]);

    // 
    // Routing configuration.
    app.config(['$locationProvider', function ($locationProvider) {
        // Use html5 Mode for routing (for modern browsers) and use !# for SEO purposes (for older browsers).
        $locationProvider.html5Mode(true).hashPrefix('!');
    }]);

    //
    // Restangular configuration.
    app.config(function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api');
    });
    
    //
    // Angular ui datepicker.
    app.config(function (datepickerConfig, datepickerPopupConfig) {
        datepickerConfig.showWeeks = false;
        // Starting from monday.
        datepickerConfig.startingDay = 1;
        // Remove button bar.
        datepickerPopupConfig.showButtonBar = false;
    });

})(angular, fitotrack);