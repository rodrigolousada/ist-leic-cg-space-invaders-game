/* global THREE*/

var camera, perspectivecamera, ortogonalcamera, scene, renderer, material, geometry, mesh, board, alien, ship;
var oldTime = 0;
var boardWidth = 1300, boardHeight = 900, cameraRatio = (boardWidth/boardHeight);
const ACCELERATIONCONST=100 , FRICTIONCOEF = (-0,5);

var clock, newTime, delta, speed=0, acceleration=0, direction = 0, caughtleft=0, caughtright=0;

/* ------------------------------------------------------------------------------------------- */
/* ------------------------------------OBJECTS FUNCTIONS-------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function addShipBody(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CubeGeometry(60, 2, 20);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	
	obj.add(mesh);
}

function addShipLeg(obj, x, y, z) {
	'use strict';
	
	geometry = new THREE.CubeGeometry(2, 6, 2);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y - 3, z);
	obj.add(mesh);
}

function createShip(x, y, z) {
	'use strict';
	
	ship = new THREE.Object3D();
	/*ship.userData { moving: true, step:0 };*/
	
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	
	addShipBody(ship, 0, 0, 0);
	addShipLeg(ship, -25, -1, -8);
	addShipLeg(ship, -25, -1, 8);
	addShipLeg(ship, 25, -1, 8);
	addShipLeg(ship, 25, -1, -8);
	
	ship.position.set(x,y,z);
	
	scene.add(ship);
}

function createAlien(x, y, z) {
	'use strict';
	
	alien = new THREE.Object3D();
	alien.userData = { jumping: true, step:0 };
	
	material = new THREE.MeshBasicMaterial({ color: 0xfffffff, wireframe: true })
	geometry = new THREE.SphereGeometry(4, 10, 10);
	mesh = new THREE.Mesh(geometry, material);
	
	alien.add(mesh);
	alien.position.set(x, y, z);
	
	scene.add(alien);
}


function createBoard(width, height) {
	'use strict';
	
	board = new THREE.Object3D();
	
	material = new THREE.MeshBasicMaterial({color: 0x006600, wireframe: true })
	geometry = new THREE.CubeGeometry(width-10,2,height-10);
	mesh = new THREE.Mesh(geometry, material);
	
	board.add(mesh);
	board.position.set(0, -100, 0);
	
	scene.add(board);
}

/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------ANIMATION FUNCTIONS-------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function animate() {
	'use strict';
	
	var deltatime = clock.getDelta();
	
	if (alien.userData.jumping) {
		alien.userData.step += deltatime;
		alien.position.y = Math.abs(30 * (Math.sin(alien.userData.step)));
		alien.position.z = 15 * (Math.cos(alien.userData.step));
	}
	
	speed+=(1/2)*acceleration*deltatime;
	ship.position.x += speed*deltatime;
	
	//if(acceleration=0 || acceleration);//acabar
	
	/*if(ship.position.x<=(boardWidth/-(2)) && caughtleft==0) {
		caughtleft++;
		speed=0;
		accelaration=0;
		ship.position.x+=5;
	}
	else if(!(ship.position.x<=(boardWidth/-(2))) && !(caughtleft==0)) caughtleft=0;
	else if(ship.position.x>=(boardWidth/(2)) && caughtright==0) {
		caughtright++;
		speed=0;
		accelaration=0;
		ship.position.x-=5;
	}
	else if(!(ship.position.x>=(boardWidth/(2))) && !(caughtright==0)) caughtright=0;*/
	
	render();

	requestAnimationFrame(animate);
}

