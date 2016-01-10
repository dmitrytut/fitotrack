/**
 * @fileOverview
 * statisticsAllModel.js
 * Base model for all statistics.
 */

(function (ng, app) {
    'use strict';

    app.factory('statistics.all.Model',
    [
        '_',
        'moment',
        '$q',
        'appCfg',
        'utilsService',
        'notificationService',
        'statistics.base.Model',
        function (
            _,
            moment,
            $q,
            appCfg,
            utils,
            notification,
            BaseModel) {
            function statisticsAllModel() {
                // Base model.
                this.base = new BaseModel();
                // Model name.
                this.modelName = "All";
                // Chart config.
                this.chartConfig = {
                    options: {
                        chart: {
                            type: 'line',
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            height: 400
                        }
                    },
                    title: {
                        text: ''
                    },

                    series: [
                        {
                            name: 'Tokyo',
                            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                        },
                        {
                            name: '',
                            data: [],
                            dataLabels: {
                                enabled: false
                            }
                        }
                    ],
                    func: function (chart) {
                        //$scope.chartObj = chart;
                    }
                };
            }

            statisticsAllModel.prototype = {
            };

            return statisticsAllModel;
        }]);
})(angular, fitotrack);