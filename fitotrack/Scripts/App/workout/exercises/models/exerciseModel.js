
/**
 * @fileOverview
 * exerciseModel.js
 * Exercise model implementation.
 */

(function (ng, app, _) {
    'use strict';

    app.factory('workout.exercise.Model',
        [
            '$q',
            'utilsService',
            'workout.exercise.Service',
            'workout.exercise.Element',
            'notificationService',
            function ($q, utils, exerciseService, ExerciseElement, notification) {

                function ExerciseModel()
                {
                    this.isBusy = false;
                    this.exercise = new ExerciseElement();
                }

                //
                // Функции
                ExerciseModel.prototype = {
                    //
                    // Метод получения информации об упражнении.
                    get: function (exerciseId) {
                        var deferred = $q.defer();
                        var self = this;
                        self.isBusy = true;
                        
                        exerciseService.get(exerciseId).then(
                                function (data) {
                                    if (data) {
                                        // Обработка Circular References ($ref<->obj)
                                        utils.resolveReferences(data);

                                        self.exercise = data;
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
                    }
                };
        
        return ExerciseModel;
    }]);
})(angular, fitotrack, _);