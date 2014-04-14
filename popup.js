console.log("loading...");

function setContent(content) {
	$('#content').html(content);
}

$(function() {
setContent(localStorage['notificationSummary']);
});
