
window.addEventListener('onload', checkForSource, false);
window.addEventListener('onclick', checkForSource, false);
window.addEventListener('keyup', checkForSource, false);

var outlookEmailBody;
var demoTextBox;
var twitterTextBox;
var listenerRegistered = false;

function checkForSource() {
	if (!listenerRegistered) {
		outlookEmailBody = outlookEmailBody || document.querySelector('[aria-label="Message body"]');
		demoTextBox = demoTextBox || document.getElementById('autocomplete-textarea');
		twitterTextBox = outlookEmailBody || document.querySelector('[aria-label="Tweet text"]');
		if (outlookEmailBody) {
			registerTarget("OUTLOOK");
		} else if (demoTextBox) {
			registerTarget("DEMO-TEXT-BOX");
		} else if (twitterTextBox) {
			registerTarget("twitter");
		} else {
			console.log("No known target found!")
			registerTarget("DEFAULT");
		}
	}
}

function registerTarget(target) {
	chrome.runtime.sendMessage({ target });
	listenerRegistered = true;
}
