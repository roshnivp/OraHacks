window.addEventListener("click", () => {
	if (!selectorElement) {
		selectorElement = $("[aria-label='Tweet text']");
		selectorElement.textcomplete([mentionStrategy], {
			debounce: SEARCH_MS_DEBOUNCE,
			maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
			adapter: $.fn.textcomplete.HTMLContentEditable
		});
	}
});