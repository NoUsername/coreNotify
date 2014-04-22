(function() {
	var coreNotify = angular.module('coreNotify', []);

	coreNotify.controller('OptionsController', function($scope, $timeout, $http) {
		$scope.sites = cnDefs.CORE_SITES;
		$scope.url = cnUtil.baseUrl();
		$scope.showDesktopNotifications = cnUtil.showNotifications();
		$scope.savedInfo = false;
		$http({url: "./changelog.txt"}).success(function(result) {
			$scope.changelog = result;
		});


		$scope.saveSite = function() {
			var url = $scope.url;
			if (url.length < 4) {
				$scope.url = "INVALID!";
				return;
			}
			if (cnUtil.strEndsWith(url, "/")) {
				$scope.url = url.substring(0, url.length-1);
			}
			cnUtil.baseUrl($scope.url);
			cnUtil.showNotifications($scope.showDesktopNotifications);
			console.log("base url=" + cnUtil.baseUrl());
			console.log("notifications=" + cnUtil.showNotifications());
			cnUtil.triggerRefresh();
			$scope.savedInfo = true;
			$timeout(function() {
				$scope.savedInfo = false;
			}, 1000);
		};
	});

})();