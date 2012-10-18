bubble.game = (function () {
	
	var dom = bubble.dom,
		$ = dom.$;

	
	var settings,
		maxBalls,
		maxRadius,
		maxDelay,
		timeout;

	var worker;
	
	// 目前的狀態
	var ballX,
		ballY,
		ballRadi;
		
	// Timeout var
	var timeoutVar;
		
	var scores;
	
	var scoreBoard;
	
	// 可以使用 Worker Thread 來實作 Asynchronous function call
	function initialize(callback) {
		settings = bubble.settings;		// 放到 local variable 再使用
		maxBalls = settings.maxBalls;
		maxRadius = settings.maxRadius;	
		maxDelay = settings.maxDelay;
		timeout = settings.timeout;
		
        //scoreBoard = $("#game #score-board")[0];
		scoreBoard = document.getElementById("score-board");
		
        // 建立 WebSocket
        websocket = new WebSocket("ws://svn.moko365.com:8080/", ['game-protocol']);

		callback();	
	}
	
	function showScreen() {
		createBackground();
	}
	
	// should be Called from worker thread
	function addBall() {
		// 隨機產生球半徑
		var radi = randomBall();
		var delay;
		
		//console.log("radius: " + radi);
		
		// 把球畫上去
		createBall(radi);
		
		//
		delay = ballRadi * maxDelay;
	
		timeout = timeout - delay;
		 
		if (timeout > 0) {
			timeoutVar = setTimeout(addBall, delay);
		} else {
			console.log("Game Over. Your scores: " + scores);
	        document.getElementById("draw-background").removeEventListener("click", 
	        	touchEvent,
	        	false);			
            gameOver();
		}
	}
	
	function randomBall() {
		// integer value between 0 and (maxRadius - 1)
		var radi = Math.floor(Math.random() * maxRadius); 
		// 最小是 10	
		if (radi < 10) radi = 10;
		
		return radi;
	}
	
    var websocket;

	function gameOver() {
		console.log("Game Over. Your scores: " + scores);
		scoreBoard.innerHTML = "Game Over! Scores: " + scores;

        // 送出分數
        websocket.send("{scores:" + scores + "}");
	}
	
	function createBall(radi) {
		var canvas = document.getElementById("draw-background"),
			ctx = canvas.getContext("2d"),
			background = $("#game .background")[0],
			rect = background.getBoundingClientRect();
			
			canvas.width = rect.width;
			canvas.height = rect.height;
			
			// 產生位置
			var x = Math.floor(Math.random() * (rect.width - radi)),
				y = Math.floor(Math.random() * (rect.height - radi));
				
			ballX = x;
			ballY = y; 
			ballRadi = radi;
				
			//console.log("x = " + x + ", y = " + y);
			
			ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.beginPath();
            ctx.arc(x, y, radi, 0 * Math.PI, 2 * Math.PI, false);	
            ctx.closePath();	
            ctx.fill();
	}
	
	function createBackground() {
		var canvas = document.getElementById("draw-background"),
			ctx = canvas.getContext("2d"),
			background = $("#game .background")[0],
			rect = background.getBoundingClientRect();
			
		canvas.width = rect.width;
		canvas.height = rect.height;
		
		ctx.scale(rect.width, rect.height);
		
		console.log("background width: " + rect.width, " height: " + rect.height);
		
		// 畫背景圖
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, rect.width, rect.height);	
	}
	
	function touchEvent(event) {
		//console.log("Touch X: " + event.clientX + ", Touch Y: " + event.clientY);
		
		var x, y, r;
	 	var x1, x2;
		var y1, y2;
		var clientX, clientY;
		
		clientX = event.clientX;
		clientY = event.clientY;
		
		// 四個角
		x1 = ballX - ballRadi;
		x2 = ballX + ballRadi;		
		y1 = ballY - ballRadi;
		y2 = ballY + ballRadi;
		
		if ((clientX > x1) && (clientX < x2)) {
			if ((clientY > y1) && (clientY < y2)) {
				scores = scores + (maxRadius - ballRadi);
				console.log("Hit! Scores: " + scores);
				
				scoreBoard.innerHTML = "Scores: " + scores;
			}
		}
		
		console.log("missed");
		
		// Redraw a ball
		clearTimeout(timeoutVar);
		addBall();
	}
		
	function start() {
        // 初始化輸入事件
        document.getElementById("draw-background").addEventListener("click", 
        	touchEvent,
        	false);
        
        scores = 0;
        ballRadi = maxRadius;		
		
		// 隨機產生球半徑
		var radi = randomBall();
				
		// 第一顆球
		createBall(radi);
 
		timeoutVar = setTimeout(addBall, 3000);
	}
	
	return {
		initialize:	initialize,	// 建立初始化函數
		showScreen: showScreen,	// 遊戲畫面開始
		addBall: addBall,		// 加入一顆球
		start: start
	};
	
})();
