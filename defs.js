var cnDefs = {};
cnDefs.CORE_SITES=['https://core.catalysts.cc', 'https://core.core-smartwork.com'];

var cnUtil = {};

cnUtil.getBaseUrl = function() {
	return localStorage.siteUrl;
};

cnUtil.setBaseUrl = function(url) {
	localStorage.siteUrl = url;
};

if (!cnUtil.getBaseUrl()) {
	cnUtil.setBaseUrl(cnDefs.CORE_SITES[0]);
}

cnUtil.withView = function(viewUrl, action) {
	var views = chrome.extension.getViews();
	for (var i = 0; i < views.length; i++) {
		var view = views[i];
		if (view.location.href == viewUrl) {
			action(view);
		}
	}
};

cnUtil.triggerRefresh = function() {
	chrome.extension.getBackgroundPage().corenotify.updateNotifications();
};

cnUtil.strEndsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};
