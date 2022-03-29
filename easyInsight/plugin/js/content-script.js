
window.addEventListener('onload', checkForSource, false);
window.addEventListener('onclick', checkForSource, false);
window.addEventListener('keyup', checkForSource, false);

var outlookEmailBody;
var demoTextBox;
var listenerRegistered = false;

function checkForSource() {
	if (!listenerRegistered) {
		outlookEmailBody = outlookEmailBody || document.querySelector('[aria-label="Message body"]');
		demoTextBox = demoTextBox || document.getElementById('autocomplete-textarea');
		if (outlookEmailBody) {
			registerTarget("OUTLOOK");
		} else if (demoTextBox) {
			registerTarget("DEMO-TEXT-BOX");
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