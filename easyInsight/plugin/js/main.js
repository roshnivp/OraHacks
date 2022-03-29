$(document).ready(() => {
    // Search configuration
    const AUTOCOMPLETE_ITEMS_DISPLAYED = 15;
    const SEARCH_CACHE = true;
    const SEARCH_MS_DEBOUNCE = 0;
    const SEARCH_TRIGGER_CHAR = "#";
    const SEARCH_TRIGGER_MIN_CHARS = 0;
    const SEARCH_MATCH_REGEX = new RegExp(
        `(^|\\s)${SEARCH_TRIGGER_CHAR}(\\w${
            SEARCH_TRIGGER_MIN_CHARS >= 0 ? `{${SEARCH_TRIGGER_MIN_CHARS},}` : "*"
        }(?:\\s*\\w*)*)$`
    );

    const templates = {
        dataMapper: (query, items) => {
            const searchQuery = query != null ? query.trim().toUpperCase() : ""
            return items.filter(i => i.toUpperCase().includes(query));
        },
        // Template used to display the selected result in the textarea
        selectedResult: (hit) => {
            // renderTooltips();
            return `<label contentEditable="false" spellcheck="false" class="tag-item">${hit}</label> `;
        },
        //`<label contentEditable="false" spellcheck="false" class="tooltip">${hit}<span class="tooltiptext">${hit}</span></label>`,
    
        // Template used to display each result obtained by the API
        resultDisplay: (hit) => {
            const regex = new RegExp("(".concat(hit.searchQuery, ")"), "i");
            const fullName = hit.replace(regex, "<em>$1</em>");
            return `<p style="color: red">${fullName}</p>`;
        }
    };

    // Client Initialization
    const apiClient = new ApiClient({
        itemsPerSearch: AUTOCOMPLETE_ITEMS_DISPLAYED
    });
    let selectorElement;
    chrome.storage.local.get("easyInsightTargetSelector", (result) => {
        selectorElement = $(result.easyInsightTargetSelector);
        selectorElement[0].addEventListener("paste", onPastePlainText);
        selectorElement.textcomplete([mentionStrategy], {
            debounce: SEARCH_MS_DEBOUNCE,
            maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
            // Special adapter to handle HTMLContentEditable divs
            // adapter: $.fn.textcomplete.HTMLContentEditable
        });
    });
    let lastQuery = "";

    // Disable formatting on paste
    const onPastePlainText = (e) => {
        e.preventDefault();
        var pastedText;
        if (window.clipboardData && window.clipboardData.getData) {
            // IE
            pastedText = window.clipboardData.getData("Text");
        } else if (e.clipboardData && e.clipboardData.getData) {
            pastedText = e.clipboardData.getData("text/plain");
        }
        document.execCommand("insertHTML", false, pastedText);
    };
    
    const mentionStrategy = {
        // If enabled, it will memoize by term argument. This is useful to prevent excessive API access
        cache: SEARCH_CACHE,
        // Regular experession used to trigger search
        match: SEARCH_MATCH_REGEX,

        // Function called at every new keystroke
        search: (query, callback) => {
            lastQuery = query;
            apiClient.search(lastQuery)
                .done((data) => {
                    data = templates.dataMapper(query, data);
                    callback(data);
                }).fail((err) => console.error(err));
        },

        // Template used to display each result obtained by the API
        template: (hit) => templates.resultDisplay(hit),

        // Template used to display the selected result in the textarea
        replace: (hit) => templates.selectedResult(hit)
    };

    // renderTooltips();

});

function ApiClient(options) {
    this.options = options;
    this.search = (keyword) => {
        return $.ajax({
            url: `https://624193629b450ae274421168.mockapi.io/api/v1/easyInsight`,
            //url: `https://624193629b450ae274421168.mockapi.io/api/v1/easyInsight?keyword=${keyword}`,
            dataType: "json"
        });
    }
}

// function renderTooltips() {
//     // Initialize
//     var Tooltips = document.getElementsByClassName('TooltipTrigger');
//     $("previewParagraph").text($("autocomplete-textarea").val())

// // Track all tooltips trigger
//     for (var i = 0; i < Tooltips.length; i++) {
//         // Event Handler
//         Tooltips[i].addEventListener("mouseenter", function(ev) {
//             ev.preventDefault();
//             this.style.position = "relative";
//             this.innerHTML = this.innerHTML + "<div class='Tooltips'><p class='" + this.getAttribute("data-position") + "'>" + this.getAttribute("data-tooltips") + "</p></div>";
//         });
//         Tooltips[i].addEventListener("mouseleave", function(ev) {
//             ev.preventDefault();
//             this.removeAttribute("style");
//             this.innerHTML = this.innerHTML.replace(/<div[^]*?<\/div>/, '');;
//         });
//     }
// }