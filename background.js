var corenotify = {};

(function() {

var self = corenotify;

var TIMEOUT = 30*1000;

var viewTabUrl = chrome.extension.getURL('popup.html');

function onNotificationClicked() {
	chrome.tabs.create({'url': cnUtil.baseUrl()});
}

function notificationsSupported() {
	return typeof chrome.notifications !== "undefined";
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
		title: "Core Smartwork",
		message: "There are new core updates",
		iconUrl: "coreLogo.png"
	  };
	  if (notificationsSupported()) {
	  	var notification = chrome.notifications.create("", opt, cnUtil.nullCallback);
	  	console.log("notification: ", notification);
	  } else {
	  	console.log("notifications not supported!");
	  }
};

function extractNotifications(content) {
	var select = $(content).find('ul.nav-list .badge');
	var count = 0;
	var htmlSummary = "<ul>";
	select.each(function() {
		console.log("node: " + $(this).text());
		count += parseInt($(this).text(), 10);
		htmlSummary += $(this).parents('li').clone().wrap('<li>').parent().html();
	});
	htmlSummary += "</ul>";
	return [count, htmlSummary];
}

function fetchHtml(onDone) {
	$.ajax({
		url: cnUtil.baseUrl() + "/my/index"
	}).success(function(data) {
		onDone(data);
	});
}

self.setBadge = function(text) {
	chrome.browserAction.setBadgeText({text: text});
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

function updateUi(notificationCount, htmlSummary) {
	if (notificationCount > 0) {
		self.setBadge(notificationCount.toString());
	} else {
		self.setBadge("");
	}
	var summaryForView = htmlSummary + '<div class="meta-info">last check: ' + currentTimeFormatted() + '</div>';
	localStorage.notificationSummary = summaryForView;
	// also update popups
	cnUtil.withView(viewTabUrl, function(view) {
		if (summaryForView) {
			view.setContent(summaryForView);
		} else {
			view.setContent("news: " + (notificationCount).toString());
		}
	});
}

function isLoggedIn(data) {
	return data.indexOf('id="login-page"') == -1;
}

self.updateNotifications = function() {
	fetchHtml(function(data) {
		if (!isLoggedIn(data)) {
			console.log("not logged  in!");
			updateUi(0, "<div>Please log in to core smartwork.</div>");
			self.setBadge("!");
			return;
		}
		var result = extractNotifications(data);
		var notificationCount = result[0];
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
		updateUi(notificationCount, result[1]);
	});
};

function backgroundTask() {
	setTimeout(backgroundTask, TIMEOUT);
	console.log("background check");
	self.updateNotifications();
}

backgroundTask();

})();