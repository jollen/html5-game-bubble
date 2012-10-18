// 1. 一個 Root object
// 2. 利用 Sizzle 建立 '$' Selector
var bubble = {

	screens : {},
	settings : {
		maxBalls: 10,
		maxRadius: 60,
		maxDelay: 50,
		timeout: 10000		// 10 seconds
	}
	
};

window.addEventListener("load", function() {

Modernizr.load([
    {
        load : [
            "sizzle.js",        
            "scripts/dom.js",
            "scripts/game.js"
        ],
        complete : function() {
            bubble.game.initialize(function() { 	// 使用 Callback
            	bubble.game.showScreen();
            	bubble.game.start();
            });
        }
    }
]);

}, false);
