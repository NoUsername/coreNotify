var TIMEOUT = 30*1000;

var viewTabUrl = chrome.extension.getURL('popup.html');

function showNotification() {
	var opt = {
        type: "basic",
        title: "Core Smartwork",
        message: "There are new core updates",
        iconUrl: "icon2.png"
      };
      if (typeof chrome.notifications !== undefined) {
      	chrome.notifications.create("", opt);
      } else {
      	console.log("notifications not supported!");
      }
}

function extractNotifications(content) {
	var select = $(content).find('ul.nav .badge');
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
		url: CORE_BASE_URL + "/my/index"
	}).success(function(data) {
		onDone(data);
	});
}

function updateUi(notificationCount, htmlSummary) {
	if (notificationCount > 0) {
		chrome.browserAction.setBadgeText({text: notificationCount.toString()});
	} else {
		chrome.browserAction.setBadgeText({text: ""});
	}
	localStorage.notificationSummary = htmlSummary + '<div class="meta-info">last update: ' + new Date().toString()+'</div>';
	// also update popups
	var views = chrome.extension.getViews();
	for (var i = 0; i < views.length; i++) {
		var view = views[i];
		if (view.location.href == viewTabUrl) {
			if (htmlSummary) {
				view.setContent(htmlSummary);
			} else {
				view.setContent("news: " + (notificationCount).toString());
			}
		}
	}
}

function isLoggedIn(data) {
	return data.indexOf('id="login-page"') == -1;
}

function updateNotifications() {
	fetchHtml(function(data) {
		if (!isLoggedIn(data)) {
			console.log("not logged  in!");
			updateUi(0, "<div>Please log in to core smartwork.</div>");
			return;
		}
		var result = extractNotifications(data);
		var notificationCount = result[0];
		var oldValue = localStorage.notificationCount
		if (oldValue !== undefined && oldValue != notificationCount) {
			try {
				showNotification();
			} catch(e) {
				console.log("could not show notification: ", e);
			}
		}
		localStorage.notificationCount = notificationCount;
		console.log("notifications: " + notificationCount);
		updateUi(notificationCount, result[1]);
	});
}

function backgroundTask() {
	setTimeout(backgroundTask, TIMEOUT);
	console.log("background check");
	updateNotifications();
}

backgroundTask();
