"use strict";

var corenotify = corenotify || {};

var port = self.port;

function handleAction(action) {
  console.log("handling action " + action);
  if (action == 'refresh') {
    port.emit("refresh");
  } else if (action == 'toCore') {
    port.emit("openTab", null);
  } else if (action == 'options') {
    port.emit("openOptions");
  }
}

self.port.on("init", function () {
  console.log("init");
  // listen to link clicks
  $(document).on('click', '#content a', function(it) {
    var href = $(this).attr('href');
    console.log("clicked on: " + href);
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
  console.log("opening panel");
});

self.port.on("parseContent", function(content) {
	var result = cnUtil.parseContent(content);
	self.port.emit("parsedContent", result[0], result[1]);
});

self.port.on("updateContent", function(content) {
  console.log("updateContent called");
  $("#content").html(content);
});

