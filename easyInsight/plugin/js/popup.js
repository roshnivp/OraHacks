// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

//// Search the bookmarks when entering the search keyword.
//$('#search').change(function () {
//  $('#bookmarks').empty();
//  dumpBookmarks($('#search').val());
//});

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
  });
}

function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  for (var i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }

  return list;
}

function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title.toLowerCase()).indexOf(query.toLowerCase()) == -1) {
        return $('<span></span>');
      }
    }

    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);

    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    anchor.click(function () {
      chrome.tabs.create({ url: bookmarkNode.url });
    });

    var span = $('<span>');
    var options = $('<span>[<a href="#" id="addlink">Add</a>]</span>') ;

    // Show add and edit links when hover over.
    span.hover(function () {
      span.append(options);
      options.fadeIn();
    },
      // unhover
   function () {
      options.remove();
   }).append(anchor);

  }

  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }

  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
let pinnedMetrics = [];

chrome.storage.sync.get("pinnedMetrics", (result) => {
    pinnedMetrics = result.pinnedMetrics;
    console.log(pinnedMetrics);
});

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    if (message.pinnedMetrics) {
        pinnedMetrics = message.pinnedMetrics;
        console.log(pinnedMetrics);
    }
});
