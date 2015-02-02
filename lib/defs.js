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
	var summary = {};
	var notifications = summary.notifications = [];
	summary.loggedIn = true;
	var htmlSummary = "<ul>";
	select.each(function() {
		cnUtil.log("node: " + $(this).text());
		count += parseInt($(this).text(), 10);
		var listItem = $(this).parents('li');
		htmlSummary += listItem.clone().wrap('<li>').parent().html();
		notifications.push({
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
		if (cnUtil.strEndsWith(url, "/")) {
			// don't take trailing slash, that belongs to the path
			url = url.substring(0, url.length - 1);
		}
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

cnUtil.fixUrl = function(url) {
	if (url.indexOf('http') != 0) {
      if (url.indexOf('/') != 0) {
        url = '/' + url;
      }
      url = cnUtil.baseUrl() + url;
    }
    return url;
};

cnUtil.initDefaults = function() {
	if (!cnUtil.baseUrl()) {
		// default URL
		cnUtil.baseUrl("https://core.catalysts.cc");
		//cnUtil.baseUrl("http://localhost");
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

cnUtil.notifications2html = function(notifications) {
	cnUtil.log("notifications2html called data?" + (!!notifications ? notifications.notifications : '?'));
	var summary = $("<div>");
	if (!(!!notifications) || !notifications.loggedIn) {
		$('<a>', {id: 'notLoggedIn', text:'Not logged in.', href: '#'}).appendTo(summary);
		return summary;
	}
	var list = $('<ul>');
	$(notifications.notifications).each(function(idx, n) {
		console.log("processing ", n);
		var item = $('<li>');
		var link = $('<a>', {
			'href' : n.link,
			'text': n.topic
		});
		link.append($('<span>', {
			'class': 'badge pull-right',
			'text': n.count
		}));
		item.append(link);
		list.append(item);
	});
	summary.append(list);

	summary.append($('<div>', {
		'class' : 'meta-info',
		'text' : 'last checked: ' + notifications.lastCheck
	}));
	cnUtil.log("result: ", summary);
	return summary;
};

if (typeof localStorage != 'undefined') {
	cnUtil.initDefaults();
}

if (typeof exports != 'undefined') {
	exports.cnUtil = cnUtil;
}