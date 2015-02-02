var brUtils = brUtils || {};

(function() {
	var self = brUtils;

	self.setTimeout = function(fn, time) {
		return window.setTimeout(fn, time);
	};

	self.storage = localStorage;

	self.notificationsSupported = function() {
		return typeof chrome.notifications !== "undefined";
	};

	self.extractNotifications = function(content) {
		var result = cnUtil.parseContent(content);
		corenotify.updateUi(result[0], result[1], result[2]);
	};

	self.withView = function(viewUrl, action) {
		var views = chrome.extension.getViews();
		for (var i = 0; i < views.length; i++) {
			var view = views[i];
			var url = view.location.protocol + "//" + view.location.hostname + view.location.pathname;
			if (url == viewUrl) {
				action(view);
			}
		}
	};

	self.setBadge = function(text) {
		chrome.browserAction.setBadgeText({text: text});
	};

	self.getViewTabUrl = function() {
		return chrome.extension.getURL('popup.html');
	};

	self.fetchHtml = function(_url, onDone) {
		$.ajax({
			url: _url
		}).success(function(data) {
			cnUtil.log("http call done");
			onDone(data);
		}).fail(function(xhr, status, thrown) {
			cnUtil.log("http call failed: " + xhr + " " + status + " " + thrown);
		});
	};

})();