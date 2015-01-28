"use strict";

const { Frame } = require("sdk/ui/frame");
const { ActionButton } = require("sdk/ui/button/action");
const { ToggleButton } = require("sdk/ui/button/toggle");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var brUtils = require("ff-utils").brUtils;
var background = require("background").corenotify;
var cnUtil = require('defs').cnUtil;

// firefox add-ons cannot load relative url resources
var glyphicons = "@font-face {font-family: 'Glyphicons Halflings';src: url('../fonts/glyphicons-halflings-regular.eot');src: url('../fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'), url('../fonts/glyphicons-halflings-regular.woff2') format('woff2'), url('../fonts/glyphicons-halflings-regular.woff') format('woff'), url('../fonts/glyphicons-halflings-regular.ttf') format('truetype'), url('../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg');}";

var myPanel = require("sdk/panel").Panel({
  width: 400,
  height: 200,
  contentURL: data.url("./panel.html"),
  contentScriptFile: [
    data.url("js/jquery-1.11.0.min.js"),
    data.url("../lib/defs.js"),
    data.url("js/panelScript.js")
    ],
  contentStyle: glyphicons.replace(/..\/fonts\//g, data.url("fonts/"))
});

var button = new ToggleButton({
  id: "button",
  label: "corenotify",
  icon: "./coreLogo.png",
  badge: "",
  badgeColor: "#00AAAA",
  onClick: () => {
    myPanel.show({
      position: button
    });
  }
});

brUtils.init(button, myPanel, background.handleNotifications);

myPanel.on("show", function() {
  myPanel.port.emit("show");
});

myPanel.port.on("openTab", function(url) {
  console.log("callback!");
  var baseUrl = cnUtil.baseUrl();
  if (url == null) {
     url = baseUrl;
  } else {
    url = baseUrl + url;
  }
  console.log("open tab: " + url);
  tabs.open(url);
  myPanel.hide();
});

myPanel.port.on("refresh", function() {
  background.updateNotifications();
});

myPanel.port.on("openOptions", function() {
  myPanel.port.emit("showUrl", cnUtil.baseUrl());
});

myPanel.port.on("saveOptions", function(url) {
  cnUtil.baseUrl(url);
});

myPanel.port.emit("init");

function backgroundTask() {
  brUtils.setTimeout(backgroundTask, background.TIMEOUT);
  background.triggerBackgroundTask();
}

backgroundTask();
