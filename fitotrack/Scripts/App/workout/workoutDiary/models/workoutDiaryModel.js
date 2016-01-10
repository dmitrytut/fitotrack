/**
 * @fileOverview
 * workoutDiaryModel.js
 * Model for workout diary.
 */

(function (ng, app) {
    'use strict';

    app.factory('workout.diary.Model',
    [
        '_',
        'moment',
        '$q',
        'appCfg',
        'utilsService',
        'common.search.BaseModel',
        'workout.exercise.Model',
        'workout.diary.EntryElement',
        'workout.diary.SetElement',
        'workout.exercise.Service',
        'workout.diary.Service',
        'notificationService',
        function (
            _,
            moment,
            $q,
            appCfg,
            utils,
            SearchBaseModel,
            exerciseModel,
            WorkoutDiaryEntryElement,
            WorkoutSetElement,
            exerciseService,
            workoutDiaryService,
            notification) {
            function workoutDiaryModel() {
                this.EXERCISE_TYPE = appCfg.ExerciseType;
                //
                // Action is in progress.
                this.isBusy = false;
                //
                // Search model.
                this.search = new SearchBaseModel(exerciseService);
                //
                // Exercise model.
                this.exercise = new exerciseModel();
                //
                // Diary entries.
                this.workoutDiaryEntries = [];
                //
                // Total burned calories in a day.
                this.totalKcalBurned = 0;
                //
                // Planned calories to burn in a day.
                this.plannedKcalToBurn = 0;
                //
                // Remaining daily calories to burn.
                this.remainingKcalToBurn = 0;
                //
                // Date of the diary day.
                this.date = 0;
                //
                // Setting date to today.
                this.setTodayDate();
            }

            workoutDiaryModel.prototype = {
                getTodayDate: function(){
                    return moment().startOf("day").valueOf();
                },
                //
                // Setup diary date to today.
                setTodayDate: function () {
                    this.date = this.getTodayDate();
                },
                //
                // Setup diary date.
                setDate: function (date) {
                    this.date = date || 0;
                },
                //
                // Format date to ISO-8601.
                DateFormat: function (date) {
                    return moment(date).format(appCfg.iso8601DateFormat);
                },
                //
                // Create timestamp of the next day.
                DayAfter: function () {
                    var self = this;
                    return moment(self.date).add('d', 1).valueOf();
                },
                //
                // Create timestamp of the day before.
                DayBefore: function () {
                    var self = this;
                    return moment(self.date).subtract('d', 1).valueOf();
                },
                //
                // Show the date value according to defined format.
                showDate: function (date) {
                    moment.lang('en', {
                        'calendar': {
                            sameDay: 'ddd, MMM D YYYY [(Today)]',
                            nextDay: 'ddd, MMM D YYYY [(Tomorrow)]',
                            nextWeek: 'ddd, MMM D YYYY',
                            lastDay: 'ddd, MMM D YYYY [(Yesterday)]',
                            lastWeek: 'ddd, MMM D YYYY',
                            sameElse: 'ddd, MMM D YYYY'
                        }
                    });

                    return moment(date).calendar();
                },
                //
                // Show part of the date. 
                // Params: 
                // 'monthDay' - month day (number), 'weekDay' - title of the week day (text), 
                // 'month' - month (number), 'monthTitle' - title of the month (text), 
                // 'year' - year (number)
                showDateParts: function (date, part) {
                    if (utils.isUndefinedOrNull(date)) {
                        return null;
                    }
                    switch (part) {
                        case "monthDay":
                            return moment(date).date();
                        case "weekDay":
                            return moment().weekday(moment(date).day()).format('dddd');
                        case "month":
                            return moment(date).month();
                        case "monthTitle":
                            return moment().month(moment(date).month()).format('MMMM');
                        case "year":
                            return moment(date).year();
                        default:
                            return null;
                    }
                },
                //
                // New exercise.
                newExercise: function () {
                    var self = this;
                    self.exercise = new exerciseModel();
                },
                //
                // New search.
                newSearch: function() {
                    var self = this;
                    self.search = new SearchBaseModel(exerciseService);
                },
                //
                // Exercises autocomplete function.
                autocomplete: function (query){
                    return exerciseService.autocomplete(query);
                },
                //
                // Get exercise by Id.
                getExercise: function (exerciseId)
                {
                    var deferred = $q.defer();
                    var self = this;
                    self.isBusy = true;

                    // Get exercise from server.
                    self.exercise.get(exerciseId).then(function(){
                        deferred.resolve();
                    },
                    function(response){
                        deferred.reject(response.status);
                    }).finally(function(){
                        self.isBusy = false;
                    });

                    return deferred.promise;
                },
                //
                // Get diary entries for defined date.
                loadWorkoutDiaryEntries: function ()
                {
                    var deferred = $q.defer();
                    var self = this;
                    self.isBusy = true;

                    // Get diary entries for current date from server.
                    workoutDiaryService.getEntriesByDate(self.date).then(
                        function (data) {
                            self.workoutDiaryEntries.length = 0;
                            if (data) {
                                utils.resolveReferences(data);
                                if (data.length) {
                                    _.each(data, function (entry) {
                                        // Extend workout sets from server with client-side vital info.
                                        if (entry.sets) {
                                            _.each(entry.sets, function (set) {
                                                ng.copy(new WorkoutSetElement(set), set);
                                            });
                                        }

                                        var wde = new WorkoutDiaryEntryElement();
                                        ng.extend(wde, entry);
                                        self.workoutDiaryEntries.push(wde);
                                    });
                                }
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Something wrong with workout diary entries loading. Please, try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        }).finally(function () {
                            self.isBusy = false;
                        });

                    return deferred.promise;
                },
                //
                // Add entry to the diary.
                addWorkoutDiaryEntry: function (entry) {
                    var deferred = $q.defer();
                    var self = this;

                    if (!entry) {
                        deferred.reject("addWorkoutDiaryEntry: Invalid Diary Entry was passed.");
                    }
                    
                    var finalEntry = new WorkoutDiaryEntryElement();
                    finalEntry.workoutDiaryEntryId = entry.workoutDiaryEntryId;
                    finalEntry.exercise = entry.exercise;
                    finalEntry.sets = entry.sets;
                    finalEntry.date = self.date;
                    //if (self.date > self.getTodayDate()) {
                    //    finalEntry.isCompleted = false;
                    //}


                    self.isBusy = true;
                    // Save entry on server.
                    workoutDiaryService.saveEntry(finalEntry).then(
                        function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                utils.resolveReferences(data);
                                finalEntry = new WorkoutDiaryEntryElement();
                                // Extend sets from server with client-side module.
                                if (data.sets) {
                                    _.each(data.sets, function (set) {
                                        ng.copy(new WorkoutSetElement(set), set);
                                    });
                                }
                                // Fill entry with server response.
                                utils.copyOnlyExisting(data, finalEntry);
                                // Add to model.
                                self.workoutDiaryEntries.push(finalEntry);
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Something wrong with adding entry to the diary. Please, try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        }).finally(function () {
                            self.isBusy = false;
                        });

                    return deferred.promise;
                },
                //
                // Change diary entry.
                editWorkoutDiaryEntry: function (entry) {
                    var deferred = $q.defer();
                    var self = this;

                    if (!entry) {
                        deferred.reject("editWorkoutDiaryEntry: Invalid Diary Entry was passed.");
                    }

                    if (entry.workoutDiaryEntryId) {
                        self.isBusy = true;
                        // Change entry on server.
                        workoutDiaryService.editEntry(entry.workoutDiaryEntryId, entry).then(
                            function (data) {
                                if (!utils.isUndefinedOrNull(data)) {
                                    // Extend sets from server with client-side module.
                                    if (data.sets) {
                                        _.each(data.sets, function (set) {
                                            ng.copy(new WorkoutSetElement(set), set);
                                        });
                                    }
                                    // Update model.
                                    utils.copyOnlyExisting(data, entry);
                                }
                                deferred.resolve();
                            },
                            function (response) {
                                // Error.
                                notification.error(
                                    "Error occurred while editing diary entry. Please, try again later.",
                                    "Error " + response.status
                                    );

                                deferred.reject(response.status);
                            }).finally(function () {
                                self.isBusy = false;
                            });
                    } else {
                        deferred.reject("editWorkoutDiaryEntry: Invalid entry Id.");
                    }

                    return deferred.promise;
                },
                //
                // Delete diary entry.
                deleteWorkoutDiaryEntry: function (entry) {
                    var deferred = $q.defer();
                    var self = this;

                    if (entry === null) {
                        deferred.reject("deleteWorkoutDiaryEntry: Invalid Diary Entry was passed.");
                    }

                    var rejectMsgs = {
                        InvalidDiaryEntryId: "deleteWorkoutDiaryEntry: Invalid entry Id.",
                        ReceivedError: "Something wrong with diary entry deleting. Please, try again later."
                    };

                    var entryIndex = self.workoutDiaryEntries.indexOf(entry);
                    var diaryEntryId = self.workoutDiaryEntries[entryIndex].workoutDiaryEntryId;
                    if (diaryEntryId) {
                        self.isBusy = true;
                        // Delete diary from server.
                        workoutDiaryService.removeEntry(diaryEntryId).then(
                            function (data) {
                                // Success. 
                                // Delete entry from Model.
                                self.workoutDiaryEntries.splice(entryIndex, 1);
                                deferred.resolve();
                            },
                            function (response) {
                                // Error.
                                notification.error(
                                    rejectMsgs.ReceivedError,
                                    "Error " + response.status
                                    );

                                deferred.reject(response.status);
                            }).finally(function () {
                                self.isBusy = false;
                            });
                    } else {
                        deferred.reject(rejectMsgs.InvalidDiaryEntryId);
                    }

                    return deferred.promise;
                },
                //
                // Delete workout set.
                deleteWorkoutSet: function (entry, set) {
                    var deferred = $q.defer();
                    var self = this;

                    if (entry === null || set === null) {
                        deferred.reject("deleteWorkoutSet: Invalid Diary Entry or Workout Set was passed.");
                    }

                    var rejectMsgs = {
                        InvalidWorkoutSetId: "deleteWorkoutSet: Invalid workout set Id.",
                        ReceivedError: "Something wrong with workout set deleting. Please, try again later."
                    };

                    var setIndex = entry.sets.indexOf(set);//self.workoutDiaryEntries.indexOf(entry);
                    var setId = entry.sets[setIndex].workoutSetId;
                    if (setId) {
                        self.isBusy = true;
                        // Delete set from server.
                        workoutDiaryService.removeWorkoutSet(setId).then(
                            function (data) {
                                // Success. 
                                // Delete entry from Diary entry.
                                entry.sets.splice(setIndex, 1);
                                deferred.resolve();
                            },
                            function (response) {
                                // Error.
                                notification.error(
                                    rejectMsgs.ReceivedError,
                                    "Error " + response.status
                                    );

                                deferred.reject(response.status);
                            }).finally(function () {
                                self.isBusy = false;
                            });
                    } else {
                        deferred.reject(rejectMsgs.InvalidWorkoutSetId);
                    }

                    return deferred.promise;
                },
                //
                // Get planned calories to burn.
                getPlannedKcalToBurn: function () {
                    var deferred = $q.defer();
                    var self = this;
                    self.isBusy = true;

                    ///
                    ///
                    ///
                    deferred.resolve();
                    return deferred.promise;
                    ///
                    ///
                    ///



                    var date = self.date;

                    // Получаем записи с сервера
                    foodDiaryService.getGoalInfo(date).then(
                        function (data) {
                            self.plannedNInfo = new FoodNutrition();
                            if (!utils.isUndefinedOrNull(data)) {
                                // Обработка Circular References ($ref<->obj)
                                utils.resolveReferences(data);

                                self.plannedNInfo.kcal = data.rde || 0;
                                self.plannedNInfo.carb = data.carb || 0;
                                self.plannedNInfo.protein = data.protein || 0;
                                self.plannedNInfo.fat = data.fat || 0;
                                self.plannedNInfo.sodium = data.sodium || 0;
                                self.plannedNInfo.sugar = data.sugar || 0;
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Ошибка при добавлении
                            notification.error(
                                "Something wrong with Recommended Daily Expenditure retrieving. Please, refresh page or try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        }).finally(function () {
                            self.isBusy = false;
                        });

                    return deferred.promise;
                },
                //
                // Update remaining calories to burn.
                updateKcalToBurn: function () {
                    var self = this;
                },
                //
                // Update burned calories.
                updateBurnedKcal: function () {
                    var self = this;
                    if (self.workoutDiaryEntries.length > 0) {
                        self.totalKcalBurned = utils.roundNumber(_.reduce(self.workoutDiaryEntries, function (sum, entry) {
                            if (!utils.isUndefinedOrNull(entry.burnedCalories)) {
                                return sum + entry.burnedCalories;
                            }
                            return sum;
                        }, 0), 0);
                    } else {
                        self.totalKcalBurned = 0;
                    }
                },
                //
                // Init the model.
                initModel: function () {
                    var self = this;
                    return $q.all([
                        self.loadWorkoutDiaryEntries(),
                        self.getPlannedKcalToBurn()
                    ]);
                }
            };

            return workoutDiaryModel;
        }]);
})(angular, fitotrack);