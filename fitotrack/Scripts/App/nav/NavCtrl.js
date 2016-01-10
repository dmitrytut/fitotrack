/**
 * @fileOverview
 * NavCtrl.js
 * Navigation controller. 
 */

(function (ng, app) {
    'use strict';

    app.controller('nav.Ctrl',
        [
            '$scope',
            '$state',
            function ($scope, $state) {
                // If includes state, than active.
                $scope.isActive = function (state) {
                    return $state.includes(state);
                }
            }]);
})(angular, fitotrack);


