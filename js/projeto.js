/* global THREE*/
var scene, scene2, renderer, material, geometry, mesh, wireframe_flag = false; //basic
var camera, last_camera = camera, cameraLives, perspectivecamera, perspectivecamera2, orthogonalcamera, width=500, height=300, cameraRatio = (width/height); //cameras
var board, ship; //objects
var boardWidth = width-20, boardHeight = height-20; //Board
var sun, stars = [], sun_light_color = 0xffff99, stars_light_color = 0xffffff, sun_intensity = 1, stars_intensity = 0.3; //lights
var shadow_flag = "phong", last_shadow_flag = shadow_flag; //shadows
var ship_n_lives = 3, lost = false, won = false, gameover, pause, youwon;

var objects = [];
var lives = [];

var clock; //clock

/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------------BACKGROUND----------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function createBackground(scene) {
	var texture = new THREE.TextureLoader().load("background.jpg");
	var geometry = new THREE.SphereGeometry(500);
	var mesh = new THREE.MeshBasicMaterial();
	mesh.map = texture;
	var mesh = new THREE.Mesh(geometry,mesh);
	mesh.material.side = THREE.BackSide;
	mesh.material.map.wrapS = THREE.RepeatWrapping;
	mesh.material.map.wrapT = THREE.RepeatWrapping;
	mesh.material.map.repeat.set(10,12);
	scene.add(mesh);
	mesh.position.set(0,0,0);
}

/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------------MESSAGES------------------------------------------ */
/* ------------------------------------------------------------------------------------------- */
function createSignal(texture, scene) {
	var geometry = new THREE.CubeGeometry(width,0,height);
	var mesh = new THREE.MeshBasicMaterial();
	mesh.map = texture;
	var mesh = new THREE.Mesh(geometry,mesh);
	mesh.material.side = THREE.FrontSide;
	scene.add(mesh);
	mesh.position.set(0,40,0);
	mesh.visible = false;
	return mesh;
}

function createGameOver(scene) {
	var texture = new THREE.TextureLoader().load("gameover.png");
	gameover = createSignal(texture, scene);
}

function createYouWon(scene) {
	var texture = new THREE.TextureLoader().load("youwon.png");
	youwon = createSignal(texture, scene);
}

function createPause(scene) {
	var texture = new THREE.TextureLoader().load("pause.png");
	pause = createSignal(texture, scene);
}

function toggleMessage(message) {
	switch(message) {
		case "gameover":
			gameover.visible = !gameover.visible;
			break;
		case "pause":
			pause.visible = !pause.visible;
			break;
		case "youwon":
			youwon.visible = !youwon.visible;
			break;
	}
}
/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------AUXILIAR FUNCTIONS--------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------CALLBACK FUNCTIONS--------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function onResize() {
	'use strict';
	
	if(window.innerWidth>0 && window.innerHeight>0){
		
		renderer.setSize(window.innerWidth,window.innerHeight);
		
		//ORTOGONAL CAMERAS RESIZE
		var newAspectRatio = window.innerWidth/window.innerHeight;
		if (newAspectRatio > cameraRatio){
			orthogonalcamera.left = (height * newAspectRatio)/(-2);
			orthogonalcamera.right = (height * newAspectRatio)/2;
			orthogonalcamera.bottom = (height)/(-2);
			orthogonalcamera.top = (height)/2;
			
			cameraLives.left = (height * newAspectRatio)/(-6);
			cameraLives.right = (height * newAspectRatio)/6;
			cameraLives.bottom = (height)/(-6);
			cameraLives.top = (height)/6;
			
		}
		else{
			orthogonalcamera.left = (width)/(-2);  //para a camera ficar com a proporcao do campo de jogo em termos de largura
			orthogonalcamera.right = (width)/2;
			orthogonalcamera.bottom = (width/ newAspectRatio)/(-2);
			orthogonalcamera.top = (width/ newAspectRatio)/2;
			
			cameraLives.left = (width)/(-6);  //para a camera ficar com a proporcao do campo de jogo em termos de largura
			cameraLives.right = (width)/6;
			cameraLives.bottom = (width/ newAspectRatio)/(-6);
			cameraLives.top = (width/ newAspectRatio)/6;
		}
		orthogonalcamera.updateProjectionMatrix();		
		cameraLives.updateProjectionMatrix();		
		
		//PERSPECTIVE STATIC CAMERA RESIZE
		perspectivecamera.aspect = window.innerWidth /window.innerHeight;
		perspectivecamera.updateProjectionMatrix();
		
		//PERSPECTIVE CAMERA RESIZE
		ship.getCamera().aspect = window.innerWidth /window.innerHeight;
		ship.getCamera().updateProjectionMatrix();		
	}
}

