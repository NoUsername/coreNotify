var i = 0;
var TIMEOUT = 10*1000;

function extractNotifications(content) {
	var select = $(content).find('ul.nav .badge');
	var count = 0;
	var htmlSummary = "<ul>";
	select.each(function() {
		console.log("node: " + $(this).text());
		count += parseInt($(this).text(), 10);
		htmlSummary += $(this).parents('li').html();
	});
	htmlSummary += "</ul>";
	return [count, htmlSummary];
}

function fetchHtml(onDone) {
	$.ajax({
		url: 'https://core.catalysts.cc/my/index'
	}).success(function(data) {
		onDone(data);
	});
}

var viewTabUrl = chrome.extension.getURL('popup.html');

function updateUi(notificationCount, htmlSummary) {
	if (notificationCount > 0) {
		chrome.browserAction.setBadgeText({text: notificationCount.toString()});
	} else {
		chrome.browserAction.setBadgeText({});
	}
	localStorage.notificationSummary = htmlSummary;
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

function updateNotifications() {
	fetchHtml(function(data) {
		var result = extractNotifications(data);
		var notificationCount = result[0];
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
