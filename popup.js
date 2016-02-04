
function setContent(content) {
	$('#content').empty().append(cnUtil.notifications2html(content));
}

function setContentRaw(content) {
	$('#content').html(content);
}

$(function() {
	setContentRaw(localStorage.notificationSummary);
	if (localStorage.notifications) {
		setContent(localStorage.notifications);
	}

	$(document).on('click', '#content a', function() {
		var href = $(this).attr('href');
		if (href) {
			chrome.tabs.create({'url': cnUtil.fixUrl(href)});
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