function onKeyDown(e) {
	'use strict';
	
	if(clock.running) {
		switch(e.keyCode) {
			case 65: //A
			case 97: //a
				scene.traverse(function (node) {
					if (node instanceof SpaceObject) {
						node.toggleWireframe();
					}
				});
				wireframe_flag = !wireframe_flag;
				break;
			case 49: //1
				camera=orthogonalcamera;
				break;
			case 50: //2
				camera=perspectivecamera;
				break;
			case 51: //3
				camera=ship.getCamera();
				break;
			case 37: //left
				ship.accelerateLeft()
				break;
			case 39: //right
				ship.accelerateRight()
				break;
			case 66: //B
			case 98: //b
				objects.push(new Bullet(scene, ship.getPositionX(), ship.getPositionY(), ship.getPositionZ() - 25, wireframe_flag, shadow_flag));
				break;
			case 78: //N
			case 110: //n
				sun.toggleVisible();
				break;
			case 76: //L
			case 108: //l
				shadow_flag == "off" ? shadow_flag = last_shadow_flag : shadow_flag = "off";
				scene.traverse(function (node) {
					if (node instanceof SpaceObject) {
						node.changeShadow(shadow_flag);
					}
				});
				break;
			case 71: //G
			case 103: //g
				if(shadow_flag!="off") {
					shadow_flag == "gouraud" ? shadow_flag = "phong" : shadow_flag = "gouraud";
					last_shadow_flag = shadow_flag;
					scene.traverse(function (node) {
						if (node instanceof SpaceObject) {
							node.changeShadow(shadow_flag);
						}
					});
				}
				break;
			case 67: //C
			case 99: //c
				for(var i = 0; i<stars.length; i++) {
					stars[i].toggleVisible();
				}
				break;
			case 80: //P
			case 112: //p
				board.toggleVisible();
				break;
			case 72: //H
			case 104: //h
				ship.toggleLight();
				break;
			case 83: //S
			case 115: //s
				clock.stop();
				last_camera = camera;
				camera = orthogonalcamera;
				toggleMessage("pause");
				break;
		}
	}
	else if(lost || won) {
		switch(e.keyCode) {
			case 82: //R
			case 114: //r
				reset();
				gameover.visible = false;
				youwon.visible = false;
				lost = false;
				won = false;
				clock.start();
				break;
		}
	}
	else {
		switch(e.keyCode) {
			case 83: //S
			case 115: //s
				clock.start();
				camera = last_camera;
				toggleMessage("pause");
				break;
		}
	}
}


function onKeyUp(e) {
	'use strict';
	
	switch(e.keyCode) {
		case 37: //left
			ship.stopAccelerateLeft();
			break;
		case 39: //right
			ship.stopAccelerateRight();
			break;
	}
}

function game_over() {
	lost = true;
	clock.stop();
	last_camera = camera;
	camera = orthogonalcamera;
	gameover.visible = true;
}

function wonGame() {
	won = true;
	clock.stop();
	last_camera = camera;
	camera = orthogonalcamera;
	youwon.visible = true;
}

/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------SCENE & CAMERAS CREATION--------------------------------- */
/* ------------------------------------------------------------------------------------------- */
function createRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.autoClear = false;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}


