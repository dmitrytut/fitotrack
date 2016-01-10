

/** @fileOverview 
    MealFoodDiaryCtrl.js 
    Food diary controller.
*/

(function (ng, app) {
    'use strict';

    app.controller('meal.food.DiaryCtrl',
        [
            '_',
            'moment',
            '$scope',
            '$stateParams',
            '$location',
            'appCfg',
            'appService',
            'utilsService',
            'notificationService',
            'meal.food.DiaryModel',
            'meal.food.Service',
        function (
            _,
            moment,
            $scope,
            $stateParams,
            $location,
            appCfg,
            appSvc,
            utils,
            notification,
            FoodDiaryModel,
            foodService) {

            var base_path = "/food/diary/";

            var foodDiaryTitle = "Meal Diary";
            appSvc.setTitle(foodDiaryTitle);

            // Date from URL.
            var date = $stateParams.date;

            $scope.Model = new FoodDiaryModel();

            $scope.Internal = {
                appCfg: appCfg,
                foodQty: 1
            };

            // Forms.
            $scope.Forms = {
                foodSearchResForm: {}
            };

            // Assosiate form with form object from template.
            $scope.setForm = function (name, form) {
                if ($scope.Forms[name]) {
                    $scope.Forms[name] = form;
                }
            }

            $scope.WatchForNInfo = function (nInfoField) {
                // Watch for changes and invoke update of information (deep comparison).
                $scope.$watch(nInfoField, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (nInfoField === "Model.DiaryEntries") {
                            $scope.Model.RefreshSelectedServings();
                        }
                        $scope.Model.UpdateMealTimeNInfo();
                        $scope.Model.UpdateRemainingNInfo();
                    }
                }, true);
            };

            // Init routine.
            $scope.Init = function () {
                $scope.WatchForNInfo('Model.totalNInfo');
                $scope.WatchForNInfo('Model.plannedNInfo');
                $scope.WatchForNInfo('Model.DiaryEntries');
                // Watch for Model date change and update internal currentDat object.
                $scope.$watch('Model.date', function (newDate, oldDate) {
                    if (newDate !== oldDate) {
                        if (!utils.isUndefinedOrNull($scope.Model.date)) {
                            var datePart = $scope.Model.DateFormat($scope.Model.date);
                            if (moment($scope.Model.date).diff(moment().format(appCfg.iso8601DateFormat), 'days') == 0) {
                                datePart = "";
                            }
                            $location.path(base_path + datePart);
                        }
                    }
                });
                // Food diary entry changed handler.
                $scope.$on("ftFoodDiaryEntryChanged", function (event, entry, editObj) {

                    if (utils.isUndefinedOrNull(entry) || utils.isUndefinedOrNull(editObj) || event.defaultPrevented) {
                        return;
                    }
                    $scope.EditDiaryEntry(entry, editObj);
                });

                if (date) {
                    var _date = moment(date);
                    // Date is exists in URL.
                    if (_date) {
                        // Date format is valid (yyyy-MM-dd), 
                        // convert it to the unix epoch and set as current.
                        $scope.Model.SetDate(_date.valueOf());
                    }
                }

                // Init model.
                $scope.Model.InitModel();
            };

            // Display the date in a specific representation.
            $scope.ShowDate = function () {
                return $scope.Model.ShowDate($scope.Model.date);
            };

            // Display specific part of the date.
            $scope.ShowDateParts = function (part) {
                return $scope.Model.ShowDateParts($scope.Model.date, part);
            };

            // Navigate to the day before.
            $scope.DayBefore = function () {
                $scope.Model.date = $scope.Model.DayBefore();
            };

            // Navigate to the day after.
            $scope.DayAfter = function () {
                $scope.Model.date = $scope.Model.DayAfter();
            };

            // New food routine.
            $scope.NewFood = function () {
                $scope.Internal.foodQty = 1;
                $scope.Model.NewFood();
            };
            // New search routine.
            $scope.NewSearch = function () {
                $scope.Model.NewSearch();
            };

            // Food search autocomplete.
            $scope.Autocomplete = function (val) {
                return foodService.autocomplete(val);
            };

            // Food search routine.
            $scope.FoodSearch = function () {
                $scope.NewFood();
                $scope.Model.pageNum = 0;
                $scope.Model.search.search();
            };

            // Check if one of search results is selected. 
            $scope.IsSearchResSelected = function (foodId) {
                return ((foodId == $scope.Model.food.food.food_id) || (foodId == $scope.Model.food.food.ft_food_id));
            };

            // Filter mealTimes by index.
            $scope.mealTimeFilter = function (mealTimeIndex) {
                return function (item) {
                    return item.mealTimeIndex == mealTimeIndex;
                };
            };

            // Toggle adding mode in mealtime.
            $scope.ToggleFoodAddingMode = function (mtIndex) {

                ///
                ///
                /// TEST
                //$scope.Model.GetMostPopularFood();

                //var mt = _.where($scope.Model.MEALTIMES, { index: mtIndex });
                _.each($scope.Model.MEALTIMES, function (elem) {
                    if (elem.index == mtIndex) {
                        elem.addingMode = !elem.addingMode;
                        if (elem.addingMode) {
                            ///
                            ///
                            /// TEST
                            $scope.Model.GetMostPopularFood();
                        }
                    } else {
                        elem.addingMode = false;
                    }
                });
            };

            // Select food routine.
            $scope.SelectFood = function (foodId) {
                $scope.NewFood();
                $scope.Model.GetFood(foodId);
            };

            // Loading diary entries for current date from server.
            $scope.LoadDiaryEntries = function () {
                $scope.Model.LoadDiaryEntries();
            };

            // Add entry to the diary.
            $scope.AddDiaryEntry = function (mealTimeIndex) {
                // Broadcast validation check event.
                $scope.$broadcast('show-errors-check-validity');
                if ($scope.Forms.foodSearchResForm.$invalid) {
                    return;
                }

                $scope.Model.AddDiaryEntry(mealTimeIndex, $scope.Internal.foodQty).then(
                    function () {
                        //Success
                        $scope.ToggleFoodAddingMode(mealTimeIndex);
                    });
            };

            // Edit diary entry.
            $scope.EditDiaryEntry = function (index, editObj) {
                // Validation must be checked in diary entry controller.
                $scope.Model.EditDiaryEntry(index, editObj);
            };

            // Delete diary entry.
            $scope.DeleteDiaryEntry = function (index) {
                $scope.Model.DeleteDiaryEntry(index);
            };

            // Because of FS server answer complexity we need to check if there are food search results.
            $scope.SearchResShow = function () {
                return $scope.Model.search.IsSearchResShow();
            };

            // Init controller.
            $scope.Init();
        }]);
})(angular, fitotrack, moment);
