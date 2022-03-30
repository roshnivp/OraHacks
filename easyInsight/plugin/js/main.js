$(document).ready(() => {
    // Search configuration
    const AUTOCOMPLETE_ITEMS_DISPLAYED = 15;
    const SEARCH_CACHE = true;
    const SEARCH_MS_DEBOUNCE = 0;
    const SEARCH_TRIGGER_CHAR = "~";
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
            let imageUrl = chrome.runtime.getURL("images/img1.png");
            return `<span contentEditable="false" class="tooltip-trigger">
            <label contentEditable="false" spellcheck="false" class="tag-item" style="color:#0071c2;">
            <a href="https://www.w3schools.com" target="_blank" style="cursor:pointer;">${hit}</a></label>
            <span><a href="https://www.w3schools.com" target="_blank">
            <img width='150' height='100' src=${imageUrl}/></a>
            <h4>${hit}</h4></span>
            </span>`;
        },
    
        // Template used to display each result obtained by the API
        resultDisplay: (hit) => {
            const regex = new RegExp("(".concat(hit.searchQuery, ")"), "i");
            const value = hit.replace(regex, "<em>$1</em>");
            let dropdown = document.querySelector('#textcomplete-dropdown-1');
            dropdown.classList.add('dropdown-custom');
            return `${value}`;
        }
    };

    // Client Initialization
    const apiClient = new ApiClient({
        itemsPerSearch: AUTOCOMPLETE_ITEMS_DISPLAYED
    });
    let selectorElement;
    chrome.storage.local.get("easyInsightTargetSelector", (result) => {
        selectorElement = $(result.easyInsightTargetSelector);
        selectorElement.textcomplete([mentionStrategy], {
            debounce: SEARCH_MS_DEBOUNCE,
            maxCount: AUTOCOMPLETE_ITEMS_DISPLAYED,
            // Special adapter to handle HTMLContentEditable divs
            adapter: $.fn.textcomplete.HTMLContentEditable
        }).on({
        'textComplete:select': function (e, value) {
            // renderTooltips();
        }});
    });
    let lastQuery = "";

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
                });
        },

        // Template used to display each result obtained by the API
        template: (hit) => templates.resultDisplay(hit),

        // Template used to display the selected result in the textarea
        replace: (hit) => templates.selectedResult(hit) 
    };
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