function decorateScene() {
	//Creating Objects//
	ship = new SpaceShip(scene, 0, 0, 100, shadow_flag, wireframe_flag, ship_n_lives);
	objects.push(new Alien(scene, 150, 0, -50, shadow_flag, wireframe_flag));
	objects.push(new Alien(scene, 50, 0, -50, shadow_flag, wireframe_flag));
	objects.push(new Alien(scene, -50, 0, -50, shadow_flag, wireframe_flag));
	objects.push(new Alien(scene, -150, 0, -50, shadow_flag, wireframe_flag));
	objects.push(new Alien(scene, 150, 0, -100, shadow_flag, wireframe_flag));
	objects.push(new Alien(scene, 50, 0, -100, shadow_flag, wireframe_flag));
	objects.push(new Alien(scene, -50, 0, -100, shadow_flag, wireframe_flag));
	objects.push(new Alien(scene, -150, 0, -100, shadow_flag, wireframe_flag));
}

function createScene() {
	'use strict';
	
	scene = new THREE.Scene();
	//scene.add(new THREE.AxisHelper(10));
	
	
	//Background
	createBackground(scene);
	createPause(scene);
	createYouWon(scene);
	createGameOver(scene);
	
	//Board
	board = new Board(scene,0,-20,0,boardWidth,boardHeight,shadow_flag, wireframe_flag);
	
	//Lives
	lives.push(new SpaceShip(scene, -50, 0, 1000, shadow_flag, wireframe_flag, ship_n_lives));
	lives.push(new SpaceShip(scene, 0, 0, 1000, shadow_flag, wireframe_flag, ship_n_lives));
	lives.push(new SpaceShip(scene, 50, 0, 1000, shadow_flag, wireframe_flag, ship_n_lives));
	
	decorateScene();
}

function createCameras() {
	'use strict';
	
	
	//FIRST CAMERA - ORTOGONAL//
	var aspectRatio = window.innerWidth/window.innerHeight;
	if(aspectRatio > cameraRatio) {
		orthogonalcamera = new THREE.OrthographicCamera( height*aspectRatio / (-2), height*aspectRatio/ (2), height / 2, height / (-2), 1, 1000);
		cameraLives = new THREE.OrthographicCamera( height*aspectRatio / (-6), height*aspectRatio/ (6), height / 6, height / (-6), 1, 1000);
	}
	else {
		orthogonalcamera = new THREE.OrthographicCamera( width / (-2), width / (2), (width/aspectRatio) / 2, (width/aspectRatio) / (-2), 1, 1000);
		cameraLives = new THREE.OrthographicCamera( width / (-6), width / (6), (width/aspectRatio) / 6, (width/aspectRatio) / (-6), 1, 1000);
	}
	orthogonalcamera.position.x = 0;
	orthogonalcamera.position.y = 100;
	orthogonalcamera.position.z = 0;
	orthogonalcamera.lookAt(scene.position);	
	
	camera=orthogonalcamera; //defining camera as orthogonal
	
	//SECOND CAMERA - PERSPECTIVE & STATIC//
	perspectivecamera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
	perspectivecamera.position.x = 0;
	perspectivecamera.position.y = 220;
	perspectivecamera.position.z = 150;
	perspectivecamera.lookAt(scene.position);
	
	//THIRD CAMERA - PERPECTIVE & MOVEL//
	ship.addCamera(new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000));
	
	//LIVES CAMERA
	cameraLives.position.x = 0;
	cameraLives.position.y = 100;
	cameraLives.position.z = 1000;
	cameraLives.lookAt(lives[1].position);	
}

