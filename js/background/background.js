/**
 * Created by sajit on 12/19/14.
 */

console.log('Hello');

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('../../tab.html', {
        'bounds': {
            'width': window.screen.width,
            'height': window.screen.height
        }
    });
});