function onResize() {
	'use strict';
	
	if(window.innerWidth>0 && window.innerHeight>0){
		var newAspectRatio = window.innerWidth/window.innerHeight;
		console.log(newAspectRatio);
		renderer.setSize(window.innerWidth,window.innerHeight);
		if (newAspectRatio > cameraRatio){
			camera.left = (boardHeight * newAspectRatio)/(-2);
			camera.right = (boardHeight * newAspectRatio)/2;
			camera.bottom = (boardHeight)/(-2);
			camera.top = (boardHeight)/2;
		}
		else{
			camera.left = (boardWidth)/(-2);  //para a camera ficar com a proporcao do campo de jogo em termos de largura
			camera.right = (boardWidth)/2;
			camera.bottom = (boardWidth/ newAspectRatio)/(-2);
			camera.top = (boardWidth/ newAspectRatio)/2;
		}
		camera.updateProjectionMatrix();
	}
}
	
	/*if(window.innerHeight > 0 && window.innerWidth > 0) {
		var newCameraPorporcion = window.innerHeight / window.innerWidth;
		renderer.setSize(window.innerWidth, window.innerHeight);
		if(newBoardPorporcion > boardPorporcion) {
			camera.top = (boardWidth * newCameraPorporcion) / 2;
			camera.bottom = (boardWidth * newCameraPorporcion) / (-2);
			camera.left = (boardWidth) / (-2);
			camera.right = (boardWith) / 2;
		}
		else if (newCameraPorporcion < boardPorporcion) {
			camera.top = (boardWidth * cameraRatio) / 2;
			camera.bottom = (boardWidth * cameraRatio) / (-2);
			camera.left = ( boardWidth * cameraRatio / newCameraPorporcion) / (-2);
			camera.right = ( boardWidth * cameraRatio / newCameraPorporcion) / 2;
		}
		camera.updateProjectionMatrix();
	}*/

function onKeyDown(e) {
	'use strict';
	
	switch(e.keyCode) {
		case 65: //A
		case 97: //a
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
		case 83: //S
		case 115: //s
			alien.userData.jumping = !alien.userData.jumping;
			if(clock.running==true) clock.stop();
			else clock.start();
			break;
		case 86: //V
		case 118: //v
			if(camera==perspectivecamera) {
				camera=ortogonalcamera;
				camera.lookAt(scene.position);
			}
			else {
				camera=perspectivecamera;
				camera.lookAt(scene.position);
			}
			break;
		case 37: //left
			acceleration=(-ACCELERATIONCONST);
			break;
		case 39: //right
			acceleration=ACCELERATIONCONST;
			break;
	}
}


function onKeyUp(e) {
	'use strict';
	
	switch(e.keyCode) {
		case 37: //left
			acceleration = 0;
			break;
		case 39: //right
			acceleration = 0;
			break;
	}
}


/* ------------------------------------------------------------------------------------------- */
/* -----------------------------------MAIN FUNCTIONS ----------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function render() {
	'use strict';
	
	renderer.render(scene, camera);
}

function createScene() {
	'use strict';
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
	
	createBoard(boardWidth, boardHeight);
	createShip(0, 0, 0);
	createAlien(0, 0, 15);
	
}

function createCameras() {
	'use strict';
	perspectivecamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	perspectivecamera.position.x = 0;
	perspectivecamera.position.y = 50;
	perspectivecamera.position.z = 50;
	perspectivecamera.lookAt(scene.position);
	
	
	var aspectRatio = window.innerWidth/window.innerHeight;
	if(aspectRatio > cameraRatio) {
		ortogonalcamera = new THREE.OrthographicCamera( boardHeight*aspectRatio / (-2), boardHeight*aspectRatio/ (2), boardHeight / 2, boardHeight / (-2), 1, 1000);
	}
	else {
		ortogonalcamera = new THREE.OrthographicCamera( boardWidth / (-2), boardWidth / (2), (boardWidth/aspectRatio) / 2, (boardWidth/aspectRatio) / (-2), 1, 1000);
	}
	ortogonalcamera.position.x = 0;
	ortogonalcamera.position.y = 100;
	ortogonalcamera.position.z = 0;
	ortogonalcamera.lookAt(scene.position);
	
	camera=ortogonalcamera;
	
}

function init() {
	'use strict';
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	document.body.appendChild(renderer.domElement);

	clock = new THREE.Clock;
	
	createScene();
	createCameras();
	
	render();
	
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}