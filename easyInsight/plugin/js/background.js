chrome.runtime.onMessage.addListener(function(message, sender, callback) {
	if (message.metric) {
		chrome.storage.sync.get("pinnedMetrics", (result) => {
			let pinnedMetrics = result.pinnedMetrics || [];
			pinnedMetrics.push(message.metric);
			chrome.storage.sync.set({'pinnedMetrics': pinnedMetrics})
		});
		callback({ pinnedMetrics });
	} 
	// UNCOMMENT THIS TO LOAD SIDE BAR DIRECTLY
	// chrome.tabs.sendMessage(sender.tab.id ,"panel");
});


chrome.action.onClicked.addListener(tab => {
	console.log("clicked");
	chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_PANEL"});
});