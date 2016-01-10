
/**
 * @fileOverview
 * ftWorkoutDiaryEntry.js
 * Workout diary entry directive.
 */

(function (ng, app) {
	'use strict';

	app.directive('ftWorkoutDiaryEntry',
		[
			'_',
			'appCfg',
			'utilsService',
			'workout.diary.SetElement',
			'workout.diary.EntryElement',
			function (_, appCfg, utils, SetElement, WorkoutDiaryEntryElement) {
				return {
					restrict: 'E',
					replace: true,
					scope: {
						diaryEntry: '='
					},
					templateUrl: appCfg.tplBaseUrl + 'workout/diary/FtWorkoutDiaryEntry/workout.diary.entry',
					controller: ['$scope', '$attrs', function ($scope, $attrs) {
						$scope.Internal = {
							exerciseTypes: appCfg.ExerciseType,
							isExpanded: false
						};

						// Formatting summary for cardio workouts.
						$scope.CardioExerciseSummaryStr = function () {
							var format = "%s m in %s minutes";
							var noSets = "Empty workout";
							if (!_.isEmpty($scope.diaryEntry.sets) &&
								!utils.isUndefinedOrNull($scope.diaryEntry.sets[0].distance) &&
								!utils.isUndefinedOrNull($scope.diaryEntry.sets[0].duration)) {
								return _.str.sprintf(
									format,
									$scope.diaryEntry.sets[0].distance,
									$scope.diaryEntry.sets[0].duration);
							}
							return noSets;
						};

						// Formatting summary for strength workouts.
						$scope.StrengthExerciseSummaryStr = function () {
							var format = "%s Sets of %s Reps on %s kg";
							var noSets = "Empty workout";
							var setsCount = utils.isUndefinedOrNull($scope.diaryEntry.sets) ? 0 : $scope.diaryEntry.sets.length;
							var repsRange = '';
							var weightRange = '';
							if (!_.isEmpty($scope.diaryEntry.sets)) {
								// Reps range.
								var repsList = _.map($scope.diaryEntry.sets, function (val) {
									return val.reps || 0;
								});
								var minReps = _.min(repsList);
								var maxReps = _.max(repsList);
								repsRange = (minReps !== maxReps) ? (minReps + "-" + maxReps) : maxReps;
								// Weight range.
								var weightList = _.map($scope.diaryEntry.sets, function (val) {
									return val.weight || 0;
								});
								var minWeight = _.min(weightList);
								var maxWeight = _.max(weightList);
								weightRange = (minWeight !== maxWeight) ? (minWeight + "-" + maxWeight) : maxWeight;

								return _.str.sprintf(format, setsCount, repsRange, weightRange);
							}
							return noSets;
						};

						// Formatting summary for game workouts.
						$scope.GameExerciseSummaryStr = function () {
							var format = "%s minutes";
							var noSets = "Empty workout";
							if (!_.isEmpty($scope.diaryEntry.sets) &&
								!utils.isUndefinedOrNull($scope.diaryEntry.sets[0].duration)) {
								return _.str.sprintf(
									format,
									$scope.diaryEntry.sets[0].duration);
							}
							return noSets;
						};

						// Choose proper summary string.
						$scope.SummaryStr = function () {
							switch ($scope.diaryEntry.exercise.type) {
								case appCfg.ExerciseType.Cardio:
									return $scope.CardioExerciseSummaryStr();
								case appCfg.ExerciseType.Strength:
									return $scope.StrengthExerciseSummaryStr();
								case appCfg.ExerciseType.Game:
									return $scope.GameExerciseSummaryStr();
								default:
									return "";
							}
						};

						// Is Add Set button show
						$scope.IsAddSetShow = function () {
							return $scope.diaryEntry.exercise.type == $scope.Internal.exerciseTypes.Strength;
						};

						$scope.ToggleExpanded = function () {
							$scope.Internal.isExpanded = !$scope.Internal.isExpanded;
						};

						$scope.GetSetLastOrder = function () {
							var orderList = _.map($scope.diaryEntry.sets, function (val) {
								return val.order || 0;
							});
							return orderList.length == 0 ? 0: _.max(orderList);
						};

						$scope.AddNewSet = function () {
							var newSet = new SetElement();
							newSet.Internal.isEditMode = true;
							// Set order as increment of maximum existing order.
							newSet.order = $scope.GetSetLastOrder() + 1;
							$scope.diaryEntry.sets.push(newSet);
						};

						$scope.DeleteEntry = function (event) {
							event.stopPropagation();
							// Send delete event "up".
							$scope.$emit('ftWorkoutDiaryEntryDelete', $scope.diaryEntry);
						};

						// Set workout diary entry changed handler.
						$scope.$on("ftWorkoutDiaryEntrySetChanged", function (event, set) {
							if (utils.isUndefinedOrNull(set) || event.defaultPrevented) {
								return;
							}
							// Send diary changed event "up".
							$scope.$emit('ftWorkoutDiaryEntryChanged', $scope.diaryEntry);
						});

						// Set workout set copy handler.
						$scope.$on("ftWorkoutDiaryEntrySetCopy", function (event, set) {
							if (utils.isUndefinedOrNull(set) || event.defaultPrevented) {
								return;
							}
							// Delete workoutSetId.
							set.workoutSetId = 0;
							// Push set copy to the diary entry sets.
							set.order = $scope.GetSetLastOrder() + 1;
							$scope.diaryEntry.sets.push(set);
							// Send diary changed event "up".
							$scope.$emit('ftWorkoutDiaryEntryChanged', $scope.diaryEntry);
						});

						// Set workout set deleted handler.
						$scope.$on("ftWorkoutDiaryEntrySetDeleted", function (event, set) {

							if (utils.isUndefinedOrNull(set) || event.defaultPrevented) {
								return;
							}
							var setToDeleteIndex = $scope.diaryEntry.sets.indexOf(set);
							if (setToDeleteIndex >= 0) {
								// Delete from model.
								//$scope.diaryEntry.sets.splice(setToDeleteIndex, 1);
								// Send set deleted event "up".
								$scope.$emit('ftWorkoutSetDeleted', $scope.diaryEntry, set);
							}
						});
					}],
					link: function (scope, element, attrs) {
						if (scope.diaryEntry) {}
					}
				};
			}
		]);
})(angular, fitotrack);