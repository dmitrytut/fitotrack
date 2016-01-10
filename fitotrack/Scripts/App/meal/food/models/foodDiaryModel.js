
/**
 * @fileOverview
 * foodDiaryModel.js
 * Model for food diary.
 */

(function (ng, app) {
    'use strict';

    app.factory('meal.food.DiaryModel',
    [
        '_',
        'moment',
        '$q',
        'appCfg',
        'utilsService',
        'meal.food.Service',
        'meal.food.DiaryService',
        'meal.food.DiaryEntryModel',
        'meal.food.VitalNutritionElement',
        'meal.food.Model',
        'meal.food.Element',
        'meal.food.SearchBaseModel',
        'notificationService',
        function (
            _,
            moment,
            $q,
            appCfg,
            utils,
            foodService,
            foodDiaryService,
            FoodDiaryEntryModel,
            FoodNutrition,
            FoodModel,
            FoodElement,
            FoodSearchBaseModel,
            notification) {

            //
            // Конструктор
            function DiaryModel() {
                //
                // Объекты приемов пищи
                this.MEALTIMES = {
                    BFAST: { index: 0, title: "Breakfast", addingMode: false },
                    LUNCH: { index: 1, title: "Lunch", addingMode: false },
                    DINNER: { index: 2, title: "Dinner", addingMode: false },
                    SNACKS: { index: 3, title: "Snacks", addingMode: false }
                };
                //
                // Выполняется действие
                this.isBusy = false;
                //
                // Модель поиска еды
                this.search = new FoodSearchBaseModel();
                //
                // Модель еды
                this.food = new FoodModel();
                //
                // Список записей журнала
                this.DiaryEntries = [];
                //
                // Потребленная пищевая ценность за день
                this.totalNInfo = new FoodNutrition();
                //
                // Запланированная пищевая ценность на день
                this.plannedNInfo = new FoodNutrition();
                //
                // Оставшаяся пищевая ценность на день
                this.remainingNInfo = new FoodNutrition();
                //
                // Массив потребленных пищевых ценностей
                this.mealTimesNInfo = _.range(_.keys(this.MEALTIMES).length).map(function () { return new FoodNutrition(); });
                //
                // Most popular food.
                this.mostPopularFood = [];

                //
                // Текущая дата записи
                this.date = 0;
                //
                // Устанавливаем дату на сегодня
                this.SetTodayDate();
            }

            //
            // Методы
            DiaryModel.prototype = {
                //
                // Метод обнуления поля еды.
                NewFood: function() {
                    var self = this;
                    self.food = new FoodModel();
                },
                //
                // Метод обнуления поля поиска.
                NewSearch: function() {
                    var self = this;
                    self.search = new FoodSearchBaseModel();
                },
                //
                // Метод установки даты на сегодня.
                SetTodayDate: function ()
                {
                    this.date = moment().startOf("day").valueOf();
                },
                //
                // Метод установки даты.
                SetDate: function (date){
                    this.date = date || 0;
                },
                //
                // Метод создания даты в ISO-8601 формате.
                DateFormat: function (date) {
                    return moment(date).format(appCfg.iso8601DateFormat);
                },
                //
                // Метод создания timestamp следующего дня.
                DayAfter: function () {
                    var self = this;
                    return moment(self.date).add('d', 1).valueOf();
                },
                //
                // Метод создания timestamp предыдущего дня.
                DayBefore: function () {
                    var self = this;
                    return moment(self.date).subtract('d', 1).valueOf();
                },
                //
                // Метод отображения даты в удобном представлении.
                ShowDate: function (date) {
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
                // Метод отображения части даты. 
                // Параметры: 
                // 'monthDay' - день месяца (число), 'weekDay' - название дня (текст), 
                // 'month' - месяц (число), 'monthTitle' - название месяца (текст), 
                // 'year' - год (число)
                ShowDateParts: function (date, part) {
                    if (utils.isUndefinedOrNull(date)) {
                        return null;
                    }
                    switch (part)
                    {
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
                // Метод округления числа до 2-х знаков после запятой.
                RoundFloat: function (num) {
                    return utils.roundNumber(num, 2);
                },
                //
                // Метод округления числа до указанного в переменной 'digit' количества знаков после запятой.
                RoundToDigit: function (num, digit) {
                    return utils.roundNumber(num, digit);
                },
                //
                // Метод проверки полей записи на валидность.
                CheckInputValidity: function (foodQty, serving) {
                    var self = this;
                    var _serving = serving || self.food.currentServing;

                    //Количество еды - положительное число, в том числе с плавающей точкой.
                    if (!(appCfg.regexpPositiveDigitFloat.test(foodQty)))
                    {
                        notification.error("Please, enter valid Food Quantity.", "Invalid Quantity!");
                        return false;
                    }
                    if (_.isEmpty(_serving) ||
                        (_serving.ft_serving_id === 0 &&
                         _serving.serving_id === 0)) {
                        notification.error("Please, choose valid Food Serving.", "Invalid Serving!");
                        return false;
                    }
                    return true;
                },
                //
                // Метод загрузки еды по идентификатору.
                GetFood: function (foodId)
                {
                    var deferred = $q.defer();
                    var self = this;
                    self.isBusy = true;

                    // Получаем еду с сервера.
                    self.food.Get(foodId).then(function(){
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
                // Выставление выбранной порции по идентификатору для всех записей.
                RefreshSelectedServings: function ()
                {
                    var self = this;
                    _.each(this.DiaryEntries, function (entry) {
                        entry.SetSelectedServing(entry.ftSelectedServingId, entry.fsSelectedServingId);
                    });
                },
                //
                // Метод загрузки записей дневника.
                LoadDiaryEntries: function ()
                {
                    var deferred = $q.defer();
                    var self = this;
                    self.isBusy = true;
                    var date = self.date;

                    // Получаем записи с сервера
                    foodDiaryService.getEntriesByDate(date).then(
                        function (data) {
                            self.DiaryEntries.length = 0;
                            if (data) {
                                // Обработка Circular References ($ref<->obj)
                                utils.resolveReferences(data);
                                if (data.length > 0) {
                                    _.each(data, function (entry) {
                                        var fde = new FoodDiaryEntryModel();
                                        ng.extend(fde, entry);
                                        self.DiaryEntries.push(fde);
                                    });
                                }
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Ошибка при добавлении
                            notification.error(
                                "Something wrong with food diary entries loading. Please, try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        }).finally(function () {
                            self.isBusy = false;
                        });

                    return deferred.promise;
                },
                //
                // Метод добавления записи в дневник.
                AddDiaryEntry: function (mealTimeIndex, foodQty) {
                    var deferred = $q.defer();
                    var self = this;
                    if (self.CheckInputValidity(foodQty)) {
                        self.isBusy = true;
                        var finalEntry = new FoodDiaryEntryModel();
                        finalEntry.food = self.food.food;
                        finalEntry.fsSelectedServingId = self.food.currentServing.serving_id;
                        finalEntry.ftSelectedServingId = self.food.currentServing.ft_serving_id;
                        finalEntry.foodQty = foodQty;
                        finalEntry.mealTimeIndex = mealTimeIndex;
                        finalEntry.date = self.date;
                        if (self.date > moment().startOf("day").valueOf()) {
                            finalEntry.isCompleted = false;
                        }


                        // Отсылаем запись на сервер
                        foodDiaryService.saveEntry(finalEntry).then(function (data) {
                            if (data) {
                                // Обработка Circular References ($ref<->obj)
                                utils.resolveReferences(data);

                                finalEntry = new FoodDiaryEntryModel(
                                    data.foodDiaryEntryId,
                                    data.mealTimeIndex,
                                    data.food,
                                    data.fsSelectedServingId,
                                    data.ftSelectedServingId,
                                    null,
                                    data.foodQty,
                                    data.isCompleted,
                                    data.date,
                                    data.creationTime,
                                    data.createUserId);
                                //finalEntry.SetSelectedServing(data.ftSelectedServingId, data.fsSelectedServingId);

                                self.DiaryEntries.push(finalEntry);
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Ошибка при добавлении
                            notification.error(
                                "Something wrong with adding entry to the diary. Please, try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        }).finally(function () {
                            self.isBusy = false;
                        });
                    } else {
                        deferred.reject("AddDiaryEntry: Inputs validation failed.");
                    }

                    return deferred.promise;
                },
                //
                // Метод изменения записи дневника.
                EditDiaryEntry: function (entry, editObj) {
                    var deferred = $q.defer();
                    var self = this;
                    var diaryEntry = entry || null;
                    var diaryEditObj = editObj || null;

                    if (diaryEntry === null) {
                        deferred.reject("DiaryEntry: Invalid Diary Entry was passed.");
                    }
                    if (diaryEditObj === null)
                    {
                        deferred.reject("EditDiaryEntry: Invalid Diary Entry was passed.");
                    }

                    var foodDiaryEntryId = diaryEntry.foodDiaryEntryId;
                    if (foodDiaryEntryId) {
                        self.isBusy = true;
                        var diaryEntryUpdateObj = {
                            foodDiaryEntryId: foodDiaryEntryId,
                            fsSelectedServingId: editObj.fsSelectedServingId,
                            ftSelectedServingId: editObj.ftSelectedServingId,
                            foodQty: editObj.foodQty,
                            isCompleted: diaryEntry.isCompleted

                        };
                        // Отсылаем запись на сервер
                        foodDiaryService.editEntry(foodDiaryEntryId, diaryEntryUpdateObj).then(function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                // Обновляем запись в массиве
                                diaryEntry.foodDiaryEntryId = data.foodDiaryEntryId;
                                diaryEntry.foodQty = data.foodQty;
                                diaryEntry.fsSelectedServingId = data.fsSelectedServingId;
                                diaryEntry.ftSelectedServingId = data.ftSelectedServingId;
                                diaryEntry.isCompleted = data.isCompleted;
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Ошибка при добавлении
                            notification.error(
                                "Error occurred while editing diary entry. Please, try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        }).finally(function () {
                            self.isBusy = false;
                        });
                    } else {
                        deferred.reject("EditDiaryEntry: 'foodDiaryEntryId' - Invalid or empty.");
                    }

                    return deferred.promise;
                },
                //
                // Метод удаления записи дневника.
                DeleteDiaryEntry: function (entry) {
                    var deferred = $q.defer();
                    var self = this;
                    var rejectMsgs = {
                        InvalidIndex: "DeleteDiaryEntry: Invalid Diary Entry index was passed.",
                        NoEntry: "DeleteDiaryEntry: No entry for such index.",
                        NoFoodDiaryEntryId: "DeleteDiaryEntry: 'foodDiaryEntryId' - Invalid or empty.",
                        ReceivedError: "Something wrong with diary entry deleting. Please, try again later."
                    };

                    var eIndex = self.DiaryEntries.indexOf(entry);
                    if (eIndex !== null) {
                        if (_.isNumber(eIndex) && !_.isNaN(eIndex)) {
                            if (self.DiaryEntries[eIndex]) {
                                var foodDiaryEntryId = self.DiaryEntries[eIndex].foodDiaryEntryId;
                                if (foodDiaryEntryId) {
                                    self.isBusy = true;
                                    // Отсылаем запрос на сервер
                                    foodDiaryService.removeEntry(foodDiaryEntryId).then(function (data) {

                                        // Удаляем из модели
                                        self.DiaryEntries.splice(eIndex, 1);

                                        deferred.resolve();
                                    },
                                    function (response) {
                                        // Ошибка при удалении
                                        notification.error(
                                            rejectMsgs.ReceivedError,
                                            "Error " + response.status
                                            );

                                        deferred.reject(response.status);
                                    }).finally(function () {
                                        self.isBusy = false;
                                    });
                                } else {
                                    deferred.reject(rejectMsgs.NoFoodDiaryEntryId);
                                }
                            } else {
                                deferred.reject(rejectMsgs.NoEntry);
                            }
                        } else {
                            deferred.reject(rejectMsgs.InvalidIndex);
                        }
                    } else {
                        deferred.reject(rejectMsgs.InvalidIndex);
                    }

                    return deferred.promise;
                },
                //
                // Метод получения запланированного потребления.
                GetPlannedNInfo: function () {
                    var deferred = $q.defer();
                    var self = this;
                    self.isBusy = true;
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
                // Get most popular food from server.
                GetMostPopularFood: function () {
                    var deferred = $q.defer();
                    var self = this;
                    self.isBusy = true;

                    foodDiaryService.getMostPopularFood().then(
                        function (data) {
                            if (!utils.isUndefinedOrNull(data)) {
                                // Circular References ($ref<->obj)
                                utils.resolveReferences(data)
                                // Clear model's most popular food array.
                                self.mostPopularFood.length = 0;
                                // Make an array from received data.
                                var mpfArray = [].concat(data);
                                if (mpfArray.length > 0) {
                                    // Add elements to the model's most popular food array.
                                    _.each(mpfArray, function (food) {
                                        var foodElement = new FoodElement();
                                        utils.copyOnlyExisting(food, foodElement);
                                        self.mostPopularFood.push(foodElement);
                                    });
                                }
                            }
                            deferred.resolve();
                        },
                        function (response) {
                            // Error.
                            notification.error(
                                "Something wrong with 'most popular food' retrieving. Please, refresh page or try again later.",
                                "Error " + response.status
                                );

                            deferred.reject(response.status);
                        }).finally(function () {
                            self.isBusy = false;
                        });
                    return deferred.promise;
                },
                //
                // Метод обновления remainingNInfo.
                UpdateRemainingNInfo: function () {
                    var self = this;
                    self.remainingNInfo.kcal = self.plannedNInfo.kcal - self.totalNInfo.kcal;
                    self.remainingNInfo.carb = self.plannedNInfo.carb - self.totalNInfo.carb;
                    self.remainingNInfo.protein = self.plannedNInfo.protein - self.totalNInfo.protein;
                    self.remainingNInfo.fat = self.plannedNInfo.fat - self.totalNInfo.fat;
                    self.remainingNInfo.sodium = self.plannedNInfo.sodium - self.totalNInfo.sodium;
                    self.remainingNInfo.sugar = self.plannedNInfo.sugar - self.totalNInfo.sugar;
                },
                //
                // Метод обновления потребленной пищевой ценности приема пищи.
                UpdateMealTimeNInfo: function () {
                    var self = this;
                    if (self.DiaryEntries.length > 0) {
                        // Обнуляем информацию о потребленной пищевой ценности всех приемов пищи
                        self.mealTimesNInfo = _.range(_.keys(this.MEALTIMES).length).map(function () { return new FoodNutrition(); });
                        var completedEntries = _(self.DiaryEntries).where({ isCompleted: true });
                        var mealTimes = _(completedEntries).groupBy('mealTimeIndex');

                        _(mealTimes).map(function (mt, key) {
                            self.mealTimesNInfo[key].kcal = self.RoundToDigit(_(mt).reduce(function (sum, entry) {
                                return sum + (entry.foodQty * entry.selectedServing.calories);
                            }, 0), 0);
                            self.mealTimesNInfo[key].carb = self.RoundToDigit(_(mt).reduce(function (sum, entry) {
                                return sum + (entry.foodQty * entry.selectedServing.carbohydrate);
                            }, 0), 0);
                            self.mealTimesNInfo[key].protein = self.RoundToDigit(_(mt).reduce(function (sum, entry) {
                                return sum + (entry.foodQty * entry.selectedServing.protein);
                            }, 0), 0);
                            self.mealTimesNInfo[key].fat = self.RoundToDigit(_(mt).reduce(function (sum, entry) {
                                return sum + (entry.foodQty * entry.selectedServing.fat);
                            }, 0), 0);
                            self.mealTimesNInfo[key].sodium = self.RoundFloat(_(mt).reduce(function (sum, entry) {
                                return sum + (entry.foodQty * entry.selectedServing.sodium);
                            }, 0));
                            self.mealTimesNInfo[key].sugar = self.RoundFloat(_(mt).reduce(function (sum, entry) {
                                return sum + (entry.foodQty * entry.selectedServing.sugar);
                            }, 0));
                        });
                        //Обновляем общую потребленную пищевую ценность
                        self.totalNInfo.kcal = self.RoundToDigit(_(self.mealTimesNInfo).reduce(function (sum, entry) {
                            return sum + entry.kcal;
                        }, 0), 0);
                        self.totalNInfo.carb = self.RoundToDigit(_(self.mealTimesNInfo).reduce(function (sum, entry) {
                            return sum + entry.carb;
                        }, 0), 0);
                        self.totalNInfo.protein = self.RoundToDigit(_(self.mealTimesNInfo).reduce(function (sum, entry) {
                            return sum + entry.protein;
                        }, 0), 0);
                        self.totalNInfo.fat = self.RoundToDigit(_(self.mealTimesNInfo).reduce(function (sum, entry) {
                            return sum + entry.fat;
                        }, 0), 0);
                        self.totalNInfo.sodium = self.RoundFloat(_(self.mealTimesNInfo).reduce(function (sum, entry) {
                            return sum + entry.sodium;
                        }, 0));
                        self.totalNInfo.sugar = self.RoundFloat(_(self.mealTimesNInfo).reduce(function (sum, entry) {
                            return sum + entry.sugar;
                        }, 0));
                    } else {
                        _.each(self.mealTimesNInfo, function (mt) {
                            mt.kcal = 0;
                            mt.carb = 0;
                            mt.protein = 0;
                            mt.fat = 0;
                            mt.sodium = 0;
                            mt.sugar = 0;
                        });
                        self.totalNInfo.kcal = 0;
                        self.totalNInfo.carb = 0;
                        self.totalNInfo.protein = 0;
                        self.totalNInfo.fat = 0;
                        self.totalNInfo.sodium = 0;
                        self.totalNInfo.sugar = 0;
                    }
                },
                //
                // Метод инициализации модели.
                InitModel: function () {
                    var self = this;
                    return $q.all([
                        self.LoadDiaryEntries(),
                        self.GetPlannedNInfo()
                    ]);
                }
            };

            return DiaryModel;
        }]);
})(angular, fitotrack);