function createLights() {
	'use strict';
	
	//SUN
	sun = new DirectionalStar(scene, sun_light_color, sun_intensity, 0, 150, boardHeight/2);
	
	//STARS
	stars.push(new PointStar(scene, stars_light_color, stars_intensity, -boardWidth/4, 20, -boardHeight/4));
	stars.push(new PointStar(scene, stars_light_color, stars_intensity, 0, 20, -boardHeight/4));
	stars.push(new PointStar(scene, stars_light_color, stars_intensity, boardWidth/4, 20, -boardHeight/4));
	stars.push(new PointStar(scene, stars_light_color, stars_intensity, boardWidth/4, 20, boardHeight/4));
	stars.push(new PointStar(scene, stars_light_color, stars_intensity, -boardWidth/4, 20, boardHeight/4));
	stars.push(new PointStar(scene, stars_light_color, stars_intensity, 0, 20, boardHeight/4));
	stars.push(new PointStar(scene, stars_light_color, stars_intensity, boardWidth/4, 20, boardHeight/4));

	//SHIP SPOTLIGHT
	ship.addLight(new THREE.SpotLight(0xeeeeee, 3, boardHeight, Math.PI/3, 0.3, 2));
}

/* ------------------------------------------------------------------------------------------- */
/* -----------------------------------AUXILIAR FUNCTIONS-------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function shipLostLife() {
	for(i=lives.length-1; i>=0; i--) {
		if(lives[i].visible == true) {
			lives[i].visible = false;
			break;
		}
	}
}

function reset() {
	//Clean Objects
	for(i=0; i < objects.length; i++) {
		objects[i].remove();
	}
	objects = [];
	ship.remove();
	
	//Lives reassigned
	for(i=0; i < lives.length; i++) {
		lives[i].visible = true;
	}
	
	//Create Objects Again
	decorateScene();
	ship.addCamera(new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000));
	ship.addLight(new THREE.SpotLight(0xeeeeee, 3, boardHeight, Math.PI/3, 0.3, 2));
	
	//Chose Camera
	camera = orthogonalcamera;
}

/* ------------------------------------------------------------------------------------------- */
/* -----------------------------------MAIN FUNCTIONS ----------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function render() {
	'use strict';
	renderer.clear();
	renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
	renderer.render(scene, camera);
	renderer.setViewport(0,0,window.innerWidth/8,window.innerHeight/8);
	renderer.render(scene, cameraLives);
}

function animate() {
	'use strict';
	var i,j;
	var deltatime = 0;
	var aliens_flag = false;
	
	if(clock.running) deltatime = clock.getDelta();
	
	//CHECKING COLLISIONS//
	for(i=0; i < objects.length; i++) {
		for(j=i+1; j < objects.length; j++) {
			if(objects[i].getRadius()+objects[j].getRadius() > distanceVector(objects[i].getPosition(),objects[j].getPosition())) {
				if(objects[i] instanceof Alien && objects[j] instanceof Alien) { //Aliens with Aliens
					objects[i].colided();
					objects[j].colided();
				}
				else if((objects[i] instanceof Bullet && objects[j] instanceof Alien)|| (objects[j] instanceof Bullet && objects[i] instanceof Alien)) { //Aliens with Bullets
					objects[i].remove();
					objects[j].remove();
					objects.splice(i,1);
					j--;
					objects.splice(j,1);
					break;
				}
			}
		}
		if(objects[i].getRadius()+ship.getRadius() > distanceVector(objects[i].getPosition(),ship.getPosition())) {
			objects[i].remove();
			objects.splice(i,1);
			if(ship.crash() == "dead") game_over();
			shipLostLife();
			break;
		}
	}
	
	//UPDATING OBJECTS POSITIONS//
	ship.update(deltatime);
	for(i = 0; i < objects.length; i++) {
		if(objects[i].update(deltatime)=="removed") objects.splice(i,1);
		if(objects[i] instanceof Alien) aliens_flag = true;
	}
	
	if(!aliens_flag) wonGame();
	
	render();

	requestAnimationFrame(animate);
}

function init() {
	'use strict';
	
	createRenderer();

	clock = new THREE.Clock;
	clock.start();
	
	createScene();
	createCameras();
	createLights();
	
	render();
	
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}
