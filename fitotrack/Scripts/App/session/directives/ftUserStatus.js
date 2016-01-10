
/**
 * @fileOverview
 * ftUserStatus.js
 * Directive for user's status.
 */

(function (ng, app) {
	'use strict';

	app.directive('ftUserStatus',
		[
			'$q',
			'$timeout',
			'appCfg',
			'session.Service',
			'notificationService',
			function ($q, $timeout, appCfg, sessionSvc, notification) {
				return {
					restrict: 'E',
					templateUrl: "/tpl/partial?name=session/ftUserStatus/ft.user.status",
					replace: true,
					required: 'ngModel',
					scope: {
						ngModel: '='
					},
					controller: ['$scope', '$attrs', function ($scope, $attrs) {
						$scope.Internal = {
							appCfg: appCfg,
							tempStatus: undefined,
							isEditMode: false
						};

						$scope.isStatusSet = function () {
							if (ng.isDefined($scope.ngModel) && $scope.ngModel != null)
							{
								return $scope.ngModel.length > 0;
							}
							return false;
						};

						// Set edit mode.
						$scope.SetEditMode = function (isEditMode) {
							if (isEditMode) {
								// Editing started.
								$scope.Internal.tempStatus = $scope.ngModel;
							} else {
								// Editing completed.
								if ($scope.Internal.tempExerciseSet !== $scope.ngModel) {
									// Send status to the server.
									sessionSvc.setUserStatus($scope.Internal.tempStatus).then(function (data) {
									    // Emit ftProfileChanged event function.
									    $scope.$emit('ftProfileChanged', data);
									});
								}
							}
							$scope.Internal.isEditMode = isEditMode;
						};
						
						// Cancel editing.
						$scope.CancelEditMode = function () {
							$scope.Internal.isEditMode = false;
						};
					}],
					link: function (scope, element, attrs) {
						scope.$watch('Internal.isEditMode', function (newValue, oldValue) {
							if (newValue !== oldValue && newValue === true) {
								// Set focus on status input when edit mode true.
								$timeout(function () {
									var inputStatus = $(element).find('#_fus_e_m_status');
									if (inputStatus.length) {
										inputStatus.focus();
									}
								});
							}
						});
					}
				};
			}
		]);
})(angular, fitotrack);