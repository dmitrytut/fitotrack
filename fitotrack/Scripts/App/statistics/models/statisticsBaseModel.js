/**
 * @fileOverview
 * statisticsBaseModel.js
 * Base model for statistics.
 */

(function (ng, app) {
    'use strict';

    app.factory('statistics.base.Model',
    [
        '_',
        'moment',
        '$q',
        'appCfg',
        'utilsService',
        'notificationService',
        function (
            _,
            moment,
            $q,
            appCfg,
            utils,
            notification) {
            function statisticsBaseModel() {
                // Set default chosen period.
                this.defaultChosenPeriod = {
                    startDate: moment().subtract(29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
                // Current chosen date range.
                this.chosenPeriod = this.defaultChosenPeriod;
            }

            statisticsBaseModel.prototype = {
                //
                // Check if date range valid.
                isPeriodValid: function(period){
                    return (!utils.isUndefinedOrNull(period) &&
                            !utils.isUndefinedOrNull(period.startDate) &&
                            !utils.isUndefinedOrNull(period.endDate) &&
                            period.startDate.isValid() &&
                            period.endDate.isValid());
                },
                //
                // Set diary date.
                setChosenPeriod: function (newPeriod) {
                    this.chosenPeriod = this.isPeriodValid(newPeriod) ? newPeriod : {};
                }
            };

            return statisticsBaseModel;
        }]);
})(angular, fitotrack);