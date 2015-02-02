
function setContent(content) {
	$('#content').html(content);
}

$(function() {
	setContent(localStorage['notificationSummary']);
	if (localStorage['notifications']) {
		setContent(cnUtil.notifications2html(localStorage['notifications']).html());
	}

	$(document).on('click', '#content a', function() {
		var href = $(this).attr('href');
		if (href) {
			chrome.tabs.create({'url': cnUtil.baseUrl() + href});
		}
	});
	$(document).on('click', '[data-opentab]', function() {
		var openTab = $(this).data('opentab');
		chrome.tabs.create({'url': openTab});
	});

	$(document).on('click', '[data-action]', function() {
		var action = $(this).data('action');
		if (action == "refresh") {
			cnUtil.triggerRefresh();
		} else if (action == "toCore") {
			chrome.tabs.create({'url': cnUtil.baseUrl()});
		}
	});

});
