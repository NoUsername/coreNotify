var cnDefs = {};
cnDefs.CORE_SITES=[];

var cnUtil = {};

if (typeof require != 'undefined') {
	var localStorage = require("ff-utils").brUtils.storage;
}

cnUtil.nullCallback = function(){};

cnUtil.parseContent = function(content) {
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
};

cnUtil.baseUrl = function(url) {
	if (url !== undefined) {
		localStorage.siteUrl = url;
	}
	return localStorage.siteUrl;
};

cnUtil.showNotifications = function(show) {
	if (show !== undefined) {
		localStorage.desktopNotifications = show;	
	}
	return localStorage.desktopNotifications;
};

cnUtil.toBool = function(val) {
	return val === "true" || val === true;
};

cnUtil.initDefaults = function() {
	if (!cnUtil.baseUrl()) {
		cnUtil.baseUrl("https://core.catalysts.cc");
	}
	if (cnUtil.showNotifications() === undefined) {
		cnUtil.showNotifications(true);
	}
};

cnUtil.triggerRefresh = function() {
	chrome.extension.getBackgroundPage().corenotify.updateNotifications();
};

cnUtil.strEndsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

if (typeof localStorage != 'undefined') {
	cnUtil.initDefaults();
}

if (typeof exports != 'undefined') {
	exports.cnUtil = cnUtil;
}