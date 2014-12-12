/**
 * Created by sajit on 12/11/14.
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('../main.html', {
        id: "GDriveExample",
        bounds: {
            width: 500,
            height: 600
        },
        minWidth: 500,
        minHeight: 600,
        frame: 'none'
    });
});