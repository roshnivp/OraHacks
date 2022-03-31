chrome.runtime.onMessage.addListener(function(message, sender, callback) {
	if (message.metric) {
		chrome.storage.sync.get("pinnedMetrics", (result) => {
			let pinnedMetrics = result.pinnedMetrics || [];
			if (!pinnedMetrics.includes(message.metric)) {
				pinnedMetrics.push(message.metric);
				chrome.storage.sync.set({'pinnedMetrics': pinnedMetrics})
			}
		});
	}
	chrome.tabs.sendMessage(sender.tab.id ,{ action : "TOGGLE_PANEL" , update :  true});
	return true;
});


chrome.action.onClicked.addListener(tab => {
	chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_PANEL", update :  false});
});