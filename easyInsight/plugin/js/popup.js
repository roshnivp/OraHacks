let metrics = [];
let ul;
let rawDataMetrics = [];


$(document).ready(() => {
  console.log("popup.js - $(document).ready");

  // On Value Change in the Search Bar
  document.getElementById("easyInsight-search-pinboard").addEventListener('change', (event) => {
    let searchTest = document.getElementById("easyInsight-search-pinboard").value;
    console.log("Typing Something", event, searchTest);
    let filtered_metrics = metrics.filter(m => m.toUpperCase().indexOf(searchTest.toUpperCase()) !== -1);
    dumpMetrics(filtered_metrics);
  });
  // chrome.storage.sync.set({'pinnedMetrics': []});
  chrome.storage.sync.get('rawDataMetrics', (result) => {
    rawDataMetrics = result.rawDataMetrics;
    console.log("setting rawDataMetrics", rawDataMetrics);
  });
  // To Load the Pin Board on Page Load
  chrome.storage.sync.get("pinnedMetrics", (result) => {
    metrics = result.pinnedMetrics || [];
    console.log(metrics);
    dumpMetrics(metrics);
  });

});

function cleanupPinBoard(parent){
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function dumpMetrics(inputmerics) {
  ul = document.getElementById("easyInsight-metrics-pinboard");
  if (ul) {
    console.log(ul);
    cleanupPinBoard(ul);
    for (var i = 0; i< inputmerics.length; i++)
    {
      console.log('dumpMetrics rawValue before', rawDataMetrics);
      let rawValue = rawDataMetrics.filter(j => inputmerics[i] === j.value + " " + j.textlabel)[0];
      console.log('dumpMetrics rawValue', rawValue);

      let li_elm = document.createElement("li");
      li_elm.classList.add("w3-panel");
      li_elm.classList.add("w3-card");
      li_elm.style="padding: 10px 0px; border-radius: 15px;";
      // let a_elm = document.createElement("a");
      // a_elm.href = 'https://www.w3schools.com';
      // a_elm.innerHTML="link";

      let h4_elm = document.createElement("h4");
      let bold_elm = document.createElement("p");
      bold_elm.innerHTML = inputmerics[i];
      bold_elm.style="margin-left: 10px;font-weight: 700;";
      h4_elm.appendChild(bold_elm);

      let btn_elem1 = document.createElement("button");
      btn_elem1.classList.add("btn");
      btn_elem1.classList.add("btn-default");
      btn_elem1.classList.add("btn-sm");
      btn_elem1.style="margin-left: 10px;border-radius: 15px;";
      let btn_span_elem = document.createElement("span");
      btn_span_elem.classList.add("glyphicon");
      btn_span_elem.classList.add("glyphicon-trash");
      // btn_span_elem.innerHTML = "Remove";
      btn_elem1.appendChild(btn_span_elem);
      let id = inputmerics[i];
      btn_elem1.onclick = function() {
        console.log(id);
        unPin(id);
      };

      let btn_elem2 = document.createElement("button");
      btn_elem2.classList.add("easyinsight-delete-btn");
      btn_elem2.classList.add("btn");
      btn_elem2.classList.add("btn-default");
      btn_elem2.classList.add("btn-sm");
      btn_elem2.style="margin-left: 10px;border-radius: 15px;";
      btn_span_elem = document.createElement("span");
      btn_span_elem.classList.add("glyphicon");
      btn_span_elem.classList.add("glyphicon-link");
      // btn_span_elem.innerHTML = "Dashboard";
      btn_elem2.appendChild(btn_span_elem);
      let url = rawValue.dashboardurl;
      btn_elem2.onclick = function() {
        console.log(url);
        window.open(url, '_blank');
      };


      let btn_elem3 = document.createElement("button");
      btn_elem3.classList.add("easyinsight-delete-btn");
      btn_elem3.classList.add("btn");
      btn_elem3.classList.add("btn-default");
      btn_elem3.classList.add("btn-sm");
      btn_elem3.style="margin-left: 10px;border-radius: 15px;";
      btn_span_elem = document.createElement("span");
      btn_span_elem.classList.add("glyphicon");
      btn_span_elem.classList.add("glyphicon-share");
      // btn_span_elem.innerHTML = "Dashboard";
      btn_elem3.appendChild(btn_span_elem);
      url = rawValue.dashboardurl;
      btn_elem3.onclick = function() {
        console.log(url);
        window.open(url, '_blank');
      };

      // <button type="button" class="btn btn-default btn-sm">
      // <span class="glyphicon glyphicon-trash"></span> Remove Pin
      // </button>

      let img = document.createElement("img");
      img.src=`images/${rawValue.imageurl}.png`;
      img.style="width:100%;";

      let page_break_elem = document.createElement("br");
      let hairline_elem = document.createElement("hr");
      hairline_elem.style = "margin: 10px 0;";

      li_elm.appendChild(img);
      li_elm.appendChild(bold_elm);
      // li_elm.appendChild(page_break_elem);
      li_elm.appendChild(hairline_elem);
      li_elm.appendChild(btn_elem2);
      li_elm.appendChild(btn_elem1);
      li_elm.appendChild(btn_elem3);
      ul.appendChild(li_elm);
    }
    console.log(ul);
  }
}




function unPin(metric) {
  console.log("unPin getting called");
  chrome.storage.sync.get("pinnedMetrics", (result) => {
    metrics = metrics.filter(m => m != metric);
    chrome.storage.sync.set({'pinnedMetrics': metrics})
    dumpMetrics(metrics);
  });
}

// To Capture Add to Pin Event
chrome.storage.onChanged.addListener((changes) => {
  chrome.storage.sync.get('rawDataMetrics', (result) => {
    rawDataMetrics = result.rawDataMetrics;
    console.log("setting rawDataMetrics", rawDataMetrics);
  });

  ul = document.getElementById("easyInsight-metrics-pinboard");
  if (changes.pinnedMetrics) {
    metrics = changes.pinnedMetrics.newValue;
    console.log(metrics);
    dumpMetrics(metrics);
  }
});
