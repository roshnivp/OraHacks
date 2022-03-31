window.addEventListener("click", () => {
	if (!selectorElement) {
		selectorElement = $("[aria-label='Tweet text']");
		chrome.storage.sync.set({'isTwitter': true}, function() {
			console.log('isTwitter Value is set to ' + value);
		  });
		selectorElement.textcomplete([mentionStrategy], {
			debounce: SEARCH_MS_DEBOUNCE,
			maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
			adapter: $.fn.textcomplete.HTMLContentEditable
		});
	}
});