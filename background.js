var TIMEOUT = 30*1000;

var viewTabUrl = chrome.extension.getURL('popup.html');

function showNotification() {
	var opt = {
        type: "basic",
        title: "Core Smartwork",
        message: "There are new core updates",
        iconUrl: "icon2.png"
      };
      if (typeof chrome.notifications !== "undefined") {
      	chrome.notifications.create("", opt, function() {});
      } else {
      	console.log("notifications not supported!");
      }
}

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
		url: CORE_BASE_URL + "/my/index"
	}).success(function(data) {
		onDone(data);
	});
}

function setBadge(text) {
	chrome.browserAction.setBadgeText({text: text});
}

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
		setBadge(notificationCount.toString());
	} else {
		setBadge("");
	}
	var summaryForView = htmlSummary + '<div class="meta-info">last check: ' + currentTimeFormatted() + '</div>';
	localStorage.notificationSummary = summaryForView;
	// also update popups
	var views = chrome.extension.getViews();
	for (var i = 0; i < views.length; i++) {
		var view = views[i];
		if (view.location.href == viewTabUrl) {
			if (summaryForView) {
				view.setContent(summaryForView);
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
			setBadge("!");
			updateUi(0, "<div>Please log in to core smartwork.</div>");
			return;
		}
		var result = extractNotifications(data);
		var notificationCount = result[0];
		var oldValue = localStorage.notificationCount
		if (oldValue !== undefined && parseInt(oldValue,10) < parseInt(notificationCount, 10)) {
			try {
				showNotification();
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
}

function backgroundTask() {
	setTimeout(backgroundTask, TIMEOUT);
	console.log("background check");
	updateNotifications();
}

backgroundTask();
