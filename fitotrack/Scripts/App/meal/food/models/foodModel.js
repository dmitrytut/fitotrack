//
//Model for Food entity

//**** NEW STYLED

(function (ng, app) {
    'use strict';

    app.factory('meal.food.Model',
        [
            '_',
            '$q',
            'utilsService',
            'meal.food.Service',
            'meal.food.Element',
            'notificationService',
            function (_, $q, utils, foodService, FoodElement, notification) {

                //
                // Конструктор
                function FoodModel()
                {
                    this.isBusy = false;
                    this.isNothing = false;
                    this.currentServing = {};
                    this.food = new FoodElement();
                }

                //
                // Функции
                FoodModel.prototype = {
                    //
                    // Метод получения информации о еде
                    Get: function (foodId) {
                        var deferred = $q.defer();
                        var self = this;
                        self.isBusy = true;
                        self.isNothing = false;
                        //self.currentServing = {};
                        foodService.get(foodId).then(
                                function (data) {
                                    if (data) {
                                        // Обработка Circular References ($ref<->obj)
                                        utils.resolveReferences(data);

                                        self.food = data;
                                        self.SetCurrentServing(
                                            self.food.servings.serving[0].ft_serving_id,
                                            self.food.servings.serving[0].serving_id);
                                    }
                                    deferred.resolve();
                                },
                                function (response) {
                                    notification.error("Fetching error status: " + response.status);
                                    deferred.reject(response.status);
                                }
                            ).finally(
                                function () {
                                    self.isBusy = false;
                                });
                        return deferred.promise;
                    },
                    // 
                    // Метод выбора порции
                    SetCurrentServing: function (ftServingId, servingId) {
                        var self = this;
                        var fBusy = false;
                        if (self.isBusy !== true) {
                            self.isBusy = true;
                            fBusy = true;
                        }
                        self.currentServing = {};
                        if (ftServingId) {
                            self.currentServing = self.food.servings.serving ? _.findWhere(self.food.servings.serving, { ft_serving_id: ftServingId }) : {};
                        } else {
                            if (servingId) {
                                self.currentServing = self.food.servings.serving ? _.findWhere(self.food.servings.serving, { serving_id: servingId }) : {};
                            }
                        }
                        if (fBusy) {
                            self.isBusy = false;
                        }
                    },
                    // 
                    // Метод возвращает порцию
                    GetServing: function (ftServingId, servingId) {
                        var self = this;

                        var resServing = {};
                        if (ftServingId !== 0) {
                            resServing = self.food.servings.serving ? _.findWhere(self.food.servings.serving, { ft_serving_id: ftServingId }) : {};
                        } else {
                            if (servingId !== 0) {
                                resServing = self.food.servings.serving ? _.findWhere(self.food.servings.serving, { serving_id: servingId }) : {};
                            }
                        }

                        return resServing;
                    }
                };
        
        return FoodModel;
    }]);
})(angular, fitotrack);