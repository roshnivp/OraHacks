document.addEventListener("click", (ev) => {
	// if (!selectorElement) {
		selectorElement = $("[aria-label='Message body']");
		selectorElement.textcomplete([mentionStrategy], {
			debounce: SEARCH_MS_DEBOUNCE,
			maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
			adapter: $.fn.textcomplete.HTMLContentEditable
		});
	// }
});
