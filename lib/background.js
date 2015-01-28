var corenotify = corenotify || {};

if (typeof require != 'undefined') {
	var brUtils = require("ff-utils").brUtils;
	var cnUtil = require("defs").cnUtil;
}
console.log("background.js loaded");

(function() {

var self = corenotify;

var TIMEOUT = self.TIMEOUT = 60*1000;

var localStorage = brUtils.storage;

function onNotificationClicked() {
	chrome.tabs.create({'url': cnUtil.baseUrl()});
}

function notificationsSupported() {
	return brUtils.notificationsSupported();
}

if (notificationsSupported()) {
	chrome.notifications.onClicked.addListener(function(notificationId) {
		onNotificationClicked();
		chrome.notifications.clear(notificationId, cnUtil.nullCallback);
	});
}

self.showNotification = function() {
	if (!cnUtil.toBool(cnUtil.showNotifications())) {
		console.log("notifications disabled");
		return;
	}
	var callback = function() {
	  		notification.cancel();
	  		onNotificationClicked();
	  	};
	var opt = {
		type: "basic",
		title: "CORE smartwork",
		message: "There are new CORE updates",
		iconUrl: "data/coreLogo.png"
	  };
	  if (notificationsSupported()) {
	  	var notification = chrome.notifications.create("", opt, cnUtil.nullCallback);
	  	console.log("notification: ", notification);
	  } else {
	  	console.log("notifications not supported!");
	  }
};

function extractNotifications(content, callback) {
	brUtils.extractNotifications(content);
}

function fetchHtml(onDone) {
	var _url = cnUtil.baseUrl() + "/my/index";
	console.log("http call to " + _url);
	brUtils.fetchHtml(_url, onDone);
}

self.setBadge = function(text) {
	brUtils.setBadge(text);
};

function currentTimeFormatted() {
	var date = new Date();
	var result = "";
	result += (date.getHours() + ":");
	result += (date.getMinutes() + ":");
	result += (date.getSeconds() + " ");
	result += (date.getDate()+ "." + (date.getMonth()+1)+"."+(date.getYear()+1900));
	return result;
}

self.updateUi = function(notificationCount, htmlSummary) {
	if (notificationCount > 0) {
		self.setBadge(notificationCount.toString());
	} else {
		self.setBadge("");
	}
	var summaryForView = htmlSummary + '<div class="meta-info">last check: ' + currentTimeFormatted() + '</div>';
	localStorage.notificationSummary = summaryForView;
	// also update popups
	brUtils.withView(brUtils.getViewTabUrl(), function(view) {
		if (summaryForView) {
			view.setContent(summaryForView);
		} else {
			view.setContent("news: " + (notificationCount).toString());
		}
	});
}

function isLoggedIn(data) {
	return !!data && data.indexOf('id="login-page"') == -1;
}

self.updateNotifications = function() {
	console.log("updateNotifications @ " + (new Date().getTime()/1000));
	fetchHtml(function(data) {
		if (!isLoggedIn(data)) {
			console.log('not logged  in!');
			self.updateUi(0, '<div>Please <a id="notLoggedIn" href="#">log in</a> to CORE smartwork.</div>');
			self.setBadge("!");
			return;
		}
		var result = extractNotifications(data);
	});
};

self.handleNotifications = function(notificationCount, summary) {
	var oldValue = localStorage.notificationCount
	if (oldValue !== undefined && parseInt(oldValue,10) < parseInt(notificationCount, 10)) {
		try {
			self.showNotification();
		} catch(e) {
			console.log("could not show notification: ", e);
		}
	} else {
		console.log("no new notifications");
	}
	localStorage.notificationCount = notificationCount;
	console.log("notifications: " + notificationCount);
	self.updateUi(notificationCount, summary);
};

self.triggerBackgroundTask = function() {
	brUtils.setTimeout(self.triggerBackgroundTask, TIMEOUT);
	console.log("background check");
	self.updateNotifications();
};

})();

if (typeof exports != 'undefined') {
	exports.corenotify = corenotify;
}