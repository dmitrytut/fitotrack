
/**
 * @fileOverview
 * ftBirthday.js
 * Directive for working with user's birth date.
 */

(function (ng, app, moment) {
    'use strict';

    app.directive('ftBirthday',
        [
            'appCfg',
            'utilsService',
            function (appCfg, utils) {
                var ftBirthday = {
                    restrict: 'E',
                    replace: true,
                    require: 'ngModel',
                    scope: {
                        ngModel: '=',
                        isRequired: '@'
                    },
                    controller: ['$scope', function ($scope) {
                        $scope.days = [];
                        // TODO Set months language
                        $scope.months = [];
                        $scope.years = [];

                        // Fill days
                        for (var i = 1; i <= 31; i++) {
                            $scope.days.push(i);
                        }

                        // Fill months
                        for (i = 0; i <= 11; i++) {
                            $scope.months.push({value: i, name: moment().lang()._months[i]});
                        }
                        
                        // Use range of 'minAge' years before current year and 'maxAge' years before
                        var currentYear = moment().year();
                        var maxYear = currentYear - appCfg.minAge;
                        var minYear = currentYear - appCfg.maxAge;
                        for (i = maxYear; i >= minYear; i--) {
                            $scope.years.push(i);
                        }

                        // Date parts (day,month,year)
                        $scope.dateParts = {};

                        // Watch for model is changed and change the date parts 
                        $scope.$watch('ngModel', function (newDate, oldDate) {
                            if (ng.isDefined(newDate) && newDate !== 0) {
                                $scope.dateParts.day = moment(newDate).date();
                                $scope.dateParts.month = moment(newDate).month();
                                $scope.dateParts.year = moment(newDate).year();
                            }
                        });
                        // Watch for date parts are changed and change the model
                        $scope.$watch('dateParts', function (newDateParts, oldDateParts) {
                            if (newDateParts !== oldDateParts) {
                                if (utils.isUndefinedOrNullOrNaN(newDateParts.day) ||
                                    utils.isUndefinedOrNullOrNaN(newDateParts.month) ||
                                    newDateParts.month < 0 ||
                                    utils.isUndefinedOrNullOrNaN(newDateParts.year)) {
                                    return false;
                                }
                                
                                $scope.ngModel = moment({ day: newDateParts.day, month: newDateParts.month, year: newDateParts.year }).valueOf();
                            }
                        }, true);

                        // Check and Normilize input date
                        $scope.checkAndNormalizeDate = function (date) {
                            if (utils.isUndefinedOrNullOrNaN(date.day) || 
                                utils.isUndefinedOrNullOrNaN(date.month) ||
                                date.month < 0 ||
                                utils.isUndefinedOrNullOrNaN(date.year)) {
                                return false;
                            }
                            var birthday = moment({ day: date.day, month: date.month, year: date.year });
                            if (birthday.isValid()) {
                                // update the model when the date is correct
                                return birthday;
                            } else {
                                if (date.day > 28) {
                                    // Normilize if e.g.February, 30
                                    date.day--;
                                    // change the date on the scope and try again if invalid
                                    return $scope.checkAndNormalizeDate(date);
                                } else {
                                    // Something wrong return false to prevent infinite recursion
                                    return false;
                                }
                            }
                        };

                        // Validate date accuracy
                        $scope.validateDate = function () {
                            var date = $scope.checkAndNormalizeDate($scope.dateParts);
                            if (date) {
                                $scope.dateParts.day = date.date();
                                $scope.dateParts.month = date.month();
                                $scope.dateParts.year = date.year();
                            }
                        };
                    }],
                    link: function (scope, element, attrs, ctrl) {
                    },
                    template:
                        '<div class="row">' +
                        '  <div class="col-xs-2 form-group" style="width: 110px" data-show-errors>' +
                        '    <select name="dateParts.day" class="form-control" placeholder="Day" data-ng-model="dateParts.day" data-ng-options="day for day in days" ng-change="validateDate()" data-ng-required="{{isRequired}}"></select>' +
                        '  </div>' +
                        '  <div class="col-xs-4 form-group" style="width: 180px" data-show-errors>' +
                        '    <select name="dateParts.month" class="form-control" placeholder="Month" data-ng-model="dateParts.month" data-ng-options="month.value as month.name for month in months" value="{{dateParts.month}}" ng-change="validateDate()" data-ng-required="{{isRequired}}"></select>' +
                        '  </div>' +
                        '  <div class="col-xs-3 form-group" style="width: 140px" data-show-errors>' +
                        '    <select name="dateParts.year" class="form-control" placeholder="Year" data-ng-model="dateParts.year" data-ng-options="year for year in years" ng-change="validateDate()" data-ng-required="{{isRequired}}"></select>' +
                        '  </div>' +
                        '</div>'
                };
                return ftBirthday;
            }
        ]);
})(angular, fitotrack, moment);