selectorElement = $("#autocomplete-textarea");
selectorElement.textcomplete([mentionStrategy], {
	debounce: SEARCH_MS_DEBOUNCE,
	maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
	adapter: $.fn.textcomplete.HTMLContentEditable
});