
var width = 0;
var iframe = document.createElement('iframe');
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = width+"px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.frameBorder = "none";
iframe.src = chrome.runtime.getURL("popup.html");
document.body.appendChild(iframe);

chrome.runtime.onMessage.addListener(function(msg, sender){
    console.log(msg);
    if(msg.action === "TOGGLE_PANEL" && !msg.update){
        toggle();
    }
    return true;
});

function toggle(){
    if(iframe.style.width == "0px"){
        width = 300;
        document.body.style.width = (document.body.clientWidth  - width) + "px";
    } else {
       width = 0;
       document.body.style.width = "100%";
    }
    iframe.style.width = width+"px";
}