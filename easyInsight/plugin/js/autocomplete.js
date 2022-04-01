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
                // chrome.storage.sync.set({'rawDataMetrics': data});
                // rawDataMetrics = data;
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
                <span contentEditable="false" class="easyinsight-kpi-trigger" 
                style="text-decoration:none;
                position:relative;
                cursor: pointer;
                transition: all 0.3s ease;" >
                <label spellcheck="false" class="tag-item" style="color:#0071c2;">
                <a class="" href="${rawValue.dashboardurl}" target="_blank" style="cursor:pointer;">${hit}</a>
                </label>
                <span class="easyisignt-tooltip" 
                style="display:none;
                color:#333333;
                background:white;
                top:0;
                left:0;
                position:absolute;
                z-index:1000;
                width:auto;
                height: auto;
                max-width: fit-content;
                max-height: fit-content;
                border:1px solid rgba(0,0,0,.15);
                margin-top:-2px;
                overflow: visible;
                padding:8px;
                border-radius: 0.25rem;">
                    <span style="display: flex;
                    align-items: flex-start;
                    margin-right: 8px;">
                        <h5 style="  align-content: center;
                        text-align: center;
                        margin: unset;"
                        >${hit}</h5> 
                        <button id="easyinsight-${hit}" class="easyinsight-pin-btn" 
                        style="  padding: 5px 10px;
                        font-size: 12px;
                        line-height: 1.5;
                        border-radius: 3px;
                        cursor: pointer;
                        height: 30px;
                        width: 30px;
                        outline: none;
                        border: none;
                        box-shadow: none;
                        border-radius: 5px;
                        color: #333;
                        background-color: #fff;
                        user-select: none;
                        background-image: none;
                        /* border: 1px solid #ccc; */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-left: 8px;">
                            <img style="width: 18px;
                            height: 18px;" id="easyinsightimg-${hit}" class="easyinsight-pin-btn-img" src= "${pushpinIconUrl}"> </span>
                        </button>
                    </span>
                    <span>
                        <a href="${rawValue.dashboardurl}" target="_blank">
                            <img class="easyinsight-metric-dashboard" width='auto' src="${imageUrl}" height="150"/>
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

loadData();

document.addEventListener("click", function (event) {
    if (["x_easyinsight-pin-btn", "x_easyinsight-pin-btn-img"]
    .includes(event.target?.className)) {
        let rawValue = rawDataMetrics.filter(i => event.target?.id?.split("-")[1] == i.value)[0];
        chrome.runtime.sendMessage({ metric: rawValue?.value + " " + rawValue?.textlabel });
    } else if (["easyinsight-pin-btn", "easyinsight-pin-btn-img"]
        .includes(event.target?.className)) {
            chrome.runtime.sendMessage({ metric: event.target?.id?.split("-")[1] });
    }
});

const observer = new MutationObserver(list => {
    renderTooltips();
});

observer.observe(document.body, {childList: true, subtree: true});

function renderTooltips() {
    let elements = document.getElementsByClassName("x_easyinsight-kpi-trigger");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mouseenter", function(ev) {
            ev.preventDefault();
            let metric = this.querySelector("label").textContent;
            let rawValue = rawDataMetrics.filter(i => metric?.trim() === i.value + " " + i.textlabel)[0];
            let imageUrl = chrome.runtime.getURL(`/images/${rawValue?.imagelabel}.png`);
            this.style.background = "#A4E1F6";
            this.lastElementChild.style.display = "flex";
            this.lastElementChild.querySelector("img").src = pushpinIconUrl;
            this.lastElementChild.lastElementChild.querySelector("img").src = imageUrl;
        });
        elements[i].addEventListener("mouseleave", function(ev) {
            ev.preventDefault();
            this.style.background = "none";
            this.lastElementChild.style.display = "none";
        });
    }
}

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

function loadData() {
    if (!rawDataMetrics.length) {
        $.ajax({
            url: `https://624561e47701ec8f7251298c.mockapi.io/easyinsights/oacmetrics`,
            dataType: "json"
        }).done((data) => { 
            rawDataMetrics = data;
            chrome.storage.sync.set({'rawDataMetrics': rawDataMetrics });
        });
    }
}