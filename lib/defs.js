var cnDefs = {};
cnDefs.CORE_SITES=[];

var cnUtil = {};

if (typeof require != 'undefined') {
	var ss = require("sdk/simple-storage");
	var localStorage = cnUtil.storage = ss.storage;
} else {
	cnUtil.storage = localStorage;
}

cnUtil.log = function() {
	console.log.apply(console, arguments); 
};

cnUtil.nullCallback = function() { };

cnUtil.log = cnUtil.nullCallback;

function getTextNodeContentOnly($it) {
	return $it.contents().filter(function(){
					return this.nodeType === 3 && /\S/.test(this.nodeValue);
				}).text();
		
}

cnUtil.parseContent = function(content) {
	var select = $(content).find('ul.nav-list .badge');
	var count = 0;
	var summary = [];
	var htmlSummary = "<ul>";
	select.each(function() {
		cnUtil.log("node: " + $(this).text());
		count += parseInt($(this).text(), 10);
		var listItem = $(this).parents('li');
		htmlSummary += listItem.clone().wrap('<li>').parent().html();
		summary.push({
				'topic': getTextNodeContentOnly(listItem.find('a:first')),
				'link': listItem.find('a:first').attr('href'),
				'count': count
			});
	});
	htmlSummary += "</ul>";
	return [count, htmlSummary, summary];
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