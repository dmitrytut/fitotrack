

/** @fileOverview 
    MealFoodDiaryEntryCtrl.js
    Food diary entry controller.
*/

(function (ng, app, moment) {
    'use strict';

    app.controller('meal.food.DiaryEntryCtrl',
    [
        '$scope',
        'appCfg',
        function ($scope, appCfg) {

            $scope.Internal = {
                appCfg: appCfg
            };

            // Инициализируем переменные
            $scope.isEditMode = false;
            $scope.currentServing = {};
            $scope.foodQty = 0;
            $scope.isCompleted = false;

            // Forms.
            $scope.Forms = {
                foodDiaryEntryForm: {}
            };

            // Assosiate form with form object from template.
            $scope.setForm = function (name, form) {
                if ($scope.Forms[name]) {
                    $scope.Forms[name] = form;
                }
            };

            // Включить режим редактирования
            $scope.EditModeOn = function (entry) {
                $scope.foodQty = entry.foodQty;
                $scope.currentServing = entry.selectedServing;
                $scope.isCompleted = entry.isCompleted;

                $scope.isEditMode = true;
            };

            // Выключить режим редактирования
            $scope.EditModeOff = function () {
                $scope.isEditMode = false;
            };

            // Сохранить изменения в записи
            $scope.EditDiaryEntry = function (entry) {
                
                // Broadcast validation check event.
                $scope.$broadcast('show-errors-check-validity');
                if ($scope.Forms.foodDiaryEntryForm.$invalid) {
                    return;
                }

                // Если были изменения
                if (entry.foodQty !== parseInt($scope.foodQty, 10) ||
                    entry.fsSelectedServingId !== $scope.currentServing.serving_id ||
                    entry.ftSelectedServingId !== $scope.currentServing.ft_serving_id ||
                    entry.isCompleted !== $scope.isCompleted) {
                    var editObj = {
                        foodQty: $scope.foodQty,
                        fsSelectedServingId: $scope.currentServing.serving_id,
                        ftSelectedServingId: $scope.currentServing.ft_serving_id,
                        isCompleted: $scope.isCompleted
                    };

                    // Посылаем "вверх" событие изменения записи
                    $scope.$emit('ftFoodDiaryEntryChanged', entry, editObj);
                }
                $scope.EditModeOff();
            };

            $scope.ToggleIsCompleted = function (entry) {
                entry.isCompleted = !entry.isCompleted;
                var editObj = {
                    foodQty: entry.foodQty,
                    fsSelectedServingId: entry.selectedServing.serving_id,
                    ftSelectedServingId: entry.selectedServing.ft_serving_id,
                    isCompleted: entry.isCompleted
                };

                // Посылаем "вверх" событие изменения записи
                $scope.$emit('ftFoodDiaryEntryChanged', entry, editObj);
            };
        }
    ]);
})(angular, fitotrack, moment);
