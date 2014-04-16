
function setContent(content) {
	$('#content').html(content);
}

$(function() {
	console.log("loading...");
	setContent(localStorage['notificationSummary']);

	$(document).on('click', '#content a', function() {
		var href = $(this).attr('href');
		if (href) {
			chrome.tabs.create({'url': cnUtil.getBaseUrl() + href});
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
		}
	});

});
