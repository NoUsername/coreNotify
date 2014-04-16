(function() {
	var coreNotify = angular.module('coreNotify', []);

	coreNotify.controller('OptionsController', function($scope) {
		$scope.sites = cnDefs.CORE_SITES;
		$scope.url = localStorage.siteUrl;

		$scope.saveSite = function() {
			var url = $scope.url;
			if (url.length < 4) {
				$scope.url = "INVALID!";
				return;
			}
			if (cnUtil.strEndsWith(url, "/")) {
				$scope.url = url.substring(0, url.length-1);
			}
			localStorage.siteUrl = $scope.url;
			cnUtil.triggerRefresh();
		};
	});

})();