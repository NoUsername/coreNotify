var brUtils = brUtils || {};

(function() {
	var self = brUtils;
	var uiPanel = null;
	var coreButton = null;

	self.storage = null;

	if (typeof require != 'undefined') {
		var _setTimeout = require('sdk/timers').setTimeout;
		var Request = require("sdk/request").Request;
		var ss = require("sdk/simple-storage");
		self.storage = ss.storage;
	} else {
		var _setTimeout = window.setTimeout;
	}

	self.init = function(button, _uiPanel, parsedContentCallback) {
		coreButton = button;
		uiPanel = _uiPanel;

		uiPanel.port.on("parsedContent", function(count, summary) {
			parsedContentCallback(count, summary);
		});
	};

	self.setTimeout = function(fn, time) {
		return _setTimeout(fn, time);
	};

	self.notificationsSupported = function() {
		console.log("notifications not implemented");
		return false;
	};

	self.withView = function(viewUrl, action) {
		action({setContent:function(content) {
			uiPanel.port.emit("updateContent", content);
		}});
	};

	self.setBadge = function(badge) {
		console.log("setting badge on " + coreButton + " to " + badge);
		coreButton.badge = badge;
	};

	self.getViewTabUrl = function() {
		return "not-implemented";
	};

	self.fetchHtml = function(_url, onDone) {
		Request({
			url: _url,
			onComplete: function (response) {
				console.log("http done");
				onDone(response.text);
			}
		}).get();
	};

	self.extractNotifications = function(data) {
		uiPanel.port.emit("parseContent", data);
	}
	
})();

if (typeof exports != 'undefined') {
	exports.brUtils = brUtils;
}