/**
 * @fileOverview
 * statisticsBodyModel.js
 * Base model for body statistics.
 */

(function (ng, app) {
    'use strict';

    app.factory('statistics.body.Model',
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
            function statisticsBodyModel() {
                // Base model.
                this.base = new BaseModel();
                // Model name.
                this.modelName = "Body";
                // Chart config.
                this.chartConfig = {
                    options: {
                        chart: {
                            type: 'column',
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
                            name: 'New York',
                            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
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

            statisticsBodyModel.prototype = {
            };

            return statisticsBodyModel;
        }]);
})(angular, fitotrack);