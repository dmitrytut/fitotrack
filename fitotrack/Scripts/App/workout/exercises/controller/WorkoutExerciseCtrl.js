

/** @fileOverview 
    WorkoutExerciseCtrl.js 
    Exercise controller.
*/

(function (ng, app) {
    'use strict';

    app.controller('workout.exercise.Ctrl',
        [
            '_',
            '$scope',
            '$stateParams',
            '$location',
            'appService',
            'utilsService',
            'workout.exercise.Model',
            'notificationService',
        function (_, $scope, $stateParams, $location, appSvc, utils, ExerciseModel, notification) {

            var exerciseViewTitle = "Exercise Information";
            appSvc.setTitle(exerciseViewTitle);

            //Идентификатор упражнения из URL.
            var exerciseId = parseInt($stateParams.exerciseId);

            $scope.Model = new ExerciseModel();

            //Инициализация.
            $scope.Init = function () {
                if (!_.isNaN(exerciseId)) {
                    $scope.Model.get(exerciseId).then(function () {
                        appSvc.setTitle("'" + $scope.Model.exercise.title + "' " + exerciseViewTitle);
                    });
                }
            };
            $scope.Init();

            // Получение упражнения с сервера.
            $scope.getExercise = function () {
                $scope.Model.get(exerciseId).then(function () {
                    console.log($scope.Model.exercise);
                });
            };
        }]);
})(angular, fitotrack);
