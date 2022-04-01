window.addEventListener('load', function () {
   let iframe = document.getElementById('wysiwygTextarea_ifr');
   let elementfound = iframe.contentWindow.document.getElementsByTagName("body");
   let idbody = $("#body");
   selectorElement = $("[data-id='wysiwygTextarea']");
   selectorElement.textcomplete([mentionStrategy], {
        debounce: SEARCH_MS_DEBOUNCE,
        maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
        adapter: $.fn.textcomplete.HTMLContentEditable
    });
});
// window.addEventListener("keydown", () => {
//     alert('iframe');
// 	if (!selectorElement) {
//         let iframe = document.getElementById("wysiwygTextarea_ifr");
//         alert(iframe);
//         console.log(iframe);
//         console.log(iframe.getContents());
// 		selectorElement = $("[aria-label='Message body']");
// 		selectorElement.textcomplete([mentionStrategy], {
// 			debounce: SEARCH_MS_DEBOUNCE,
// 			maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
// 			adapter: $.fn.textcomplete.HTMLContentEditable
// 		});
// 	}
// });