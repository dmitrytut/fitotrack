
/**
 * @fileOverview
 * foodDiaryEntryModel.js
 * Model for food diary entry
 */

(function (ng, app) {
    'use strict';

    app.factory('meal.food.DiaryEntryModel',
        [
            '_',
            'meal.food.Element',
            'meal.food.ServingElement',
            'utilsService',
            function (_, FoodElement, ServingElement, utils) {

                //
                // Конструктор
                function DiaryEntry(fdeId, mtIdx, food, fsSelServId, ftSelServId, selServing, qty, isCompleted, date, creationTime, createUserId) {
                    //
                    // Идентификатор записи в дневнике
                    this.foodDiaryEntryId = fdeId || 0;
                    //
                    // Индекс приема пищи. 0-3: завтрак-перекусы
                    this.mealTimeIndex = mtIdx || 0;
                    //
                    // Записываемая еда
                    this.food = food || new FoodElement();
                    //
                    // Идентификатор порции в FS
                    this.fsSelectedServingId = fsSelServId || 0;
                    //
                    // Идентификатор порции в FT
                    this.ftSelectedServingId = ftSelServId || 0;
                    //
                    // Выбранная порция
                    this.selectedServing = selServing || new ServingElement();
                    //
                    // Количество съеденной порции еды
                    this.foodQty = qty || 0;
                    //
                    // Выполнена ли запись
                    this.isCompleted = utils.isUndefinedOrNull(isCompleted) ? true : isCompleted;
                    //
                    // Дата дня, соответствующий записи
                    this.date = date || 0;
                    //
                    // Время сохранения в БД
                    this.creationTime = creationTime || 0;
                    //
                    // Пользователь
                    this.createUserId = createUserId || 0;
                }

                DiaryEntry.prototype = {
                    SetSelectedServing: function (ftServingId, servingId) {
                        var self = this;

                        if (ftServingId !== 0) {
                            self.selectedServing = self.food.servings.serving ? _.findWhere(self.food.servings.serving, { ft_serving_id: ftServingId }) : {};
                        } else {
                            if (servingId !== 0) {
                                self.selectedServing = self.food.servings.serving ? _.findWhere(self.food.servings.serving, { serving_id: servingId }) : {};
                            }
                        }
                    }
                };

                return DiaryEntry;
            }]);
})(angular, fitotrack);