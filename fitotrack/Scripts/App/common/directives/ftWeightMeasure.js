
/**
 * @fileOverview
 * ftWeightMeasure.js
 * Directive for weight measure.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftWeightMeasure',
        [
            '$q',
            '$log',
            'utilsService',
            '_',
            'moment',
            'Restangular',
            function ($q, $log, utils, _, moment, Restangular) {
                var ftWeightMeasure = {
                    restrict: 'E',
                    templateUrl: '/tpl/partial?name=common/ftWeightMeasure/common.ft.weight.measure',
                    scope: {
                        isGraphicEnabled: "&",
                        dateFrom: "&",
                        dateTo: "&",
                        goalWeight: "&"
                    },
                    controller:
                        [
                            '$scope',
                            function ($scope) {
                                // Configure restangular service.
                                var rest = Restangular.all('profile');

                                // UserWeight object.
                                $scope.userWeightObj = function (data) {
                                    return ng.extend(this, {
                                        userWeightId: 0,
                                        weight: undefined,
                                        date: undefined
                                    });
                                };

                                // User Weightings.
                                $scope.userWeightings = [];

                                // Weight chart configuration.
                                $scope.weightChartConfig = {
                                    options: {
                                        chart: {
                                            type: 'line',
                                            height: 237
                                        },
                                        title: {
                                            text: ''
                                        },
                                        xAxis: {
                                            type: 'datetime',
                                            // One day.
                                            minTickInterval: 24 * 3600 * 1000
                                        },
                                        yAxis: {
                                            title: {
                                                enabled: false
                                            },
                                            plotLines: [{ 
                                                width: 1.5,
                                                dashStyle: 'LongDash',
                                                color: '#2fcc71',
                                                label: {
                                                    text: 'Goal weight',
                                                    align: 'left',
                                                    style: {
                                                        color: '#2fcc71',
                                                        fontSize: 'x-small'
                                                    }
                                                }
                                            }]
                                        },
                                        tooltip: {
                                            valueSuffix: ' kg'
                                        }
                                    },
                                    series: [
                                        {
                                            name: 'Weight',
                                            showInLegend: false,
                                            color: '#ff975e'
                                        }
                                    ],
                                    func: function (chart) {
                                        $scope.chartObj = chart;
                                    }
                                };

                                // Get weighting data.
                                // @param isLast - Get last weighting. If true, other parameters ignored.
                                // @param from - Get weightings from specified period. 'to' is parameter required. Unix timestamp. 
                                // @param to - Get weightings till specified period. 'from' is parameter required. Unix timestamp.
                                $scope.getWeightData = function (isLast, from, to) {
                                    var deferred = $q.defer();
                                    var endpointFunc = 'weighting';
                                    var weightingParams = {
                                        isLast: false,
                                        from: 0,
                                        to: 0
                                    };

                                    if ((typeof isLast !== 'undefined') && isLast == true) {
                                        weightingParams.isLast = true;
                                    } else {
                                        if ((typeof from !== 'undefined') &&
                                            (typeof to !== 'undefined')) {
                                            // From - To time range is set. Use it.
                                            weightingParams.from = from;
                                            weightingParams.to = to;
                                        } else {
                                            // Default promise. By default set interval from last week till today.
                                            weightingParams.from = $scope._lastWeekStart;
                                            weightingParams.to = $scope._today;
                                        }
                                    }
                                    var weightingFunc = rest.one(endpointFunc).get(weightingParams);

                                    // Take results.
                                    weightingFunc.then(function (data) {
                                        if (data) {
                                            $scope.userWeightings.length = 0;
                                            var weighting = [].concat(data);
                                            if (weighting.length > 0) {
                                                _.each(weighting, function (weight) {
                                                    var uwo = new $scope.userWeightObj();
                                                    utils.copyOnlyExisting(weight, uwo);
                                                    // Cut time from date.
                                                    uwo.date = moment(uwo.date).startOf('day').valueOf();
                                                    $scope.userWeightings.push(uwo);
                                                });
                                            }
                                        }
                                        deferred.resolve();
                                    },
                                    function (response) {
                                        $log.error("ftWeightMeasure: Something wrong with weightnings retrieving. " + 
                                            "Error: '" + response.status + "'");
                                        deferred.reject(response.status);
                                    });

                                    return deferred.promise;
                                };

                                // Save weighing on the server with adding it to the graphic.
                                $scope.saveWeight = function () {
                                    if ($scope._newWeight) {
                                        var newWeighingObj = new $scope.userWeightObj();
                                        newWeighingObj.weight = $scope._newWeight;
                                        newWeighingObj.date = moment().valueOf();
                                        // Send weight to the server.
                                        rest.one("weighting").customPOST(newWeighingObj).then(function (data) {
                                            if (data) {
                                                // Add data to the local weighing array.
                                                var uwo = new $scope.userWeightObj();
                                                utils.copyOnlyExisting(data, uwo);
                                                // Emit ftProfileChanged event and send new user weight.
                                                $scope.$emit('ftProfileChanged', {weight: uwo.weight});
                                                // Cut time from date.
                                                uwo.date = moment(uwo.date).startOf('day').valueOf();
                                                // Check if there is already weighting with uwo.date in the userWeightings
                                                var isChanged = false;
                                                _.each($scope.userWeightings, function (element, index, list) {
                                                    if (uwo.date == element.date) {
                                                        // If there is such weighting, then change it to the received weighting. 
                                                        element.date = uwo.date;
                                                        element.weight = uwo.weight;
                                                        isChanged = true;
                                                        return;
                                                    }
                                                });
                                                // If no, just push received weighting to userWeightings.
                                                if (!isChanged) {
                                                    $scope.userWeightings.push(uwo);
                                                }
                                                // Update graphic.
                                                $scope.updateWeightChart();
                                                // Clear newWeight.
                                                $scope._newWeight = undefined;
                                            }
                                        },
                                        function (response) {
                                            $log.error("ftWeightMeasure: Something wrong with weightnings saving. " +
                                            "Error: '" + response.status + "'");
                                        });
                                    }
                                    return;
                                };

                                // Initialize chart.
                                $scope.initWeightChart = function () {                                    
                                    // xAxis.
                                    $scope.weightChartConfig.options.xAxis.min = $scope._lastWeekStart;
                                    $scope.weightChartConfig.options.xAxis.max = $scope._tomorrow;
                                    // yAxis.
                                    if (ng.isDefined($scope._goalWeight)) {
                                        // Set goal plotLine value.
                                        if ($scope._goalWeight > 0) {
                                            $scope.weightChartConfig.options.yAxis.plotLines[0].value = $scope._goalWeight;
                                        }
                                        $scope.weightChartConfig.options.yAxis.min = $scope._goalWeight - 3;
                                        $scope.weightChartConfig.options.yAxis.max = $scope._goalWeight + 3;                                    } else {
                                        $scope.weightChartConfig.options.yAxis.min = 40;
                                        $scope.weightChartConfig.options.yAxis.max = 80;
                                    }
                                };

                                // Update chart.
                                $scope.updateWeightChart = function () {
                                    if ($scope.userWeightings.length > 0) {
                                        // Order by date.
                                        $scope.userWeightings = _.sortBy($scope.userWeightings, function (element, index, list) {
                                            return element.date;
                                        });
                                        var weighings = [];
                                        _.each($scope.userWeightings, function (element, index, list) {
                                            weighings.push([element.date, element.weight])
                                        });
                                        var maxWeight = _.max(weighings, function (elem) {
                                                return elem[1];
                                        })[1];
                                        var minWeight = _.min(weighings, function (elem) {
                                                return elem[1];
                                        })[1];
                                        // xAxis.
                                        $scope.chartObj.xAxis[0].setExtremes($scope._dateFrom, $scope._dateTo);
                                        // yAxis.
                                        $scope.chartObj.yAxis[0].setExtremes(minWeight - 3, maxWeight + 3);
                                        // Set graphic's series data.
                                        $scope.chartObj.series[0].setData(weighings);
                                    } else {
                                        // xAxis.
                                        $scope.chartObj.xAxis[0].setExtremes($scope._lastWeekStart, $scope._tomorrow);
                                        // yAxis.
                                        $scope.chartObj.yAxis[0].setExtremes(40, 80);
                                        // Data.
                                        $scope.chartObj.series[0].setData([]);
                                    }
                                };
                            }
                        ],
                    link: function (scope, element, attrs) {
                        scope._newWeight = undefined;
                        scope._goalWeight = undefined;
                        scope._isGraphicEnabled = true;
                        scope._today = moment().startOf('day').valueOf();
                        scope._tomorrow = moment().startOf('day').add(1, 'day').valueOf();
                        scope._lastWeekStart = moment().startOf('isoWeek').subtract(1, 'weeks').valueOf();
                        // If start date didn't set explicitly then set as 2 weeks starting from monday of previous week.
                        scope._dateFrom = scope._lastWeekStart;
                        scope._dateTo = scope._tomorrow;


                        if (ng.isDefined(attrs.isGraphicEnabled) && ng.isDefined(scope.isGraphicEnabled())) {
                            if (scope.isGraphicEnabled() == false) {
                                scope._isGraphicEnabled = false;
                            }
                        }
                        if (ng.isDefined(attrs.goalWeight) && ng.isDefined(scope.goalWeight())) {
                            var gw = scope.goalWeight();
                            scope._goalWeight = (typeof gw === "string") ? parseFloat(gw) : gw;
                        }
                        if (ng.isDefined(attrs.dateFrom) && ng.isDefined(scope.dateFrom())) {
                            // Check if dateFrom is a valid date.
                            if (Object.prototype.toString.call(d) === "[object Date]") {
                                // dateFrom is a date.
                                if (!isNaN(scope.dateFrom().valueOf())) {
                                    // dateFrom is valid.
                                    scope._dateFrom = scope.dateFrom();
                                }
                            }
                        }
                        if (ng.isDefined(attrs.dateTo) && ng.isDefined(scope.dateTo())) {
                            // Check if dateTo is a valid date.
                            if (Object.prototype.toString.call(d) === "[object Date]") {
                                // dateTo is a date.
                                if (!isNaN(scope.dateTo().valueOf())) {
                                    // dateTo is valid.
                                    scope._dateTo = scope.dateTo();
                                }
                            }
                        }

                        if (scope._isGraphicEnabled) {
                            // Initialise weight chart.
                            scope.initWeightChart();

                            // Load weighings from server.
                            scope.getWeightData(false).then();

                            // Watch for user weighings list changes.
                            scope.$watch('userWeightings', function (newValue, oldValue) {
                                if (newValue !== oldValue) {
                                    // Update weight chart.
                                    scope.updateWeightChart();
                                }
                            }, true);
                        }
                    }
                };
                return ftWeightMeasure;
            }
        ]);
})(angular, fitotrack);