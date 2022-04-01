// Search configuration
const AUTOCOMPLETE_ITEMS_DISPLAYED = 15;
const SEARCH_CACHE = true;
const SEARCH_MS_DEBOUNCE = 0;
const SEARCH_TRIGGER_CHAR = "~";
const SEARCH_TRIGGER_MIN_CHARS = 0;
const SEARCH_RESULT_MAX_ROWS = 5;
const SEARCH_MATCH_REGEX = new RegExp(
    `(^|\\s)${SEARCH_TRIGGER_CHAR}(\\w${
        SEARCH_TRIGGER_MIN_CHARS >= 0 ? `{${SEARCH_TRIGGER_MIN_CHARS},}` : "*"
    }(?:\\s*\\w*)*)$`
);
const pushpinIconUrl = chrome.runtime.getURL(`/images/push-pin.png`);

// Client Initialization
const apiClient = new ApiClient({
    itemsPerSearch: AUTOCOMPLETE_ITEMS_DISPLAYED
});

let selectorElement;
let lastQuery = "";
let rawDataMetrics = [];
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
                chrome.storage.sync.set({'rawDataMetrics': data});
                rawDataMetrics = data;
                data = templates.dataMapper(query, data);
                callback(data);
            });
    },

    // Template used to display each result obtained by the API
    template: (hit) => templates.resultDisplay(hit),

    // Template used to display the selected result in the textarea
    replace: (hit) => templates.selectedResult(hit) 
};

// Core logic for rendering metrics
const templates = {
    dataMapper: (query, items) => {
        const searchQuery = query != null ? query.trim().toUpperCase() : "";
        return items.filter(i => i.imagelabel.toUpperCase().indexOf(searchQuery) != -1).map(i => i.value + " " + i.textlabel).splice(0,SEARCH_RESULT_MAX_ROWS);
    },
    
    // Template used to display the selected result in the textarea
    selectedResult: (hit) => {
                let rawValue = rawDataMetrics.filter(i => hit === i.value + " " + i.textlabel)[0];
                let imageUrl = chrome.runtime.getURL(`/images/${rawValue.imagelabel}.png`);
                return `
                <span contentEditable="false" class="tooltip-trigger">
                <label spellcheck="false" class="tag-item" style="color:#0071c2;">
                <a href="${rawValue.dashboardurl}" target="_blank" style="cursor:pointer;">${hit}</a>
                </label>
                <span class="tooltip">
                    <span>
                        <h5>${hit}</h5> 
                        <button id="easyinsight-${hit}" class="easyinsight-pin-btn">
                            <img id="easyinsightimg-${hit}" class="easyinsight-pin-btn-img" src= "${pushpinIconUrl}"> </span>
                        </button>
                    </span>
                    <span>
                        <a href="${rawValue.dashboardurl}" target="_blank">
                            <img width='auto' src="${imageUrl}" width="150" height="150"/>
                        </a>
                    </span>
                </span>
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

window.addEventListener("click", function (event) {
    if (["easyinsight-pin-btn", "easyinsight-pin-btn-img"].includes(event.target?.className)) {
        chrome.runtime.sendMessage({ metric: event.target?.id?.split("-")[1] });
    }
});

function ApiClient(options) {
    this.options = options;
    this.search = (keyword) => {
        return $.ajax({
            url: `https://624561e47701ec8f7251298c.mockapi.io/easyinsights/oacmetrics`,
            // url: `https://624193629b450ae274421168.mockapi.io/api/v1/easyInsight`,
            // url: `https://cfg27mt.private2.fawdev1phx.oraclevcn.com:8005/data`,
            // url: `https://624193629b450ae274421168.mockapi.io/api/v1/easyInsight?keyword=${keyword}`,
            dataType: "json"
        });
    }
}