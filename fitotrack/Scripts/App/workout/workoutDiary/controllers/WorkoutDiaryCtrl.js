/**
 * @fileOverview
 * WorkoutDiaryCtrl.js
 * Workout diary controller.
 */

(function (ng, app) {
    'use strict';

    app.controller('workout.diary.Ctrl',
        [
            '$scope',
            '$stateParams',
            '$location',
            'moment',
            'appCfg',
            'appService',
            'utilsService',
            'notificationService',
            'workout.diary.Model',
            'workout.diary.Service',
            'workout.diary.EntryElement',
            '$log',
            function (
                $scope,
                $stateParams,
                $location,
                moment,
                appCfg,
                appSvc,
                utils,
                notification,
                WorkoutDiaryModel,
                workoutService,
                WorkoutDiaryEntryElement,
                $log) {

                var base_path = "/workout/diary/";

                var workoutDiaryTitle = "Workout Diary";
                appSvc.setTitle(workoutDiaryTitle);

                // Get date from URL.
                var date = $stateParams.date;

                $scope.$log = $log;

                $scope.Model = new WorkoutDiaryModel();

                $scope.Internal = {
                    isSearchResultsVisible: false,
                    addingMode: false,
                    searchResWorkoutDiaryEntries: [],
                    searchResCurrentWorkoutDiaryEntry: new WorkoutDiaryEntryElement()
                };

                // Initialization.
                $scope.Init = function () {
                    // Diary entry delete handler.
                    $scope.$on("ftWorkoutDiaryEntryDelete", function (event, entry) {

                        if (utils.isUndefinedOrNull(entry) || event.defaultPrevented) {
                            return;
                        }
                        $scope.Model.deleteWorkoutDiaryEntry(entry);
                    });
                    // Diary entry changed handler.
                    $scope.$on("ftWorkoutDiaryEntryChanged", function (event, entry) {

                        if (utils.isUndefinedOrNull(entry) || event.defaultPrevented) {
                            return;
                        }
                        $scope.Model.editWorkoutDiaryEntry(entry);
                    });
                    // Workout set delete handler.
                    $scope.$on("ftWorkoutSetDeleted", function (event, entry, set) {

                        if (utils.isUndefinedOrNull(entry) || utils.isUndefinedOrNull(set) || event.defaultPrevented) {
                            return;
                        }
                        $scope.Model.deleteWorkoutSet(entry, set);
                    });
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
                    // Watch for workout diary entries change and update information about calories.
                    $scope.$watch('Model.workoutDiaryEntries', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            $scope.Model.updateBurnedKcal();
                        }
                    }, true);

                    if (date) {
                        var _date = moment(date);
                        if (_date) {
                            // Valid date was passed (yyyy-MM-dd), 
                            // convert to unix epoch and set current date.
                            $scope.Model.setDate(_date.valueOf());
                        }
                    }

                    // Init Model.
                    $scope.Model.initModel();
                };

                $scope.showDate = function () {
                    return $scope.Model.showDate($scope.Model.date);
                };

                // Get part of the date.
                $scope.showDateParts = function (part) {
                    return $scope.Model.showDateParts($scope.Model.date, part);
                };

                // Navigate to the day before.
                $scope.DayBefore = function () {
                    $scope.Model.date = $scope.Model.DayBefore();
                };

                // Navigate to the day after.
                $scope.DayAfter = function () {
                    $scope.Model.date = $scope.Model.DayAfter();
                };

                $scope.ExerciseSearch = function () {
                    $scope.NewExercise();
                    $scope.Model.search.search().then(function () {
                        // Search successfull. Create temp workout diary entries and fill them with found exercises.
                        $scope.Internal.searchResWorkoutDiaryEntries = [];
                        ng.forEach($scope.Model.search.results.results, function (value, key) {
                            var workoutDiaryEntry = new WorkoutDiaryEntryElement({ exercise: value });
                            $scope.Internal.searchResWorkoutDiaryEntries.push(workoutDiaryEntry);
                        });
                        $scope.Internal.isSearchResultsVisible = true;
                    });
                };

                $scope.Autocomplete = function (query) {
                    return $scope.Model.autocomplete(query);
                };

                // Check for results.
                $scope.SearchNoResults = function () {
                    return $scope.Model.search.isNothing || $scope.Model.search.results.totalResults == 0;
                };

                $scope.NewExercise = function () {
                    $scope.Model.newExercise();
                };

                // Select search result entry.
                $scope.SearchResSelectEntry = function (entry) {
                    if (!$scope.IsSearchResSelected(entry.exercise.exerciseId)) {
                        $scope.NewExercise();
                        $scope.Internal.searchResCurrentWorkoutDiaryEntry = new WorkoutDiaryEntryElement();
                        utils.copyOnlyExisting(entry, $scope.Internal.searchResCurrentWorkoutDiaryEntry);
                        utils.copyOnlyExisting(entry.exercise, $scope.Model.exercise.exercise);
                    }
                };

                // Check if search result entry selected.
                $scope.IsSearchResSelected = function (exerciseId) {
                    return exerciseId == $scope.Model.exercise.exercise.exerciseId;
                };

                // Toggle adding mode for diary (open adding pane).
                $scope.ToggleAddingMode = function () {
                    $scope.Internal.addingMode = !$scope.Internal.addingMode;
                };

                $scope.AddEntryToDiary = function () {
                    $scope.Model.addWorkoutDiaryEntry($scope.Internal.searchResCurrentWorkoutDiaryEntry);
                };

                // Init Controller.
                $scope.Init();
            }]);

})(angular, fitotrack);