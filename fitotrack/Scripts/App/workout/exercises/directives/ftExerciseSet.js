
/**
 * @fileOverview
 * ftExerciseSets.js
 * Exercise set directive that dynamically chooses templateUrl according to exercise type.
 */

(function (ng, app) {
	'use strict';

	app.directive('ftExerciseSet',
		[
			'$http',
			'$compile',
			'$templateCache',
			'appCfg',
			'workout.diary.SetElement',
			function ($http, $compile, $templateCache, appCfg, SetElement) {
				var templateText, templateLoader,
				baseURL = appCfg.tplBaseUrl,
				typeTemplateMapping = {
					cardio: 'workout/exercises/FtExerciseSet/exercise.set.cardio',
					strength: 'workout/exercises/FtExerciseSet/exercise.set.strength',
					game: 'workout/exercises/FtExerciseSet/exercise.set.game'
				};

				var getTemplateName = function (exerciseType) {
					switch (exerciseType) {
						case appCfg.ExerciseType.Cardio:
							return typeTemplateMapping.cardio;
						case appCfg.ExerciseType.Strength:
							return typeTemplateMapping.strength;
						case appCfg.ExerciseType.Game:
							return typeTemplateMapping.game;
						default:
							return "";
					}
				};

				return {
					restrict: 'E',
					replace: false,
					scope: {
						set: '=',
						setIndex: '@',
						exerciseType: '@'
					},
					controller: ['$scope', '$attrs', function ($scope, $attrs) {
						$scope.Internal = {
							appCfg: appCfg,
							isEditMode: $scope.set.Internal.isEditMode,
							tempExerciseSet: $scope.set
						};

					    // Forms.
						$scope.Forms = {
						    exerciseSetForm: {}
						};

					    // Assosiate form with form object from template.
						$scope.setForm = function (name, form) {
						    if ($scope.Forms[name]) {
						        $scope.Forms[name] = form;
						    }
						};

						$scope.SetEditMode = function (isEditMode) {
							// Check if edit mode is not canceled.
							if (isEditMode) {
								// Editing started.
								$scope.Internal.tempExerciseSet = new SetElement();
								angular.copy($scope.set, $scope.Internal.tempExerciseSet);
							} else {
							    // Editing completed.

							    // Broadcast validation check event.
							    $scope.$broadcast('show-errors-check-validity');
							    if ($scope.Forms.exerciseSetForm.$invalid) {
							        return;
							    }

								if ($scope.Internal.tempExerciseSet !== $scope.set) {
									angular.copy($scope.Internal.tempExerciseSet, $scope.set);
								}
								// Send set changed event "up".
								$scope.$emit('ftWorkoutDiaryEntrySetChanged', $scope.set);
							}
							
							$scope.Internal.isEditMode = isEditMode;
						};

						$scope.CancelEditMode = function () {
							$scope.Internal.isEditMode = false;
						};

						$scope.CopySet = function () {
							// Send set copy event "up".
							$scope.$emit('ftWorkoutDiaryEntrySetCopy', $scope.set);
						};

						$scope.DeleteSet = function () {
							// Send set delete event "up".
							$scope.$emit('ftWorkoutDiaryEntrySetDeleted', $scope.set);
						};

						$scope.ToggleIsCompleted = function () {
							$scope.set.isCompleted = !$scope.set.isCompleted;
						};
					}],
					link: function (scope, element, attrs) {
						var exerciseType = parseInt(scope.exerciseType, 10);
						if (scope.set && !isNaN(exerciseType)) {
							var tplURL = baseURL + getTemplateName(exerciseType);
							templateLoader = $http.get(tplURL, { cache: $templateCache })
							  .success(function (html) {
								  element.html($compile(html)(scope));
							  });
						}
					}
				};
			}
		]);
})(angular, fitotrack);