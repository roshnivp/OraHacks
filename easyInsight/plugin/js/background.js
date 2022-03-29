chrome.runtime.onMessage.addListener(function(message, sender, callback) {
	if (message.target == "OUTLOOK") {
		chrome.storage.local.set({'easyInsightTargetSelector': "[aria-label='Message body']"})
	} else if (message.target == "DEMO-TEXT-BOX") {
		chrome.storage.local.set({'easyInsightTargetSelector': "#autocomplete-textarea"});
	} else if (message.target == "TWITTER") {
		chrome.storage.local.set({'easyInsightTargetSelector': "[aria-label='Tweet text']"})
	}
	chrome.scripting.executeScript({
		files: ['js/jquery.min.js', 'js/ajax.js', 'js/jquery-textcomplete.min.js', 'js/main.js'], 
		target: { tabId: sender.tab.id } 
	});
	return true;
});
