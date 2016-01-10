//
//Base Model for search entity 

(function (ng, app) {
    'use strict';

    app.factory('meal.food.SearchBaseModel',
        [
            'meal.food.Service',
            'utilsService',
            'notificationService',
            function (foodService, utils, notification) {

                //
                // Конструктор
                function BaseSearchModel(defaultPageSize) {
                    this.query = "";
                    this.pageNum = 0;
                    this.pageSize = defaultPageSize || 10;
                    this.isBusy = false;
                    this.isNothing = false;
                    this.results = {};
                }

                BaseSearchModel.prototype = {
                    //
                    //Метод поиска
                    search: function () {
                        var self = this;
                        self.isBusy = true;
                        self.isNothing = false;
                        foodService.search(self.query, self.pageNum, self.pageSize).then(
                                function (data) {
                                    if (utils.isUndefinedOrNull(data) ||
                                        utils.isUndefinedOrNull(data.food) ||
                                        data.food.length === 0 ||
                                        (data.food.length === 1 && data.food[0] === null)) {
                                        self.results.food = {};
                                        self.isNothing = true;
                                    } else {
                                        // Обработка Circular References ($ref<->obj)
                                        utils.resolveReferences(data);
                                        self.results = data;
                                    }
                                },
                                function (response) {
                                    notification.error("Search error status: " + response.status);
                                }
                            ).finally(
                                function () {
                                    self.isBusy = false;
                                });
                    },
                    //
                    // Метод определения показа результатов (из-за сложности ответа от FS)
                    IsSearchResShow: function () {
                        var self = this;
                        return ((self.results.food) && (self.results.food.length > 0) && (!self.isNothing));
                    },
                    //
                    // Метод очистки результатов
                    clear: function () {
                        this.results = {};
                        this.pageNum = 0;
                    },
                    //
                    // Метод инициализации
                    init: function () {
                        this.query = "",
                        this.pageNum = 0,
                        this.isBusy = false,
                        this.isNothing = false,
                        this.results = {};
                    }
                };

                return BaseSearchModel;
            }]);
})(angular, fitotrack);