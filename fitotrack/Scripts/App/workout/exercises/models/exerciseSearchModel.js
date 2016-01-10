//
//Base Model for search entity 

(function (ng, app) {
    'use strict';

    app.factory('workout.exercise.SearchModel',
        [
            'workout.exercise.Service',
            'utilsService',
            'notificationService',
            function (exerciseService, utils, notification) {

                //
                // Конструктор.
                function ExerciseSearchModel(defaultPageSize) {
                    this.query = "";
                    this.pageIndex = 0;
                    this.pageSize = defaultPageSize || 10;
                    this.isBusy = false;
                    this.isNothing = false;
                    this.results = {};
                }

                ExerciseSearchModel.prototype = {
                    //
                    //Метод поиска.
                    search: function () {
                        var self = this;
                        self.isBusy = true;
                        self.isNothing = false;
                        exerciseService.search(self.query, self.pageIndex, self.pageSize).then(
                                function (data) {
                                    if (utils.isUndefinedOrNull(data)) {
                                        self.results = [];
                                        self.isNothing = true;
                                    } else {
                                        // Обработка Circular References ($ref<->obj)
                                        utils.resolveReferences(data);
                                        self.results = data;
                                    }
                                    
                                },
                                function (response) {
                                    notification.error("Search error: " + response.status);
                                }
                            ).finally(
                                function () {
                                    self.isBusy = false;
                                });
                    }
                };

                return ExerciseSearchModel;
            }]);
})(angular, fitotrack);