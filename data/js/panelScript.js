"use strict";

var corenotify = corenotify || {};

var port = self.port;

function handleAction(action) {
  cnUtil.log("handling action " + action);
  if (action == 'refresh') {
    port.emit("refresh");
  } else if (action == 'toCore') {
    port.emit("openTab", null);
  } else if (action == 'options') {
    port.emit("openOptions");
  }
}

self.port.on("init", function () {
  cnUtil.log("init");
  if (corenotify.panelInitDone == true) {
    cnUtil.log("ERROR: init called twice");
    return;
  }
  corenotify.panelInitDone = true;
  // listen to link clicks
  $(document).on('click', '#content a', function(it) {
    var href = $(this).attr('href');
    cnUtil.log("clicked on: " + href);
    if ($(this).attr("id") == 'notLoggedIn') {
      self.port.emit("openTab", null);
    } else {
      self.port.emit("openTab", href);
    }
    return false;
  });
  $(document).on('click', '[data-action]', function(it) {
    handleAction($(this).data('action'));
  });
});

self.port.on("showUrl", function(url) {
  var newUrl = prompt("Enter new Core URL:", url);
  if (!!newUrl) {
    self.port.emit("saveOptions", newUrl);
  }
});

self.port.on("show", function onShow() {
  cnUtil.log("opening panel");
});

self.port.on("parseContent", function(content) {
	var result = cnUtil.parseContent(content);
	self.port.emit("parsedContent", result[0], result[1], result[2]);
});

self.port.on("updateContent", function(data) {
  cnUtil.log("updateContent called");
  var elements = cnUtil.notifications2html(data);
  cnUtil.trace(elements.html());
  $("#content").empty().append(elements);
});
