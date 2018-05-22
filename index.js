$(document).ready(function(){
	init();
});

// Canvas Setup
// Loading Text
// Intro
// Main Game
// Endframe

function init() {

	var log = console.log;
	//log('init');

	var Utils = {};
	var Game = {};
	var Sounds = {};
	var Sprites = {};
	var Text = {};

	var t = TweenMax;

	var tlIntro 	= new TimelineMax({paused:true});
	var tlOutro 	= new TimelineMax({paused:true});
	var tlEndOut 	= new TimelineMax({paused:true});
	var tlGameOver 	= new TimelineMax({paused:true});

	Text = (function() {
		var interfaceTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontFamily: 'uniform_roundedbold',
			fontSize: '28px',
			letterSpacing: -1,
			fill: '0xFFFFFF',
		});

		var ctaTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontFamily: 'uniform_roundedbold',
			fontSize: '28px',
			letterSpacing: -2,
			fill: '0xFFFFFF',
		});

		var subHeadTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontSize: '36px',
			fontFamily:'uniform_roundedblack',
			fill: '0xFFFFFF',
			letterSpacing:1
		});
		var yourScoreTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontSize: '100px',
			fontFamily:'uniform_roundedultra',
			fill: '0xFFFFFF',
			letterSpacing: -4
		});

		return {
			interfaceTextStyle 	: interfaceTextStyle,
			ctaTextStyle 		: ctaTextStyle,
			subHeadTextStyle 	: subHeadTextStyle,
			yourScoreTextStyle 	: yourScoreTextStyle,
		}

	}());

	//Interface

	var loadingText, scoreText, timerText, scoreIcon, timerIcon, timerBg;
	var interfaceHolder, heartHolder, timerHolder, scoreHolder;
	var timerSectors, timerSectorLength, beginAngle;
	var heart1, heart2, heart3;

	// INTRO
	var ctaBg, ctaText, ctaHolder, overlay, ahLogo, logoTextures, instructionText, cabLogo, cabCatch, cabA, cabBite, cabBg, cabCandy1, cabCandy2, cabCandy3, cabCandy4, intro;

	//MAIN
	var main, bgHolder, candyHolder, fgHolder, airheadHolder, hitRect;
	var sky_bg, buildings, trees, hedges, street, lightpoles;
	var candy0, candy1, candy2, candy3, candy4, candy5, candy6;
	var airHead, airBody, leftArm, rightArm, leftLeg, rightLeg, torso, head, pelvis, headTextures, ashleigh;
	var candies = [];

	//ENDFRAME
	var endFrame, overlayEnd, endCtaBg1, endCtaBg2, endCtaHolder1, endCtaHolder2, endCtaText1, endCtaText2, ahLogoEnd, yourScoreText, endSubhead;
	var cabLogoEnd, cabCatchEnd, cabAEnd, cabBiteEnd, cabBgEnd, cabCandy1End, cabCandy2End, cabCandy3End, cabCandy4End;

	//Sounds
	var bgSound, flapSound, buttonSound, eatSound, loseSound, winSound, overSound;

	//GAME
	var Application = PIXI.Application,
	loader 			= PIXI.loader,
	resources 		= PIXI.loader.resources,
	Sprite 			= PIXI.Sprite,
	gameTime 		= 30,
	elapsedTime 	= 0,
	timerSectors 	= 30,
	timerSectorLength = Math.PI * 2 / timerSectors,
	beginAngle 		= 0 / timerSectors * Math.PI * 2,
	lives 			= 3,
	mainBlurAmount 	= 10,
	topHits 		= 0,
	bottomHits 		= 0,
	score 			= 0,
	flapBoost 		= 0.0,
	sinkRate 		= 4.0,
	candySpeed 		= 3,

	skyScrollRate 		= 0.3,
	buildingScrollRate 	= 0.6,
	treesScrollRate 	= 0.7,
	hedgesScrollRate 	= 0.8,
	streetScrollRate 	= 1.0,
	fgScrollRate 		= 1.5,

	bgSpeedMod 			= 0.0,
	candySpeedMod 		= 0.0,

	won, lost,

	playing 		= false,
	introPlaying 	= false,
	_width 			= window.innerWidth,
	_height 		= window.innerHeight;

	var screenSize;

	var ticker 			= new PIXI.ticker.Ticker({ autoStart : false});
	var introTicker 	= new PIXI.ticker.Ticker({ autoStart : false})

	ticker.autoStart = false;
	introTicker.autoStart = false;

	ticker.stop();
	introTicker.stop();

	Utils = (function(){
		var getMousePosition = function() {
			return app.renderer.plugins.interaction.mouse.global;
		}
		var random = function(min, max) {
			if (max == null) { max = min; min = 0; }
			return Math.round(Math.random() * (max - min) + min);
		}
		var hitTest = function(r1, r2) {
			var hit, combinedHalfWidths ,combinedHalfHeights, vx, vy;
			hit = false;
			r1.centerX = r1.x;
			r1.centerY = r1.y;
			r2.centerX = (r2.x + 40);
			r2.centerY = (r2.y - 10);
			r1.halfWidth = r1.width / 2;
			r1.halfHeight = r1.height / 2;
			r2.halfWidth = 20;
			r2.halfHeight = 60;
			vx = r1.centerX - r2.centerX;
			vy = r1.centerY - r2.centerY;
			combinedHalfWidths = r1.halfWidth + r2.halfWidth;
			combinedHalfHeights = r1.halfHeight + r2.halfHeight;
			if (Math.abs(vx) < combinedHalfWidths) {
				//Collision X
				if (Math.abs(vy) < combinedHalfHeights) {
					//There's definitely a collision happening
					hit = true;
	    		} else {
					//no collision on the y axis
					hit = false;
	    		}
			} else {
				//There's no collision on the x axis
				hit = false;
			}
			return hit;
			}

			return {
				random : random,
				hitTest : hitTest,
				getMousePosition : getMousePosition
		}
	}());

	/*
  	* * * * * * * * * * * * * * *

    = = = SET UP THE STAGE  = = =

    * * * * * * * * * * * * * * *
    */


	var game = $('<div>', {id:'game'}).appendTo('body');

	var closeBtn = $('<div>', {id : 'closeBtn'}).appendTo(game);



	if (_width >= 1280 ) {
		screenSize = 'desktop';
		//log(screenSize);
		$(game).css({width:1280, height:500});
		app = new Application({width : 1280, height : 500, legacy : true});
	} else if (_width < 1280 && _width >= 728 ) {
      	screenSize = 'tablet';
      	if (_height > 500) {
			//log(screenSize);
			$(game).css({width:'100%', height:500});
          	app = new Application({width : _width, height : 500, forceCanvas : true});
        } else {
          $(game).css({width:'100%', height:'100%'});
          app = new Application({width : _width, height : _height, forceCanvas : true});
        }
	} else if ( _width < 728 ) {

      	if(Math.abs(window.orientation) === 90) {
          	screenSize = 'tablet';
          	$(game).css({width:'100%', height:'100%'});
        	app = new Application({width : _width, height : _height, forceCanvas : true});
        } else {
          	screenSize = 'mobile';
			//log(screenSize);
			$(game).css({width:'100%', height:'100%'});
			app = new Application({width : _width, height : _height, forceCanvas : true});
        }
	}




	app.renderer.backgroundColor = 0x0040A3;

	//app.renderer.view.width = 1280;
	//app.renderer.view.height = 500;

	$(app.view).appendTo(game);

	var stageW = app.renderer.view.width;
	var stageH = app.renderer.view.height;

	loadingText = new PIXI.Text('LOADING      ');
	loadingText.style = {fill: 'WHITE', font:'20px uniform_roundedbold'};
	loadingText.position.set(stageW / 2 - loadingText.width / 2, stageH / 2);
	app.stage.addChild(loadingText);

	function initAudio() {
		bgSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/bg-sound.mp3'],
			volume: 0.5,
			loop: true,
		});
		flapSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/jump-sound.mp3'],
			volume: 0.5
		});
		buttonSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/button-sound.mp3'],
			volume: 0.5
		});
		eatSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/eat-sound.mp3'],
			volume: 0.5
		});
		loseSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/lose-sound.mp3'],
			volume: 0.5
		});
		winSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/win-sound.mp3'],
			volume: 0.5
		});
		overSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/over-sound.mp3'],
			volume: 0.5
		});


		var audioCount = 0;
		function updateAudioProgress() {
			audioCount += 1;
			//log(audioCount);
			if (audioCount === 7) {
				introTicker.stop();
				introTicker.remove();
				introTicker.destroy();
				setTimeout( function() { bgSound.play(); }, 500);
				intro.alpha = 0.0;
				intro.destroy();
				playing = true;
				ticker.start();
			}
		}


		bgSound.once('load', updateAudioProgress());
		flapSound.once('load', updateAudioProgress());
		buttonSound.once('load', updateAudioProgress());
		eatSound.once('load', updateAudioProgress());
		loseSound.once('load', updateAudioProgress());
		winSound.once('load', updateAudioProgress());
		overSound.once('load', updateAudioProgress());
	}

	function setUpReplay() {
		//log('SET REPLAY');

		buttonSound.play();

		endCtaHolder1.off('pointerup');

		airHead.y = -200;

		if (playing === false) {
			score = 0;
			scoreText.setText(score);
			lives = 3;
			ahLogoEnd.gotoAndStop(0);
			bgSpeedMod 			= 0.0;
			candySpeedMod 		= 0.0;
			skyScrollRate 		= 0.3;
			buildingScrollRate 	= 0.6;
			treesScrollRate 	= 0.7;
			hedgesScrollRate 	= 0.8;
			streetScrollRate 	= 1.0;
			fgScrollRate 		= 1.5;
			candySpeed 			= 3.0;
			gameTime 			= 30;
			elapsedTime 		= 0;
			bottomHits 			= 0;

			for ( var i = 0; i < candies.length; i++ ) {
				t.set(candies[i], {pixi:{x:Utils.random(stageW, stageW * 2), y:Utils.random(50, stageH - 100)}} );
			}

			t.set([heart1, heart2, heart3], {pixi:{alpha:1}});
			mainBlur.blur = 0.0;
			endFrame.position.set(0, stageH);
			setTimeout( function() { bgSound.play(); }, 500);
			t.to(bgSound, 0.5, {voluem:0.5});
			playing = true;
			ticker.start();
		}



		/*tlEndOut.add('begin')
		.to(cabLogoEnd.children, 0.4, {pixi:{scale:0.5, alpha:0.0}, ease:Power2.easeOut})
		.to(yourScoreText, 	0.4, {pixi:{y:'-=200', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to(endSubhead, 	0.4, {pixi:{y:'-=200', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to([endCtaHolder1, endCtaHolder2], 0.4, {pixi:{y:'+=100', alpha:0}, ease:Power3.easeOut}, '-=0.40')
		.to(ahLogoEnd, 	0.4, {pixi:{y:'+=100', alpha:0}, ease:Power3.easeOut}, '-=0.40')
		.to(overlayEnd, 0.4, {pixi:{y:'+=100', alpha:0}, ease:Power3.easeOut, onComplete:initReplay}, '-=0.40')
		.add('end');
		//endFrame.position.set(0, stageH);
		//tlEndOut.play();
		function initReplay() {
			log('INIT REPLAY');
			endFrame.position.set(0, stageH);
			//tlEndOut.seek('begin');
			playing = true;
			ticker.start();
		}
		*/
	}


	function handleDeath() {
		//log('You Died');

		loseSound.play();

		ticker.stop();
		bottomHits = 0;
		//airHead.y = -airHead.height;
		t.set(airHead, {pixi:{y:-200}});
		if (lives === 3 ) {
			t.to(heart1, 0.05, {pixi:{alpha:0}, ease:Power3.easeOut, yoyo:true, repeat:4});
			lives = 2;
			setTimeout( function() {
				ticker.start();
				t.to(airHead, 0.1, {pixi:{alpha:0.1}, ease:Power0.easeNone, yoyo:true, repeat:11, delay:0.0});
			}, 500);
		} else if ( lives === 2) {
			t.to(heart2, 0.05, {pixi:{alpha:0}, ease:Power3.easeOut, yoyo:true, repeat:4});
			lives = 1;
			setTimeout( function() {
				ticker.start();
				t.to(airHead, 0.1, {pixi:{alpha:0.1}, ease:Power0.easeNone, yoyo:true, repeat:11, delay:0.0});
				}, 500);
		} else if ( lives === 1 ) {
			t.to(heart3, 0.05, {pixi:{alpha:0}, ease:Power3.easeOut, yoyo:true, repeat:4});
			lives = 0;
			handleGameOver(false);
		}
	}


	function handleGameOver( won ) {

		playing = false;

		if (won === true ) {
			//log('you win');

			t.to(bgSound, 0.5, {voluem:0, onComplete:function() {
				setTimeout( function() { winSound.play(); }, 300);
				bgSound.stop();
			} });

			endSubhead.setText(' Great job! ' );
		} else {
			//log('You Lost');

			t.to(bgSound, 0.5, {voluem:0, onComplete:function() {
				setTimeout( function() { overSound.play(); }, 300);
				bgSound.stop();
			} });

			endSubhead.setText(' Nice Try! ' );
		}

		yourScoreText.setText(' Your score: ' + score + ' ');
		//yourScoreText.position.set(stageW / 3 - yourScoreText.width / 2, 168);

		tlGameOver.add('begin')
		.to(main, 				0.3, {pixi:{blurX:10.0, blurY:10.0}}, '+=1.0')
		.from(overlayEnd, 		0.4, {pixi:{y:'-=400', alpha:0}, ease:Power3.easeOut})
		.from(cabCatchEnd, 		0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut})
		.from(cabAEnd, 			0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(cabBiteEnd, 		0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(cabBgEnd, 		0.2, {pixi:{scale:0,   alpha:0}, ease:Power3.easeOut}, '-=0.7')
		.from(cabCandy4End, 	0.6, {pixi:{scale:0.5, alpha:0}, ease:Elastic.easeOut}, '-=0.6')
		.from(cabCandy1End, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(cabCandy2End, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(cabCandy3End, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(yourScoreText, 	0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(endSubhead, 		0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(ahLogoEnd, 		0.6, {pixi:{scale:0.7, alpha:0}, ease:Power3.easeOut}, '+=0.1')
		.addCallback(function() { ahLogoEnd.play(); }, '-=0.65')
		.from(endCtaHolder1, 	0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(endCtaHolder2, 	0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.addCallback(function() { setUpEndCta(); })
		.add('end');

		//, onComplete:setUpEndCta

		function setUpEndCta() {
			//log('end cta');

			endCtaHolder1.on('mouseover', function(e){
				t.to(endCtaBg1, 0.6, {pixi:{scale:1.2}, ease:Elastic.easeOut});
				t.to(endCtaText1, 0.2, {pixi:{y:'+=10', alpha:0}, ease:Power3.easeOut});
				t.set(endCtaText1, {pixi:{y:'-=30'}, delay:0.2})
				t.to(endCtaText1, 0.6, {pixi:{y:'+=20', alpha:1, scale:1.1}, ease:Elastic.easeOut, delay:0.20});
			}).on('mouseout', function(e){
				t.to(endCtaBg1, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
				t.to(endCtaText1, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
			}).on('pointerup', setUpReplay);

			endCtaHolder2.on('mouseover', function(e){
				t.to(endCtaBg2, 0.6, {pixi:{scale:1.2}, ease:Elastic.easeOut});
				t.to(endCtaText2, 0.2, {pixi:{y:'+=10', alpha:0}, ease:Power3.easeOut});
				t.set(endCtaText2, {pixi:{y:'-=30'}, delay:0.2})
				t.to(endCtaText2, 0.6, {pixi:{y:'+=20', alpha:1, scale:1.1}, ease:Elastic.easeOut, delay:0.20});
			}).on('mouseout', function(e){
				t.to(endCtaBg2, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
				t.to(endCtaText2, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
			});

		}

		endFrame.position.set(0, 0);
		tlGameOver.play();


	}


	function handleFlap() {
		//log('HANDLE FLAP');
		if (playing === true) {
			//log('FLAP');

			flapSound.play();
			t.to(rightLeg, 	0.3, {pixi:{rotation:20}});
			t.to(leftLeg, 	0.3, {pixi:{rotation:40}});
			t.to(rightArm, 	0.3, {pixi:{rotation:60}});
			t.to(leftArm, 	0.3, {pixi:{rotation:60}});
			t.to(head, 		0.6, {pixi:{rotation:-10}});
			t.to([rightLeg,leftLeg, head, rightArm, leftArm, airBody], 0.9, {pixi:{rotation:0}, delay:1.0, ease:Elastic.easeOut});
			if (airHead.y < stageH / 2 ) {
				flapBoost += 2.5;
			} else {
				flapBoost += 8.5;
			}
		}
	}

	function handleAirHead(delta) {

		airHead.y += sinkRate;
		airHead.y -= flapBoost;

		if ( flapBoost > 0) {
			if ( airHead.y < stageH / 3 ) {
				flapBoost -= 0.35;
			} else if ( airHead.y < stageH / 2 ) {
				flapBoost -= 0.25;
			} else {
				flapBoost -= 0.10;
				t.set(head, {pixi:{rotation:0}});
			}
		} else {
			flapBoost = 0;
		}
		if (airHead.y + (airHead.height - head.height * 1.1) > stageH ) {
			sinkRate = 0.0;
			bottomHits += 1;
			if ( bottomHits > 20 ) {
				handleDeath();
			}
		} else {
			sinkRate = 4.0;
		}
		if (airHead.y < 0 ) {
			flapBoost = 0;
			topHits += 1;
			handleTopHit();
		}
	}

	function bgScroll(delta) {
		sky_bg.tilePosition.x 		-= skyScrollRate;
		buildings.tilePosition.x  	-= buildingScrollRate;
		trees.tilePosition.x 		-= treesScrollRate;
		hedges.tilePosition.x 		-= hedgesScrollRate;
		street.tilePosition.x 		-= streetScrollRate;
		lightpoles.tilePosition.x 	-= fgScrollRate;

		skyScrollRate 				+= bgSpeedMod;
		buildingScrollRate 			+= bgSpeedMod;
		treesScrollRate 			+= bgSpeedMod;
		hedgesScrollRate 			+= bgSpeedMod;
		streetScrollRate 			+= bgSpeedMod;
		fgScrollRate 				+= bgSpeedMod;
		candySpeed 					+= candySpeedMod;

	}

	function candyScroll(delta) {
		candy5.rotation -= 0.01;
		candy6.rotation -= 0.005;
		for ( var i = 0; i < candies.length; i++ ) {
			candies[i].x -= candySpeed;
			if (candies[i].x < 0 - candies[i].width) {

				if ( screenSize === 'mobile' ) {
					candies[i].x = stageW + Utils.random(0, stageW * 4);
				} else {
					candies[i].x = stageW + candies[i].width;
				}

				candies[i].y = Utils.random(50, stageH - 100);
			}
			if (Utils.hitTest(candies[i], airHead)) {
				//log('CANDY COLLISION');
				//candies[i].x = stageW + Utils.random(200, 400);

				if ( screenSize === 'mobile' ) {
					candies[i].x = stageW + Utils.random(0, stageW * 4);
				} else {
					candies[i].x = stageW + Utils.random(200, 400);
				}

				candies[i].y = Utils.random(50, stageH - 100);
				handleScore();
			}
		}
	}

	function handleScore() {

		if (score === 0) {
			airBody.alpha = (1.0);
			head.alpha = (1.0);
			ashleigh.alpha = (0.0);
		}


		head.play();
		head.onComplete = function() {
			head.gotoAndStop(0);
		}
		score += 1;
		scoreText.setText(score);
		bgSpeedMod += 0.0001;
		candySpeedMod += 0.0003;
		eatSound.play();
	}

	function handleTopHit() {
		t.to(rightLeg, 	0.10, {pixi:{rotation: 40}});
		t.to(leftLeg, 	0.10, {pixi:{rotation: 10}});
		t.to(rightArm, 	0.10, {pixi:{rotation: 90}});
		t.to(leftArm, 	0.10, {pixi:{rotation:-20}});
		t.to(airBody, 	0.15, {pixi:{rotation: 20}});
		t.to([rightLeg,leftLeg, head, rightArm, leftArm, airBody], 0.9, {pixi:{rotation:0}, delay:0.2, ease:Elastic.easeOut});
	}

	function handleTimer(delta) {
		gameTime -= (1 / Math.round(ticker.FPS));
		timerText.setText( Math.ceil(gameTime) );
		elapsedTime += (1 / Math.round(ticker.FPS));

		timerSectorLength = ((Math.PI / 180) * 360 / timerSectors) * elapsedTime;
		interfaceHolder.removeChild(timerIcon);
		timerIcon = new PIXI.Graphics();
		timerIcon.lineStyle(6, 0xFF3300, 1);
		timerIcon.arc(stageW - 80, stageH - 40, 10, 0 , timerSectorLength, false);
		interfaceHolder.addChild(timerIcon);

		if (Math.ceil(gameTime)  <= 0 ) {
			ticker.stop();
			handleGameOver(true);
		}
	}

	/*
	 - - - - - - - - - - - - - - - - - -
	 = = = = = = = = = = = = = = = = = =
	 = = = = = BEGIN GAME PLAY = = = = =
	 = = = = = = = = = = = = = = = = = =
	 - - - - - - - - - - - - - - - - - -
	*/
	function setUpGame() {
		//log('SET UP GAME');

		initAudio();

		//airHead.y = -airHead.height;
		airHead.y = -200;

		tlOutro.add('begin')
		.to(main, 				0.6, {pixi:{blurX:0.0, blurY:0.0}, ease:Power2.easeOut})
		//.to(cabLogo, 			0.4, {pixi:{y:'-=100', alpha:0.0}, ease:Power3.easeOut}, '-=0.55')
		.to(cabLogo.children, 	0.4, {pixi:{scale:0.5, alpha:0.0}, ease:Power2.easeOut}, '-=0.55')
		.to(ctaHolder, 			0.4, {pixi:{y:'+=100', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to(instructionText, 	0.4, {pixi:{x:'+=300', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to(overlay, 			0.4, {pixi:{x:'+=300', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to(ahLogo, 			0.4, {pixi:{x:'+=300', alpha:0.0,  scale:0}, ease:Power3.easeOut}, '-=0.40')
		.addCallback(destroyIntro)
		.add('end');

		function destroyIntro() {
			//log('Destroy Intro');
			//intro.alpha = 0.0;
			//intro.destroy();
			//playing = true;
			//ticker.start();
			//Howler.volume(0.001);
			//bgSound.play();
		}

		tlOutro.play();
		hitRect.on('pointerup', handleFlap);
	}

	function buildStage() {
		//log('BUILD STAGE');
		tlIntro.add('begin')
		.from(main, 		0.5, {pixi:{alpha:0}}, '+=1.0')
		.from(cabCatch, 	0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut})
		.from(cabCandy4, 	0.6, {pixi:{scale:0.5, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(cabA, 		0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(cabCandy3, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.75')
		.from(cabBite, 		0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(cabCandy2, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.75')
		.from(cabBg, 		0.2, {pixi:{scale:0, alpha:0}, ease:Power3.easeOut}, '-=0.7')
		.from(cabCandy1, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.75')
		.from(overlay, 		0.7, {pixi:{x:'+=40', alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(instructionText, 0.4, {pixi:{y:'+=40', alpha:0},ease:Elastic.easeOut}, '-=0.6')
		.from(ahLogo, 		0.8, {pixi:{scale:0.7, alpha:0}, ease:Power3.easeOut}, '-=0.2')
		.addCallback(function() { ahLogo.play() }, '-=0.85')
		.from(ctaHolder, 	0.6, {pixi:{y:'+=40', alpha:0, scale:0.5}, ease:Elastic.easeOut}, '-=0.6')
		.add('end');

		app.stage.addChild(main);
		app.stage.addChild(intro);
		app.stage.addChild(endFrame);
		endFrame.position.set(0, stageH);

		ctaHolder.on('mouseover', function(e){
			t.to(ctaBg, 0.6, {pixi:{scale:1.2}, ease:Elastic.easeOut});
			t.to(ctaText, 0.2, {pixi:{y:'+=10', alpha:0}, ease:Power3.easeOut});
			t.set(ctaText, {pixi:{y:'-=30'}, delay:0.2})
			t.to(ctaText, 0.6, {pixi:{y:'+=20', alpha:1, scale:1.1}, ease:Elastic.easeOut, delay:0.21});
		}).on('mouseout', function(e){
			t.to(ctaBg, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
			t.to(ctaText, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
		});
		ctaHolder.on('pointerup', setUpGame);
		tlIntro.play();

		introTicker.start();
		introPlaying = true;
	}

	function setPosition() {
		//log('SET POSITION');

		// -------
		//  INTRO
		// -------

		// - overlay

		// - CAB Logo
		cabCatch.anchor.set(0.5)
		cabA.anchor.set(0.5)
		cabBite.anchor.set(0.5)
		cabBg.anchor.set(0.5)
		cabCandy1.anchor.set(0.5)
		cabCandy2.anchor.set(0.5)
		cabCandy3.anchor.set(0.5)
		cabCandy4.anchor.set(0.5)
		cabCatch.position.set(cabCatch.width / 2, cabCatch.height / 2);
		cabA.position.set(cabA.width / 2, cabA.height / 2);
		cabBite.position.set(cabBite.width / 2, cabBite.height / 2);
		cabBg.position.set(cabBg.width / 2, cabBg.height / 2);
		cabCandy1.position.set(cabBg.width / 2, cabBg.height / 2);
		cabCandy2.position.set(cabBg.width / 2, cabBg.height / 2);
		cabCandy3.position.set(cabBg.width / 2, cabBg.height / 2);
		cabCandy4.position.set(cabBg.width / 2, cabBg.height / 2);

		cabLogo.addChild(cabCandy4);
		cabLogo.addChild(cabBg);
		cabLogo.addChild(cabCatch);
		cabLogo.addChild(cabA);
		cabLogo.addChild(cabBite);
		cabLogo.addChild(cabCandy1);
		cabLogo.addChild(cabCandy2);
		cabLogo.addChild(cabCandy3);

		// - CTA
		ctaBg.anchor.set(0.5);
		ctaText.anchor.set(0.5);
		ctaHolder.interactive = true;
		ctaHolder.buttonMode = true;
		ctaHolder.addChild(ctaBg);
		ctaHolder.addChild(ctaText);

		// - Airheads Logo
		ahLogo.anchor.set(0.5);
		ahLogo.animationSpeed = 0.3;
		ahLogo.loop = false;

		// - Instruction Text



		if (screenSize === 'desktop') {
			//log('Position Desktop');
			overlay.position.set(stageW - overlay.width, 0);
			cabLogo.position.set(stageW / 3 - cabLogo.width / 2 - 20, 20);
			ctaHolder.position.set( stageW / 3, stageH / 2 + 160);
			ahLogo.position.set(stageW - ahLogo.width / 2, 160);
			instructionText.position.set((overlay.x + overlay.width / 2) - instructionText.width / 2, stageH - instructionText.height - 60);
		} else if ( screenSize === 'tablet' ) {
			//log('Position Tablet');
			overlay.position.set( (stageW / 3) * 1.75, 0);
			cabLogo.scale.set(0.6);
			cabLogo.position.set(stageW / 3 - cabLogo.width / 2 - 20, 60);
			ctaHolder.position.set( stageW / 3, stageH / 2 + 160);
			ahLogo.scale.set(0.70);
			ahLogo.position.set(stageW - ahLogo.width / 2 + 20, 160);
			instructionText.style.fontSize = '20px';
			instructionText.style.letterSpacing = 1;
			instructionText.position.set( ((stageW - overlay.x) / 2 ) + overlay.x - instructionText.width / 2, stageH - instructionText.height - 60);
		} else if ( screenSize === 'mobile') {
			//log ('position mobile');

			overlay.anchor.set(0.5);
			overlay.width = stageW;

			overlay.rotation = (Math.PI / 180) * 90;
			overlay.position.set(stageW - overlay.width / 2, stageH - 80);

			cabLogo.scale.set(0.4);
			cabLogo.position.set(stageW / 2 - cabLogo.width / 2 - 20, 60);


			ctaHolder.scale.set(0.8);
			ctaHolder.position.set( stageW / 2, stageH / 2);


			ahLogo.scale.set(0.60);
			ahLogo.position.set( stageW / 2, stageH / 2 + ahLogo.height / 2 );

			instructionText.style.fontSize = '20px';
			instructionText.style.letterSpacing = 1;
			instructionText.position.set( stageW / 2 - instructionText.width / 2, stageH - instructionText.height - 20);
		}


		intro.addChild(overlay);
		intro.addChild(instructionText);
		intro.addChild(ahLogo);
		intro.addChild(ctaHolder);
		intro.addChild(cabLogo);

		// -------
		//  MAIN
		// -------

		// - Interface
		main.filters = [mainBlur];

		scoreText.position.set(76, stageH - scoreText.height - 26);
		scoreIcon.anchor.set(0.5);
		scoreIcon.scale.set(0.8);
		scoreIcon.position.set(42, stageH - ((scoreIcon.height / 2) + 20));

		timerText.position.set(stageW - timerText.width - 20, stageH - timerText.height - 26);

		heart1.position.set(0, 0);
		heart2.position.set(40, 0);
		heart3.position.set(80, 0);

		heartHolder.addChild(heart1);
		heartHolder.addChild(heart2);
		heartHolder.addChild(heart3);
		heartHolder.position.set(30, 20);

		interfaceHolder.addChild(heartHolder);
		interfaceHolder.addChild(timerBg);
		interfaceHolder.addChild(timerIcon);
		interfaceHolder.addChild(timerText);
		interfaceHolder.addChild(scoreIcon);
		interfaceHolder.addChild(scoreText);


		bgHolder.addChild(sky_bg);
		bgHolder.addChild(buildings);
		bgHolder.addChild(trees);
		bgHolder.addChild(hedges);
		bgHolder.addChild(street);

		airBody.addChild(leftArm);
		airBody.addChild(rightLeg);
		airBody.addChild(leftLeg);
		airBody.addChild(torso);
		airBody.addChild(rightArm);
		airHead.addChild(airBody);
		airHead.addChild(head);
		airHead.addChild(ashleigh);
		airHead.position.set(stageW / 3, 200);

		airBody.alpha = (0.0);
		head.alpha = (0.0);

		candy0.anchor.set(0.5);
		candy1.anchor.set(0.5);
		candy2.anchor.set(0.5);
		candy3.anchor.set(0.5);
		candy4.anchor.set(0.5);
		candy5.anchor.set(0.5);
		candy6.anchor.set(0.5);

		candyHolder.addChild(candy0);
		candyHolder.addChild(candy1);
		candyHolder.addChild(candy2);
		candyHolder.addChild(candy3);
		candyHolder.addChild(candy4);
		candyHolder.addChild(candy5);
		candyHolder.addChild(candy6);

		candies = [candy0, candy1, candy2, candy3, candy4, candy5, candy6];

		for ( var i = 0; i < candies.length; i++ ) {
			if (screenSize === 'mobile') {
				t.set(candies[i], {pixi:{x:Utils.random(stageW, stageW * 4), y:Utils.random(50, stageH - 100)}} );
			} else {
				t.set(candies[i], {pixi:{x:Utils.random(stageW, stageW * 2), y:Utils.random(50, stageH - 100)}} );
			}
		}

		if (screenSize === 'mobile') {

			bgHolder.scale.set(stageH / 500);
			lightpoles.alpha = 0;

			//bgHolder.height = stageH;
			//bgHolder.width = stageW;
			//street.height = stageH;
			//street.position.set(0,0);
			//street.tileScale = stageH / 500;
			/*sky_bg.scale.y = 1.2;
			sky_bg.height = stageH;
			//street.height = stageH / 3;
			street.position.set(0, stageH - stageH * 0.27);
			buildings.position.set(0, stageH - street.height - buildings.height - 50);
			//hedges.height = stageH;
			hedges.height = stageH;
			hedges.position.set(0.0);
			//hedges.position.set(0, street.height - 20);
			trees.position.set(0, stageH - street.height - trees.height - 60);
			lightpoles.alpha = 0;*/
			//lightpoles.height = 500;
			//lightpoles.position.set(0, stageH - lightpoles.height);
			//lightpoles.tilePosition.x -= 200;

		} else {

			buildings.position.set(0, 0);
			trees.position.set(0, 0);
			hedges.position.set(0, 0);
			street.position.set(0, 0);
			lightpoles.position.set(0, 0);
			lightpoles.tilePosition.x -= 200;


			/*buildings.position.set(0, 64);
			trees.position.set(0, 202);
			hedges.position.set(0, 0);
			street.position.set(0, 360);
			lightpoles.position.set(0, 0);
			lightpoles.tilePosition.x -= 200;
			*/

		}

		main.addChild(bgHolder);
		main.addChild(candyHolder);
		main.addChild(airHead);
		main.addChild(lightpoles);
		main.addChild(interfaceHolder);
		main.addChild(hitRect);

		// -------
		//  END FRAME
		// -------

		endCtaBg1.anchor.set(0.5);
		endCtaBg2.anchor.set(0.5);
		endCtaText1.anchor.set(0.5);
		endCtaText2.anchor.set(0.5);

		endCtaHolder1.addChild(endCtaBg1);
		endCtaHolder1.addChild(endCtaText1);
		endCtaHolder2.addChild(endCtaBg2);
		endCtaHolder2.addChild(endCtaText2);

		endCtaHolder1.interactive = true;
		endCtaHolder1.buttonMode = true;
		endCtaHolder2.interactive = true;
		endCtaHolder2.buttonMode = true;

		cabCatchEnd.anchor.set(0.5)
		cabCatchEnd.position.set(cabCatch.width/2, cabCatch.height / 2);
		cabAEnd.anchor.set(0.5)
		cabAEnd.position.set(cabA.width/2, cabA.height / 2);
		cabBiteEnd.anchor.set(0.5)
		cabBiteEnd.position.set(cabBite.width/2, cabBite.height / 2);
		cabBgEnd.anchor.set(0.5)
		cabBgEnd.position.set(cabBg.width/2, cabBg.height / 2);
		cabCandy1End.anchor.set(0.5)
		cabCandy1End.position.set(cabBg.width/2, cabBg.height / 2);
		cabCandy2End.anchor.set(0.5)
		cabCandy2End.position.set(cabBg.width/2, cabBg.height / 2);
		cabCandy3End.anchor.set(0.5)
		cabCandy3End.position.set(cabBg.width/2, cabBg.height / 2);
		cabCandy4End.anchor.set(0.5)
		cabCandy4End.position.set(cabBg.width/2, cabBg.height / 2);

		cabLogoEnd.addChild(cabCandy4End);
		cabLogoEnd.addChild(cabBgEnd);
		cabLogoEnd.addChild(cabCatchEnd);
		cabLogoEnd.addChild(cabAEnd);
		cabLogoEnd.addChild(cabBiteEnd);
		cabLogoEnd.addChild(cabCandy1End);
		cabLogoEnd.addChild(cabCandy2End);
		cabLogoEnd.addChild(cabCandy3End);

		ahLogoEnd.anchor.set(0.5);
		ahLogoEnd.animationSpeed = 0.3;
		ahLogoEnd.loop = false;

		if (screenSize === 'desktop') {
			//log('Position Desktop EndFrame');
			cabLogoEnd.scale.set(0.42);
			cabLogoEnd.position.set(stageW / 3 - cabLogoEnd.width / 2 - 10, 26);
			yourScoreText.position.set(stageW / 3 - yourScoreText.width / 2, 168);
			endSubhead.position.set(stageW / 3 - endSubhead.width / 2, 284);
			endCtaHolder1.position.set(stageW / 3 , stageH / 2 + 180);
			endCtaHolder2.position.set( (stageW / 2 +  stageW / 5) + endCtaHolder2.width / 2, stageH / 2 + 180);
			ahLogoEnd.position.set(stageW - ahLogo.width / 2, 220);
		} else if ( screenSize === 'tablet' ) {
			//log('Position Tablet EndFrame');

			cabLogoEnd.scale.set(0.42);
			cabLogoEnd.position.set(stageW / 3 - cabLogoEnd.width / 2 - 10, stageH / 4 - cabLogoEnd.height / 2);

			yourScoreText.style.fontSize = '60px';
			yourScoreText.style.letterSpacing = 0.25;
			yourScoreText.position.set(stageW / 3 - yourScoreText.width / 2, stageH / 2 - yourScoreText.height );

			endSubhead.style.fontSize = '28px'
			endSubhead.position.set(stageW / 3 - endSubhead.width / 2, stageH / 2 + endSubhead.height );

			endCtaHolder1.scale.set(0.75);
			endCtaHolder2.scale.set(0.75);

			//endCtaHolder1.position.set(stageW / 3 - endCtaHolder1.width / 2 - 10, stageH / 2 + 180);
			//endCtaHolder2.position.set(stageW / 3 + endCtaHolder2.width / 2 + 10, stageH / 2 + 180);

			endCtaHolder1.position.set(stageW / 3 , stageH / 2 + 180);

			endCtaHolder2.position.set( (stageW / 2 +  stageW / 5) + endCtaHolder2.width / 2, stageH / 2 + 180);

			ahLogoEnd.scale.set(0.60);
			ahLogoEnd.position.set( stageW - ahLogoEnd.width / 2 + 40, stageH / 2 );

		} else if ( screenSize === 'mobile') {
			//log ('position mobile EndFrame');

			overlayEnd.width = stageW;
			overlayEnd.height = stageH;

			cabLogoEnd.scale.set(0.42);
			cabLogoEnd.position.set(stageW / 2 - cabLogoEnd.width / 2 - 20, 60);

			yourScoreText.style.fontSize = '40px';
			yourScoreText.style.letterSpacing = 0.25;
			yourScoreText.position.set(stageW / 2 - yourScoreText.width / 2, stageH / 2 - yourScoreText.height * 2 );

			endSubhead.style.fontSize = '28px'
			endSubhead.position.set(stageW / 2 - endSubhead.width / 2, stageH / 2 - endSubhead.height );

			endCtaHolder1.scale.set(0.55);
			endCtaHolder2.scale.set(0.55);
			endCtaHolder1.position.set(stageW / 2 - endCtaHolder1.width / 2 - 10, stageH / 2 + 60);
			endCtaHolder2.position.set(stageW / 2 + endCtaHolder2.width / 2 + 10, stageH / 2 + 60);

			ahLogoEnd.scale.set(0.60);

			ahLogoEnd.position.set( stageW / 2  , stageH - ahLogoEnd.height / 2 );



		}

		endFrame.addChild(overlayEnd);
		endFrame.addChild(cabLogoEnd);
		endFrame.addChild(endSubhead);
		endFrame.addChild(endCtaHolder1);
		endFrame.addChild(endCtaHolder2);
		endFrame.addChild(ahLogoEnd);
		endFrame.addChild(yourScoreText);

		buildStage();
	}

	function loadProgressHandler() {
		loadingText.setText( 'LOADING ' + Math.round(loader.progress) + '%');
	}

	function setUp() {
		//log('SETUP')
		t.to(loadingText, 0.3, {pixi:{alpha:0, y:'+=10'}, ease:Power3.easeOut, delay:0.5});
		// Filters
		mainBlur = new PIXI.filters.BlurFilter();
		mainBlur.blur = 10;
		mainBlur.quality = 4;

		//Textures
		logoTextures = [resources['logo00.png'].texture, resources['logo01.png'].texture, resources['logo02.png'].texture, resources['logo03.png'].texture, resources['logo04.png'].texture, resources['logo05.png'].texture, resources['logo06.png'].texture, resources['logo07.png'].texture, resources['logo08.png'].texture, resources['logo09.png'].texture, resources['logo10.png'].texture, resources['logo11.png'].texture, resources['logo12.png'].texture ];

		headTextures = [resources['ah_head_00.png'].texture, resources['ah_head_01.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_01.png'].texture, resources['ah_head_00.png'].texture];

		// Intro
		intro 		= new PIXI.Container({width: stageW, height: stageH});
		cabLogo 		= new PIXI.Container();
		ctaHolder 	= new PIXI.Container();
		ahLogo  		= new PIXI.extras.AnimatedSprite(logoTextures);
		cabCatch 		= new PIXI.Sprite(resources['cab_catch.png'].texture);
		cabA 			= new PIXI.Sprite(resources['cab_a.png'].texture);
		cabBite 		= new PIXI.Sprite(resources['cab_bite.png'].texture);
		cabBg 		= new PIXI.Sprite(resources['cab_bg.png'].texture);
		cabCandy1 	= new PIXI.Sprite(resources['cab_candy1.png'].texture);
		cabCandy2 	= new PIXI.Sprite(resources['cab_candy2.png'].texture);
		cabCandy3		= new PIXI.Sprite(resources['cab_candy3.png'].texture);
		cabCandy4 	= new PIXI.Sprite(resources['cab_candy4.png'].texture);
		ctaBg 		= new PIXI.Sprite(resources['cta_bg.png'].texture);
		ctaText 		= new PIXI.Text(' Play Now ');
		overlay 		= new PIXI.Sprite(resources['overlayBg_@2x.png'].texture);

		instructionText = new PIXI.Text(' Keep clicking to catch \n all the Airheads! ');

		ctaText.style 		= Text.ctaTextStyle;
		instructionText.style = Text.interfaceTextStyle;

		// Main Game
		main 				= new PIXI.Container();
		interfaceHolder 	= new PIXI.Container();

		// - interface
		// -- score
		scoreText 	= new PIXI.Text('00');
		scoreIcon 	= new PIXI.Sprite(resources['candy_00.png'].texture);
		scoreText.style = Text.interfaceTextStyle;

		// -- Timer
		timerSectors 	= 30;
		timerSectorLength = ((Math.PI / 180) * 360/ timerSectors) * 15;
		beginAngle 	= 0 / timerSectors * Math.PI * 2;

		timerText			= new PIXI.Text('00');
		timerBg 			= new PIXI.Graphics();
		timerIcon 			= new PIXI.Graphics();
		timerText.style 	= Text.interfaceTextStyle;

		timerBg.lineStyle(6, 0xFFFFFF, 1);
		timerIcon.lineStyle(6, 0xFF3300, 1);

		timerBg.arc(stageW - 80, stageH - 40, 10, (Math.PI / 180) * 0 , (Math.PI / 180) * 360, false);
		timerIcon.arc(stageW - 80, stageH - 40, 10, (Math.PI / 180) * 0 , (Math.PI / 180) * 180, false);

		// -- Hearts
		heartHolder = new PIXI.Container();
		heart1 		= new PIXI.Sprite(resources['heart.png'].texture);
		heart2 		= new PIXI.Sprite(resources['heart.png'].texture);
		heart3 		= new PIXI.Sprite(resources['heart.png'].texture);

		hitRect = new PIXI.Graphics();
		hitRect.beginFill(0xFF3300);
		hitRect.drawRect(0, 0, stageW, stageH);
		hitRect.endFill();
		hitRect.alpha = 0.0;
		hitRect.interactive = true;
		hitRect.buttonMode = true;
		hitRect.hitArea = new PIXI.Rectangle(0, 0, stageW, stageH);

		// - BackGround
		bgHolder 		= new PIXI.Container();

		/*sky_bg 		= new PIXI.extras.TilingSprite(resources['sky_bg_@2x.jpg'].texture, stageW, stageH);
		buildings 		= new PIXI.extras.TilingSprite(resources['buildings2_@2x.png'].texture, stageW, 490 / 2);
		trees 			= new PIXI.extras.TilingSprite(resources['trees2_@2x.png'].texture, stageW, 235 / 2);
		hedges 		= new PIXI.extras.TilingSprite(resources['hedge_@2x.png'].texture, stageW, stageH);
		street 		= new PIXI.extras.TilingSprite(resources['road2_@2x.png'].texture, stageW, 278 / 2);
		lightpoles 	= new PIXI.extras.TilingSprite(resources['lightpost_foreground_@2x.png'].texture, 3600 / 2, stageH);*/

		sky_bg 		= new PIXI.extras.TilingSprite(resources['sky_bg_@2x.jpg'].texture, stageW, stageH);
		buildings 		= new PIXI.extras.TilingSprite(resources['buildings2_@2x.png'].texture, stageW, stageH);
		trees 			= new PIXI.extras.TilingSprite(resources['trees2_@2x.png'].texture, stageW, stageH);
		hedges 		= new PIXI.extras.TilingSprite(resources['hedge_@2x.png'].texture, stageW, stageH);
		street 		= new PIXI.extras.TilingSprite(resources['road2_@2x.png'].texture, stageW, stageH);
		lightpoles 	= new PIXI.extras.TilingSprite(resources['lightpost_foreground_@2x.png'].texture, 3600 / 2, stageH);


		// - AIRHEAD
		airHead 		= new PIXI.Container();

		// -- Head
		head 			= new PIXI.extras.AnimatedSprite(headTextures);
		head.pivot.set(55, 178);
		head.position.set(0, 0);
		head.loop = false;
		head.animationSpeed = 0.6;

		// -- Body
		airBody 		= new PIXI.Container();
		torso 			= new PIXI.Sprite(resources['ah_body.png'].texture);
		leftLeg 		= new PIXI.Sprite(resources['ah_leftLeg.png'].texture);
		rightLeg 		= new PIXI.Sprite(resources['ah_rightLeg.png'].texture);
		rightArm 		= new PIXI.Sprite(resources['ah_rightArm.png'].texture);
		leftArm 		= new PIXI.Sprite(resources['ah_leftArm.png'].texture);

		ashleigh	    = new PIXI.Sprite(resources['ashleigh.png'].texture);

		rightArm.pivot.set(6, 4);
		rightArm.position.set(43-55+6, 181-178+4);
		rightLeg.pivot.set(22, 0);
		rightLeg.position.set(27-55+22, 210-178+0);
		leftLeg.pivot.set(8, 4);
		leftLeg.position.set(48-55+8, 207-178+4);
		torso.pivot.set(16, 6);
		torso.position.set(40-55+16, 175-178+6);
		leftArm.pivot.set(0, 6);
		leftArm.position.set(62-55+0, 180-178+6);

		ashleigh.pivot.set(0, 75);
		ashleigh.anchor.set(0.5);

		// - Candy
		candyHolder 	= new PIXI.Container();
		candy0 			= new PIXI.Sprite(resources['candy_00.png'].texture);
		candy1 			= new PIXI.Sprite(resources['candy_01.png'].texture);
		candy2 			= new PIXI.Sprite(resources['candy_02.png'].texture);
		candy3 			= new PIXI.Sprite(resources['candy_03.png'].texture);
		candy4 			= new PIXI.Sprite(resources['candy_04.png'].texture);
		candy5 			= new PIXI.Sprite(resources['candy_05.png'].texture);
		candy6 			= new PIXI.Sprite(resources['candy_06.png'].texture);

		// Endframe
		endFrame 		= new PIXI.Container();
		endCtaHolder1	= new PIXI.Container();
		endCtaHolder2	= new PIXI.Container();
		cabLogoEnd 		= new PIXI.Container();

		yourScoreText 	= new PIXI.Text('Your score: 0 ');
		endSubhead 	= new PIXI.Text(' Great job! ' );
		cabCatchEnd  	= new PIXI.Sprite(resources['cab_catch.png'].texture);
		cabAEnd 	 	= new PIXI.Sprite(resources['cab_a.png'].texture);
		cabBiteEnd   	= new PIXI.Sprite(resources['cab_bite.png'].texture);
		cabBgEnd 	 	= new PIXI.Sprite(resources['cab_bg.png'].texture);
		cabCandy1End 	= new PIXI.Sprite(resources['cab_candy1.png'].texture);
		cabCandy2End 	= new PIXI.Sprite(resources['cab_candy2.png'].texture);
		cabCandy3End	= new PIXI.Sprite(resources['cab_candy3.png'].texture);
		cabCandy4End 	= new PIXI.Sprite(resources['cab_candy4.png'].texture);
		endCtaBg1 		= new PIXI.Sprite(resources['cta_bg.png'].texture);
		endCtaBg2 		= new PIXI.Sprite(resources['cta_bg.png'].texture);
		endCtaText1 	= new PIXI.Text(' Play Again? ');
		endCtaText2 	= new PIXI.Text(' Find Near You ');
		ahLogoEnd 		= new PIXI.extras.AnimatedSprite(logoTextures);
		overlayEnd 	= new PIXI.Sprite(resources['endOverlay.png'].texture);

		yourScoreText.style 	= Text.yourScoreTextStyle;
		endSubhead.style 		= Text.subHeadTextStyle;
		endCtaText1.style 		= Text.ctaTextStyle;
		endCtaText2.style 		= Text.ctaTextStyle;

		setPosition();
	}

	loader.add([
		'buildings_@2x.png', 'hedge_@2x.png', 'lightpost_foreground_@2x.png', 'road_@2x.jpg', 'sky_bg_@2x.jpg', 'trees_@2x.png', 'overlayBg_@2x.png', 'ah_body.png', 'ah_head_00.png', 'ah_head_01.png', 'ah_head_02.png', 'ah_leftArm.png', 'ah_leftLeg.png', 'ah_pelvis.png', 'ah_rightArm.png', 'ah_rightLeg.png', 'candy_00.png', 'candy_01.png', 'candy_02.png', 'candy_03.png', 'candy_04.png', 'candy_05.png', 'candy_06.png', 'heart.png', 'cta_bg.png', 'logo00.png', 'logo01.png', 'logo02.png', 'logo03.png', 'logo04.png', 'logo05.png', 'logo06.png', 'logo07.png', 'logo08.png', 'logo09.png', 'logo10.png', 'logo11.png', 'logo12.png', 'cab_catch.png', 'cab_a.png', 'cab_bite.png', 'cab_bg.png', 'cab_candy1.png', 'cab_candy2.png', 'cab_candy3.png', 'cab_candy4.png', 'endOverlay.png', 'ashleigh.png', 'buildings2_@2x.png', 'road2_@2x.png', 'trees2_@2x.png', 'closeBtn.png'
	]).on('progress', loadProgressHandler).load(setUp);

	ticker.add( function(delta){
		handleTimer(delta);
		candyScroll(delta);
		handleAirHead(delta);
		bgScroll(delta);
	});

	function candyIntro(delta) {
		for ( var i = 0; i < candies.length; i++ ) {
			candies[i].x -= candySpeed;
			if (candies[i].x < 0 - candies[i].width) {
				candies[i].x = stageW + candies[i].width;
				candies[i].y = Utils.random(50, stageH - 100);
			}
		}
	}

	var speed = 20;
	var angle = 45;
	var dx, dy, ax, ay;
	var vx = 0;
	var vy = 0;
	var zx = 0, zy = 0;
	var easing = 1.0;
	var spring = 0.04;
	var friction = 0.85;
	var gravity = 2;
	var bodySpring = 2;
	var bodyFriction = 0.95;
	var flopRate =  2.5;  //4.625;
	var bodyFlopRate = 1.5;

	introTicker.add( function(delta){
		mousePos = Utils.getMousePosition();
		dx = (mousePos.x - airHead.x) * easing;
		dy = ((mousePos.y - 120 )- (airHead.y)) * easing;
		ax = dx * spring;
		ay = dy * spring;
		vx += ax;
		vy += ay;
		vx *= friction;
		vy *= friction;
		//airHead.x += vx;
		airHead.y += vy + 30;

		//head.rotation = (-dx / flopRate * (Math.PI / 180));
		rightLeg.rotation = (dx / 1.5 * (Math.PI / 180));
		leftLeg.rotation = (dx / 2.5 * (Math.PI / 180));
		leftArm.rotation = (dx / flopRate * (Math.PI / 180));
		rightArm.rotation = (dx / flopRate * (Math.PI / 180));
		airBody.rotation = (dx / 20.5 * (Math.PI / 180));

		//head.rotation = (-dy / flopRate * (Math.PI / 180));
		//log( 'ROTATION: ' + (dx * (Math.PI / 180)) );
		//head.rotation += ( Math.PI / 360 ) * vx;

		gx = (airHead.x - head.x) * easing;
		gy = (airHead.y - head.y) * easing;
		jx = gx * bodySpring;
		jy = gy * bodySpring;
		zx += jx;
		zy += jy;
		zx *= bodyFriction;
		zy *= bodyFriction;

		bgScroll();
		candyIntro(delta);
	});

	$(closeBtn).click( function() {
		log('CLOSE CLICK');

		if (introPlaying === true) {
			introTicker.stop();
		}

		if (playing === true) {
			ticker.stop();
			bgSound.stop();
			flapSound.stop();
		}

		t.to(game, 0.4, {height:0});
	});

}






































//