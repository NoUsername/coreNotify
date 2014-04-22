var cnDefs = {};
cnDefs.CORE_SITES=['https://core.catalysts.cc', 'https://core.core-smartwork.com'];

var cnUtil = {};

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

if (!cnUtil.baseUrl()) {
	cnUtil.baseUrl(cnDefs.CORE_SITES[0]);
}
if (cnUtil.showNotifications() === undefined) {
	cnUtil.showNotifications(true);
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
