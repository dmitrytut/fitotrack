
/**
 * @fileOverview
 * ftDateRangePicker.js
 * Daterange picker directive.
 * @param startPeriod - momentjs date object.
 * @param finishPeriod - momentjs date object.
 * @param minDate - flag that 'selected' parameter is timestamp.
 * @param onDateSelect - On date selected callback.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftDateRangePicker',
        [
            'moment',
            'appCfg',
            function (moments, appCfg) {
                var ftDateRangePicker = {
                    restrict: 'E',
                    templateUrl: '/tpl/partial?name=common/ftCalendar/common.ft.calendar',
                    scope:{
                        selected: '=',
                        isTimestamp: '@',
                        onDateSelect: '&'
                    },
                    controller: ['$scope', function ($scope) {

                        $scope.Internal = {
                            isStartPeriodOpened: false,
                            datepickerOptions: {
                                maxDate: new Date()
                            }
                        };

                        // Remove time from date.
                        $scope.removeTime = function (date) {
                            return date.isoWeekday(1).hour(0).minute(0).second(0).millisecond(0);
                        };

                        // Build month array.
                        $scope.buildMonth = function (start, month) {
                            $scope.weeks = [];
                            var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
                            while (!done) {
                                $scope.weeks.push({ days: $scope.buildWeek(date.clone(), month) });
                                date.add(1, "w");
                                done = count++ > 2 && monthIndex !== date.month();
                                monthIndex = date.month();
                            }
                        };

                        // Build week array.
                        $scope.buildWeek = function (date, month) {
                            var days = [];
                            for (var i = 0; i < 7; i++) {
                                days.push({
                                    name: date.format("dd").substring(0, 1),
                                    number: date.date(),
                                    isCurrentMonth: date.month() === month.month(),
                                    isToday: date.isSame(new Date(), "day"),
                                    isWeekend: (date.isoWeekday() == 6) || (date.isoWeekday() == 7),    // 6 = Saturday, 7 = Sunday
                                    date: date
                                });
                                date = date.clone();
                                date.add(1, "d");
                            }
                            return days;
                        };
                    }],
                    link: function (scope, element, attrs) {
                        if (ng.isDefined(scope.isTimestamp) || scope.isTimestamp != null) {
                            scope._isTimestamp = scope.$eval(scope.isTimestamp);
                        }
                        else
                        {
                            scope._isTimestamp = false;
                        }

                        if (!ng.isDefined(scope.selected) || scope.selected === null) {
                            // If 'selected' not defined than set it to today.
                            scope._selected = moment();
                        } else {
                            if (scope._isTimestamp) {
                                scope._selected = moment(scope.selected);
                            }
                        }
                        scope.month = scope._selected.clone();

                        var start = scope._selected.clone();
                        start.date(1);
                        // Starting from Monday.
                        scope.removeTime(start.isoWeekday(1));

                        // Build month array that contains weeks.
                        scope.buildMonth(start, scope.month);

                        scope.select = function (day) {
                            if (scope._isTimestamp) {
                                scope.selected = moment(day.date).valueOf();
                            } else {
                                scope.selected = day.date;
                            }

                            if (ng.isDefined(attrs.onDateSelect)) {
                                // Call on date selected callback.
                                scope.$apply(function () {
                                    scope.$eval(attrs.onDateSelect);
                                });
                            }
                        };

                        // Next month.
                        scope.next = function () {
                            var next = scope.month.clone();
                            scope.removeTime(next.month(next.month() + 1).date(1));
                            scope.month.month(scope.month.month() + 1);
                            scope.buildMonth(next, scope.month);
                        };

                        // Previous month.
                        scope.previous = function () {
                            var previous = scope.month.clone();
                            scope.removeTime(previous.month(previous.month() - 1).date(1));
                            scope.month.month(scope.month.month() - 1);
                            scope.buildMonth(previous, scope.month);
                        };
                    }
                };
                return ftDateRangePicker;
            }
        ]);
})(angular, fitotrack);