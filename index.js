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
	log('init');

	var Utils = {};
	var Game = {};
	var Sounds = {};
	var Sprites = {};
	var Text = {};

	Text = (function() {
		var interfaceTextStyle = new PIXI.TextStyle({
			fontFamily: 'uniform_roundedbold',
			fontSize: '28px',
			letterSpacing: -2,
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
			interfaceTextStyle : interfaceTextStyle,
			ctaTextStyle : ctaTextStyle,
			subHeadTextStyle : subHeadTextStyle,
			yourScoreTextStyle : yourScoreTextStyle,
		}

	}());

	Interface = (function() {

		var loadingText, scoreText, timerText, scoreIcon, timerIcon, timerBg;
		var interfaceHolder, heartHolder, timerHolder, scoreHolder;
		var timerSectors, timerSectorLength, beginAngle;
		var heart1, heart2, heart3;

		return {
			scoreText,
			timerText,
			scoreIcon,
			timerIcon,
			timerBg,
			interfaceHolder,
			heartHolder,
			timerHolder,
			scoreHolder,
			timerSectors,
			timerSectorLength,
			beginAngle,
			loadingText,
			heart1,
			heart2,
			heart3
		}
	}());


	Intro = (function() {
		var ctaBg, ctaText, ctaHolder, overlay, ahLogo, logoTextures, instructionText, cabLogo, cabCatch, cabA, cabBite, cabBg, cabCandy1, cabCandy2, cabCandy3, cabCandy4;

		return {
			ctaBg,
			ctaText,
			ctaHolder,
			overlay : overlay,
			ahLogo,
			logoTextures,
			instructionText,
			cabLogo,
			cabCatch,
			cabA,
			cabBite,
			cabBg,
			cabCandy1,
			cabCandy2,
			cabCandy3,
			cabCandy4
		}


	}());

	Main = (function() {
		var bgHolder, candyHolder, fgHolder, airheadHolder, hitRect;
		var sky_bg, buildings, trees, hedges, street, lightpoles;
		var candy0, candy1, candy2, candy3, candy4, candy5, candy6;
		var airHead, airBody, leftArm, rightArm, leftLeg, rightLeg, torso, head, pelvis, headTextures;

		return {
			bgHolder,
			candyHolder,
			fgHolder,
			airheadHolder,
			hitRect,
			sky_bg,
			buildings,
			trees,
			hedges,
			street,
			lightpoles,
			candy0,
			candy1,
			candy2,
			candy3,
			candy4,
			candy5,
			candy6,
			airHead,
			airBody,
			leftArm,
			rightArm,
			leftLeg,
			rightLeg,
			torso,
			head,
			pelvis,
			headTextures
		}
	}());

	EndFrame = (function() {
		var endFrame, overlayEnd, endCtaBg1, endCtaBg2, endCtaHolder1, endCtaHolder2, endCtaText1, endCtaText2, ahLogoEnd, yourScoreText, endSubhead;
		var cabLogoEnd, cabCatchEnd, cabAEnd, cabBiteEnd, cabBgEnd, cabCandy1End, cabCandy2End, cabCandy3End, cabCandy4End;

		return {
			endFrame,
			overlayEnd,
			endCtaBg1,
			endCtaBg2,
			endCtaHolder1,
			endCtaHolder2,
			endCtaText1,
			endCtaText2,
			ahLogoEnd,
			yourScoreText,
			endSubhead,
			cabLogoEnd,
			cabCatchEnd,
			cabAEnd,
			cabBiteEnd,
			cabBgEnd,
			cabCandy1End,
			cabCandy2End,
			cabCandy3End,
			cabCandy4End
		}
	}());

	Sounds = (function() {
		var bgSound, flapSound, buttonSound, eatSound, loseSound, winSound, overSound;
		return {
			bgSound : bgSound,
			flapSound : flapSound,
			buttonSound : buttonSound,
			eatSound : eatSound,
			loseSound : loseSound,
			winSound : winSound,
			overSound : overSound
		}
	}());

	Game = (function() {
		var app,
		Application = PIXI.Application,
		loader = PIXI.loader,
		resources = PIXI.loader.resources,
		Sprite = PIXI.Sprite,
		ticker = new PIXI.ticker.Ticker(),
		introTicker = new PIXI.ticker.Ticker(),
		gameTime = 30,
		elapsedTime = 0,
		timerSectors = 30,
		timerSectorLength = Math.PI * 2 / timerSectors,
		beginAngle = 0 / timerSectors * Math.PI * 2,
		lives = 3,
		mainBlurAmount = 10,
		topHits = 0,
		bottomHits = 0,
		score = 0,
		flapBoost = 0.0,
		sinkRate = 4.0,
		playing = false,
		_width = window.innerWidth,
		_height = window.innerHeight;
		return {
			Application : Application,
			loader : loader,
			resources : resources,
			Sprite : Sprite,
			ticker : ticker,
			introTicker : introTicker,
			gameTime : gameTime,
			elapsedTime : elapsedTime,
			timerSectors : timerSectors,
			timerSectorLength : timerSectorLength,
			beginAngle : beginAngle,
			lives : lives,
			mainBlurAmount : mainBlurAmount,
			topHits : topHits,
			bottomHits : bottomHits,
			score : score,
			flapBoost : flapBoost,
			sinkRate : sinkRate,
			_width : _width,
			_height : _height
		}
	}());

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
			CXA = Math.abs(vx);
			CYA = Math.abs(vy);
			CHW = combinedHalfWidths;
			CHH = combinedHalfHeights;
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


	var game = $('<div>', {id:'game'}).appendTo('body');

	app = new Game.Application({});
	app.renderer.backgroundColor = 0x0040A3;

	app.renderer.view.width = 1280;
	app.renderer.view.height = 500;

	$(app.view).appendTo(game);

	var stageW = app.renderer.view.width;
	var stageH = app.renderer.view.height;

	Interface.loadingText = new PIXI.Text('LOADING      ');
	Interface.loadingText.style = {fill: 'WHITE', font:'20px uniform_roundedbold'};
	Interface.loadingText.position.set(stageW / 2 - Interface.loadingText.width / 2, stageH / 2);
	app.stage.addChild(Interface.loadingText);

	function buildStage() {
		log('BUILD STAGE');


		//Intro.intro.addChild(Intro.overlay);
		Intro.intro.addChild(Intro.cabLogo);

		//app.stage.addChild(Intro.overlay);



	}


	function setPosition() {
		log('SET POSITION');


		Intro.intro.addChild(Intro.overlay);
		Intro.overlay.anchor.set(0.0);

		Intro.intro.position.set(0, 0);
		log(Intro.overlay.width);
		log('HELP '  +  stageW);

		app.stage.addChild(Intro.intro);

		//Intro.cabLogo.position.set();
		//Intro.ctaHolder.position.set();
		//Intro.ahLogo.position.set();
		//Intro.instructionText.position.set();

		// Main

		// EndFrame

		//buildStage();
	}

	function loadProgressHandler() {
		Interface.loadingText.setText( 'LOADING ' + Math.round(Game.loader.progress) + '%');
	}

	function setUp() {
		log('SETUP')

		//Textures
		Sprites.logoTextures = [Game.resources['logo00.png'].texture, Game.resources['logo01.png'].texture, Game.resources['logo02.png'].texture, Game.resources['logo03.png'].texture, Game.resources['logo04.png'].texture, Game.resources['logo05.png'].texture, Game.resources['logo06.png'].texture, Game.resources['logo07.png'].texture, Game.resources['logo08.png'].texture, Game.resources['logo09.png'].texture, Game.resources['logo10.png'].texture, Game.resources['logo11.png'].texture, Game.resources['logo12.png'].texture ];

		Sprites.headTextures = [Game.resources['ah_head_00.png'].texture, Game.resources['ah_head_01.png'].texture, Game.resources['ah_head_02.png'].texture, Game.resources['ah_head_02.png'].texture, Game.resources['ah_head_02.png'].texture, Game.resources['ah_head_01.png'].texture, Game.resources['ah_head_00.png'].texture];

		// Intro
		Intro.intro 		= new PIXI.Container();
		Intro.cabLogo 		= new PIXI.Container();
		Intro.ctaHolder 	= new PIXI.Container();
		Intro.ahLogo  		= new PIXI.extras.AnimatedSprite(Sprites.logoTextures);
		Intro.cabCatch 		= new PIXI.Sprite(Game.resources['cab_catch.png'].texture);
		Intro.cabA 			= new PIXI.Sprite(Game.resources['cab_a.png'].texture);
		Intro.cabBite 		= new PIXI.Sprite(Game.resources['cab_bite.png'].texture);
		Intro.cabBg 		= new PIXI.Sprite(Game.resources['cab_bg.png'].texture);
		Intro.cabCandy1 	= new PIXI.Sprite(Game.resources['cab_candy1.png'].texture);
		Intro.cabCandy2 	= new PIXI.Sprite(Game.resources['cab_candy2.png'].texture);
		Intro.cabCandy3		= new PIXI.Sprite(Game.resources['cab_candy3.png'].texture);
		Intro.cabCandy4 	= new PIXI.Sprite(Game.resources['cab_candy4.png'].texture);
		Intro.ctaBg 		= new PIXI.Sprite(Game.resources['cta_bg.png'].texture);
		Intro.ctaText 		= new PIXI.Text(' Play Now ');
		Intro.overlay 		= new PIXI.Sprite(Game.resources['introOverlay.png'].texture);
		Intro.instructionText = new PIXI.Text(' Keep clicking to catch \n all the Airheads! ');

		Intro.ctaText.style 		= Text.ctaTextStyle;
		Intro.instructionText.style = Text.interfaceTextStyle;

		// Main Game
		Main.main 				= new PIXI.Container();

		// - interface
		// -- score
		Interface.scoreText 	= new PIXI.Text();
		Interface.scoreIcon 	= new PIXI.Sprite(Game.resources['candy_00.png'].texture);
		Interface.scoreText.style = Text.interfaceTextStyle;

		// -- Timer
		Interface.timerSectors 	= 30;
		Interface.timerSectorLength = ((Math.PI / 180) * 360/ Interface.timerSectors) * 15;
		Interface.beginAngle 	= 0 / Interface.timerSectors * Math.PI * 2;

		Interface.timerText			= new PIXI.Text('00');
		Interface.timerBg 			= new PIXI.Graphics();
		Interface.timerIcon 		= new PIXI.Graphics();
		Interface.timerText.style 	= Text.interfaceTextStyle;

		// -- Hearts
		Interface.heartHolder 	= new PIXI.Container();
		Interface.heart1 		= new PIXI.Sprite(Game.resources['heart.png'].texture);
		Interface.heart2 		= new PIXI.Sprite(Game.resources['heart.png'].texture);
		Interface.heart3 		= new PIXI.Sprite(Game.resources['heart.png'].texture);

		Main.hitRect = new PIXI.Graphics();
		Main.hitRect.beginFill(0xFF3300);
		Main.hitRect.drawRect(0, 0, stageW, stageH);
		Main.hitRect.endFill();
		Main.hitRect.alpha = 0.0;
		Main.hitRect.interactive = true;
		Main.hitRect.buttonMode = true;
		Main.hitRect.hitArea = new PIXI.Rectangle(0, 0, stageW, stageH);

		// - BackGround
		Main.bgHolder 		= new PIXI.Container();
		Main.sky_bg 		= new PIXI.extras.TilingSprite(Game.resources['sky_bg_@2x.jpg'].texture, stageW, stageH);
		Main.buildings 		= new PIXI.extras.TilingSprite(Game.resources['buildings_@2x.png'].texture, stageW, 490 / 2);
		Main.trees 			= new PIXI.extras.TilingSprite(Game.resources['trees_@2x.png'].texture, stageW, 235 / 2);
		Main.hedges 		= new PIXI.extras.TilingSprite(Game.resources['hedge_@2x.png'].texture, stageW, stageH);
		Main.street 		= new PIXI.extras.TilingSprite(Game.resources['road_@2x.jpg'].texture, stageW, 278 / 2);
		Main.lightpoles 	= new PIXI.extras.TilingSprite(Game.resources['lightpost_foreground_@2x.png'].texture, 3600 / 2, stageH);

		// - AIRHEAD
		Main.airHead 		= new PIXI.Container();

		// -- Head
		Main.head 			= new PIXI.extras.AnimatedSprite(Sprites.headTextures);
		Main.head.pivot.set(55, 178);
		Main.head.position.set(0, 0);
		Main.head.loop = false;
		Main.head.animationSpeed = 0.6;

		// -- Body
		Main.airBody 		= new PIXI.Container();
		Main.torso 			= new PIXI.Sprite(Game.resources['ah_body.png'].texture);
		Main.leftLeg 		= new PIXI.Sprite(Game.resources['ah_leftLeg.png'].texture);
		Main.rightLeg 		= new PIXI.Sprite(Game.resources['ah_rightLeg.png'].texture);
		Main.rightArm 		= new PIXI.Sprite(Game.resources['ah_rightArm.png'].texture);
		Main.leftArm 		= new PIXI.Sprite(Game.resources['ah_leftArm.png'].texture);

		Main.rightArm.pivot.set(6, 4);
		Main.rightArm.position.set(43-55+6, 181-178+4);
		Main.rightLeg.pivot.set(22, 0);
		Main.rightLeg.position.set(27-55+22, 210-178+0);
		Main.leftLeg.pivot.set(8, 4);
		Main.leftLeg.position.set(48-55+8, 207-178+4);
		Main.torso.pivot.set(16, 6);
		Main.torso.position.set(40-55+16, 175-178+6);
		Main.leftArm.pivot.set(0, 6);
		Main.leftArm.position.set(62-55+0, 180-178+6);

		// - Candy
		Main.candyHolder 		= new PIXI.Container();
		Main.candy0 			= new PIXI.Sprite(Game.resources['candy_00.png'].texture);
		Main.candy1 			= new PIXI.Sprite(Game.resources['candy_01.png'].texture);
		Main.candy2 			= new PIXI.Sprite(Game.resources['candy_02.png'].texture);
		Main.candy3 			= new PIXI.Sprite(Game.resources['candy_03.png'].texture);
		Main.candy4 			= new PIXI.Sprite(Game.resources['candy_04.png'].texture);
		Main.candy5 			= new PIXI.Sprite(Game.resources['candy_05.png'].texture);
		Main.candy6 			= new PIXI.Sprite(Game.resources['candy_06.png'].texture);

		// Endframe
		EndFrame.endFrame 		= new PIXI.Container();
		EndFrame.yourScoreText 	= new PIXI.Text('Your score: 0');
		EndFrame.endSubhead 	= new PIXI.Text(' Great job! ' );
		EndFrame.cabCatchEnd  	= new PIXI.Sprite(Game.resources['cab_catch.png'].texture);
		EndFrame.cabAEnd 	 	= new PIXI.Sprite(Game.resources['cab_a.png'].texture);
		EndFrame.cabBiteEnd   	= new PIXI.Sprite(Game.resources['cab_bite.png'].texture);
		EndFrame.cabBgEnd 	 	= new PIXI.Sprite(Game.resources['cab_bg.png'].texture);
		EndFrame.cabCandy1End 	= new PIXI.Sprite(Game.resources['cab_candy1.png'].texture);
		EndFrame.cabCandy2End 	= new PIXI.Sprite(Game.resources['cab_candy2.png'].texture);
		EndFrame.cabCandy3End	= new PIXI.Sprite(Game.resources['cab_candy3.png'].texture);
		EndFrame.cabCandy4End 	= new PIXI.Sprite(Game.resources['cab_candy4.png'].texture);
		EndFrame.endCtaBg1 		= new PIXI.Sprite(Game.resources['cta_bg.png'].texture);
		EndFrame.endCtaBg2 		= new PIXI.Sprite(Game.resources['cta_bg.png'].texture);
		EndFrame.endCtaText1 	= new PIXI.Text(' Play Again? ');
		EndFrame.endCtaText2 	= new PIXI.Text(' Find Near You ');
		EndFrame.ahLogoEnd 		= new PIXI.extras.AnimatedSprite(Sprites.logoTextures);
		EndFrame.overlayEnd 	= new PIXI.Sprite(Game.resources['endOverlay.png'].texture);

		EndFrame.yourScoreText.style 	= Text.yourScoreTextStyle;
		EndFrame.endSubhead.style 		= Text.subHeadTextStyle;
		EndFrame.endCtaText1.style 		= Text.ctaTextStyle;
		EndFrame.endCtaText2.style 		= Text.ctaTextStyle;

		setPosition();
	}

	Game.loader.add([
		'buildings_@2x.png', 'hedge_@2x.png', 'lightpost_foreground_@2x.png', 'road_@2x.jpg', 'sky_bg_@2x.jpg', 'trees_@2x.png', 'introOverlay.png', 'ah_body.png', 'ah_head_00.png', 'ah_head_01.png', 'ah_head_02.png', 'ah_leftArm.png', 'ah_leftLeg.png', 'ah_pelvis.png', 'ah_rightArm.png', 'ah_rightLeg.png', 'candy_00.png', 'candy_01.png', 'candy_02.png', 'candy_03.png', 'candy_04.png', 'candy_05.png', 'candy_06.png', 'heart.png', 'cta_bg.png', 'logo00.png', 'logo01.png', 'logo02.png', 'logo03.png', 'logo04.png', 'logo05.png', 'logo06.png', 'logo07.png', 'logo08.png', 'logo09.png', 'logo10.png', 'logo11.png', 'logo12.png', 'cab_catch.png', 'cab_a.png', 'cab_bite.png', 'cab_bg.png', 'cab_candy1.png', 'cab_candy2.png', 'cab_candy3.png', 'cab_candy4.png', 'endOverlay.png',
	]).on('progress', loadProgressHandler).load(setUp);







	log(Utils.random(21, 500));
	log(Game._width);
	log(Game.sinkRate);
	log(Main);




}










































//