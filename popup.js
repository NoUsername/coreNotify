console.log("loading...");

function setContent(content) {
	$('#content').html(content);
}

$(function() {
	setContent(localStorage['notificationSummary']);
});

$(document).on('click', '#content a', function() {
	var href = $(this).attr('href');
	if (href) {
		chrome.tabs.create({'url': CORE_BASE_URL + href});
	}
});
