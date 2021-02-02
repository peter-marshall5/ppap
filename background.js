function launch() {
    chrome.app.window.create("ppap.html", {
        "outerBounds": {
            "width": 320,
            "height": 462
        }
    });
}
chrome.app.runtime.onLaunched.addListener(launch);
chrome.runtime.onInstalled.addListener(function(e) {
    if(e.reason == "install") {
        launch();
    }
});