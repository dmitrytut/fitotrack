
/**
 * @fileOverview
 * ftNutritionsDonutChart.js
 * Consumed nutritions donut chart directive.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftNutritionsDonutChart',
            function () {
                var ftNutritionsDonutChart = {
                    restrict: 'E',
                    templateUrl: '/tpl/partial?name=dashboard/ftNutritionsDonutChart/dashboard.ft.nutritions.donut.chart',
                    scope: {
                        nutritionInfo: '&'
                    },
                    controller: ['$scope', '_', function ($scope, _) {
                        
                        // Pie nutrition chart configuration.
                        $scope.donutChartConfig = {
                            options: {
                                chart: {
                                    type: 'pie',
                                    marginTop: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 115
                                },
                                tooltip: {
                                    formatter: function () {
                                        if ($scope.isTooltipEnabled) {
                                            return this.key + ': <b>' + this.point.weight + ' g</b>';
                                        } else {
                                            return false;
                                        }
                                    }
                                },
                                title: {
                                    text: ''
                                }
                            },
                            series: [{
                                name: 'Nutritions',
                                data: [],
                                dataLabels: {
                                    enabled: false
                                },
                                innerSize: 79
                            }],
                            func: function(chart) {
                                $scope.chartObj = chart;
                            }
                        };

                        // Is tooltip enabled.
                        $scope.isTooltipEnabled = true;

                        // Data template for chart.
                        $scope.nutritionInfoDataExists =
                            [
                                { id: 0, name: 'carb', weight: 0, y: 0, color: '#ff975e' },
                                { id: 1, name: 'fat', weight: 0, y: 0, color: '#f2c555' },
                                { id: 2, name: 'protein', weight: 0, y: 0, color: '#57b3f3' }
                            ];
                        $scope.nutritionInfoDataNotExists =
                            [
                                { y: 100, color: '#2fcc71' }
                            ];

                        // Calculate percents helper function.
                        $scope.percent = function (whole, part) {
                            return ((part * 100) / whole).toFixed(1);
                        };

                        // Calculate nutrition percentages.
                        $scope.getNutritionInfoPercentage = function () {
                            if ($scope.carbs > 0 ||
                                $scope.protein > 0 ||
                                $scope.fat > 0) {
                                $scope.sum = $scope.carbs + $scope.protein + $scope.fat;
                                $scope.carbsPercent = parseFloat($scope.percent($scope.sum, $scope.carbs));
                                $scope.proteinPercent = parseFloat($scope.percent($scope.sum, $scope.protein));
                                $scope.fatPercent = parseFloat($scope.percent($scope.sum, $scope.fat));
                            } else {
                                $scope.carbsPercent = $scope.proteinPercent = $scope.fatPercent = 0;
                            }
                            return;
                        };

                        // Initialize chart function.
                        $scope.initDonutChart = function () {
                            // Get percentage of nutrition elements.
                            $scope.getNutritionInfoPercentage();

                            if ($scope.carbsPercent > 0 ||
                                $scope.proteinPercent > 0 ||
                                $scope.fatPercent > 0) {
                                // Some of nutritions is exists. Init chart with data.
                                // Enable tooltip.
                                $scope.isTooltipEnabled = true;
                                // Set chart data to predefined template.
                                $scope.donutChartConfig.series[0].data = $scope.nutritionInfoDataExists;
                                // Set nutrition percentage to data in config.
                                _.each($scope.donutChartConfig.series[0].data, function(element, index, list){
                                    if (ng.isDefined(element.id)){
                                        switch (element.id)
                                        {
                                            case 0:
                                                element.weight = $scope.carbs;
                                                element.y = $scope.carbsPercent;
                                                break;
                                            case 1:
                                                element.weight = $scope.fat;
                                                element.y = $scope.fatPercent;
                                                break;
                                            case 2:
                                                element.weight = $scope.protein;
                                                element.y = $scope.proteinPercent;
                                                break;
                                        }
                                    }  
                                });
                            } else {
                                // Nutrition is empty or 0.
                                // Disable tooltip.
                                $scope.isTooltipEnabled = false;
                                // Set empty data template.
                                $scope.donutChartConfig.series[0].data = $scope.nutritionInfoDataNotExists;
                            }
                        };

                        $scope.onMouseOver = function (nutritionId) {
                            if (ng.isDefined($scope.chartObj)) {
                                var el = _.findWhere($scope.chartObj.series[0].data, { id: nutritionId });
                                if (ng.isDefined(el)) {
                                    el.setState('hover');
                                    $scope.chartObj.tooltip.refresh(el);
                                }
                            }
                        };

                        $scope.onMouseLeave = function (nutritionId) {
                            if (ng.isDefined($scope.chartObj)) {
                                var el = _.findWhere($scope.chartObj.series[0].data, { id: nutritionId });
                                if (ng.isDefined(el)) {
                                    el.setState();
                                    $scope.chartObj.tooltip.hide();
                                }
                            }
                        };
                    }],
                    link: function (scope, element, attrs) {
                        if (!ng.isDefined(attrs.nutritionInfo)){
                            throw new Error("'nutrition-info' attribute is required.");
                        }
                        scope.nutritionInfo = scope.nutritionInfo();

                        scope.carbs = scope.protein = scope.fat =
                            scope.carbsPercent = scope.proteinPercent = scope.fatPercent = 0;

                        if (scope.nutritionInfo !== null && ng.isDefined(scope.nutritionInfo)) {
                            if (scope.nutritionInfo.carbohydrate !== null &&
                                ng.isDefined(scope.nutritionInfo.carbohydrate)) {
                                scope.carbs = scope.nutritionInfo.carbohydrate;
                            }
                            if (scope.nutritionInfo.protein !== null &&
                                ng.isDefined(scope.nutritionInfo.protein)) {
                                scope.protein = scope.nutritionInfo.protein;
                            }
                            if (scope.nutritionInfo.fat !== null &&
                                ng.isDefined(scope.nutritionInfo.fat)) {
                                scope.fat = scope.nutritionInfo.fat;
                            }
                        }

                        // Initialize chart.
                        scope.initDonutChart();
                    }
                };
                return ftNutritionsDonutChart;
            });
})(angular, fitotrack);