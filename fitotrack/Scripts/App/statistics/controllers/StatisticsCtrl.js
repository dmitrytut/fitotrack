
/**
 * @fileOverview
 * DashboardCtrl.js
 * Controller for App Statistics.
 */

(function (ng, app) {
    'use strict';

    app.controller('statistics.Ctrl',
        [
            '_',
            'moment',
            '$scope',
            '$state',
            '$timeout',
            'localStorageService',
            'appCfg',
            'appService',
            'utilsService',
            'statistics.all.Model',
            'statistics.body.Model',
            function (_, moment, $scope, $state, $timeout, localStorageService, appCfg, appSvc, utils,
                AllModel, BodyModel) {

                var statsTitle = "Statistics";

                // Get resolved initial data.
                //if (initialData) {
                //    utils.resolveReferences(initialData);
                //    utils.copyOnlyExisting(initialData, $scope.initialData);
                //}

                // State items.
                $scope.stateItems =
                    [
                        {
                            id: 1,
                            name: "All",
                            state: "statistics.all",
                            iconClass: "all",
                            model: new AllModel()
                        },
                        {
                            id: 2,
                            name: "Body",
                            state: "statistics.body",
                            iconClass: "body",
                            model: new BodyModel()
                        },
                        {
                            id: 3,
                            name: "Strength Training",
                            state: "statistics.strength",
                            iconClass: "heavy"
                        },
                        {
                            id: 4,
                            name: "Cardio",
                            state: "statistics.cardio",
                            iconClass: "cardio"
                        },
                        {
                            id: 5,
                            name: "Nutrition",
                            state: "statistics.nutrition",
                            iconClass: "nutrition"
                        }
                    ];

                // Detailed periods of time (In one selected period).
                $scope.detailedPeriodItems = [
                    {
                        id: 1,
                        name: "Month",
                        isChosen: false
                    },
                    {
                        id: 2,
                        name: "Week",
                        isChosen: false
                    },
                    {
                        id: 3,
                        name: "Day",
                        isChosen: false
                    }
                ];

                // Current Model.
                $scope.currentModel = {};

                // Internal variables.
                $scope.Internal = {
                    stateTitle: "",
                    states: {
                        all: $scope.stateItems[0],
                        body: $scope.stateItems[1],
                        strength: $scope.stateItems[2],
                        cardio: $scope.stateItems[3],
                        nutrition: $scope.stateItems[4]
                    },
                    currentState: {},
                    periodHeaderStr: "",
                    defaultChosenPeriod: {
                        startDate: moment().subtract(29, 'days').startOf('day'),
                        endDate: moment().endOf('day')
                    },
                    chosenPeriod: {
                        startDate: moment().subtract(29, 'days').startOf('day'),
                        endDate: moment().endOf('day')
                    },
                    chosenPeriodOptions: {
                        locale: {
                            firstDay: 1,
                            weekendDays: [5, 6]
                        },
                        ranges: {
                            'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                            'Last 3 Months': [moment().subtract(2, 'months').startOf('month'), moment().endOf('day')],
                            'Current Year': [moment().startOf('year'), moment().endOf('day')]
                        },
                        maxDate: moment().endOf('day'),
                        opens: 'left'
                    }
                };

                // Format period header string.
                $scope.formatPeriodStr = function (startDate, endDate, separator) {
                    if (utils.isUndefinedOrNull(separator)) {
                        separator = " - ";
                    }
                    if (!utils.isUndefinedOrNull(startDate) &&
                        !utils.isUndefinedOrNull(endDate)) {
                        var start = moment(startDate);
                        var end = moment(endDate);

                        if (start.isValid() &&
                            end.isValid()) {
                            //start.isSame();
                            var format = appCfg.fullDateWithFullMonthFormat;
                            $scope.Internal.periodHeaderStr =
                                start.format(format) +
                                separator +
                                end.format(format);
                            return;
                        }
                    }

                    $scope.Internal.periodHeaderStr = "Choose Date Period";
                    return;
                };

                // Init controller.
                $scope.Init = function () {
                    // Get current state from states array.
                    $scope.Internal.currentState = _.find($scope.stateItems, function (item) {
                        return item.state == $state.current.name;
                    });
                    if (!utils.isUndefinedOrNull($scope.Internal.currentState) &&
                        !utils.isUndefinedOrNull($scope.Internal.currentState.name)) {
                        // Set window and panel title.
                        appSvc.setTitle(statsTitle + ": " + $scope.Internal.currentState.name);
                        $scope.Internal.stateTitle = $scope.Internal.currentState.name;
                        // Set current model.
                        $scope.currentModel = $scope.Internal.currentState.model;
                    }
                    // Get stored in localStorage chosenPeriod for current state.
                    var chosenPeriod = $scope.Internal.defaultChosenPeriod;
                    var lsKey = "stats." + $scope.Internal.currentState.name + ".chosenPeriod";
                    var lsChosenPeriod = localStorageService.get(lsKey);
                    if (!utils.isUndefinedOrNull(lsChosenPeriod)) {
                        if (!utils.isUndefinedOrNull(lsChosenPeriod.startDate) &&
                            !utils.isUndefinedOrNull(lsChosenPeriod.endDate) &&
                            (lsChosenPeriod.startDate = moment(lsChosenPeriod.startDate)).isValid() &&
                            (lsChosenPeriod.endDate = moment(lsChosenPeriod.endDate)).isValid()) {
                            var maxDate = $scope.Internal.chosenPeriodOptions.maxDate;
                            if (utils.isUndefinedOrNull(maxDate)) {
                                maxDate = moment().endOf('day');
                            }
                            if (lsChosenPeriod.endDate.isAfter(maxDate)) {
                                lsChosenPeriod.endDate = maxDate;
                            }
                            chosenPeriod = lsChosenPeriod;
                        } else {
                            // Invalid data in the key, remove it.
                            localStorageService.remove(lsKey);
                        }
                    }
                    // Set default chosen period for current state.
                    $timeout(function () {
                        $scope.Internal.chosenPeriod = chosenPeriod;
                        $scope.currentModel.base.setChosenPeriod(chosenPeriod);
                        $scope.formatPeriodStr(
                            $scope.Internal.chosenPeriod.startDate,
                            $scope.Internal.chosenPeriod.endDate);
                    });
                    
                };

                $scope.add = function () {
                    $timeout(function () {
                        $scope.Internal.chosenPeriod = {
                            startDate: moment().subtract(2, 'days').startOf('day'),
                            endDate: moment().endOf('day')
                        };
                    });
                };

                // Watch on chosen period changes.
                $scope.$watch('Internal.chosenPeriod', function (newChosenPeriod, oldChosenPeriod) {
                    if (newChosenPeriod != oldChosenPeriod) {
                        // Check if date period changes for current state (compare stored value in the model and new value).
                        if (utils.isUndefinedOrNull(newChosenPeriod) ||
                            utils.isUndefinedOrNull(newChosenPeriod.startDate) ||
                            utils.isUndefinedOrNull(newChosenPeriod.endDate) ||
                            !newChosenPeriod.startDate.isValid() ||
                            !newChosenPeriod.endDate.isValid() ) {
                            newChosenPeriod = $scope.Internal.defaultChosenPeriod;
                        }
                        // Store new chosenPeriod timestamps in local storage.
                        var lsKey = "stats." + $scope.Internal.currentState.name + ".chosenPeriod";
                        localStorageService.set(
                            lsKey,
                            {
                                startDate: newChosenPeriod.startDate.valueOf(),
                                endDate: newChosenPeriod.endDate.valueOf()
                            });
                        if (!newChosenPeriod.startDate.isSame($scope.currentModel.base.chosenPeriod.startDate) ||
                            !newChosenPeriod.endDate.isSame($scope.currentModel.base.chosenPeriod.endDate)) {
                            // Set current model chosenPeriod.
                            $scope.currentModel.base.setChosenPeriod(newChosenPeriod);
                            // Format new header string.
                            $scope.formatPeriodStr(newChosenPeriod.startDate, newChosenPeriod.endDate);
                        }
                    }
                }, true);

                // If state changes within scope re-init the controller.
                $scope.$on("$stateChangeSuccess", function () {
                    $scope.Init();
                });
            }
        ]);
})(angular, fitotrack);