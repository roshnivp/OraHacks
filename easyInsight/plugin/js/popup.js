let metrics = [];
let ul;

document.addEventListener('DOMContentLoaded', function () {
  ul = document.getElementById("easyInsight-metrics");
  chrome.storage.sync.get("pinnedMetrics", (result) => {
    metrics = result.pinnedMetrics || [];
    dumpMetrics();
  });
});

function dumpMetrics() {
  if (ul) {
    // for (var i = 0; metrics.length; i++)
    // {
    //     var li = document.createElement("li");  
    //     li.classList.add("w3-panel");
    //     li.classList.add("w3-card");
    //     var a = document.createElement("a");
    //     var btn = document.createElement("button");
    //     btn.innerHTML = "UnPin";
    //     btn.onclick = function(metric) {
    //       unPin(metric);
    //     }(metrics[i]);
    //     a.href = 'https://www.w3schools.com';
    //     var img = document.createElement("img");
    //     img.src="images/img6.png";
    //     a.innerHTML = metrics[0];
    //     li.appendChild(a);
    //     li.appendChild(img);
    //     ul.appendChild(li);
    // }
  }
}

function unPin(metric) {
  chrome.storage.sync.get("pinnedMetrics", (result) => {
    metrics = metrics.filter(m => m != metric);
    chrome.storage.sync.set({'pinnedMetrics': metrics})
  });
}

chrome.storage.onChanged.addListener((changes) => { 
  if (changes.pinnedMetrics) {
    metrics = changes.pinnedMetrics.newValue;
    dumpMetrics();
  }
});
