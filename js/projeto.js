/* global THREE*/

var camera, perspectivecamera, ortogonalcamera, scene, renderer, material, geometry, mesh, board, alien1, alien2, alien3, alien4, alien5, alien6, alien7, alien8, ship;
var oldTime = 0;
var boardWidth = 500, boardHeight = 300, cameraRatio = (boardWidth/boardHeight);
const ACCELERATIONCONST=100 , DEACCELERATIONCONST=4*ACCELERATIONCONST;

var clock, newTime, delta, speed=0, acceleration=0, direction = 0, caughtleft=0, caughtright=0;

/* ------------------------------------------------------------------------------------------- */
/* ------------------------------------OBJECTS FUNCTIONS-------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

/*------------------------------------NAVE----------------------------*/

function addWingSupport(obj, x, y, z) {
	'use strict';
	
	geometry = new THREE.CubeGeometry(5, 2, 2);
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y - 3, z);
	
	obj.add(mesh);
}

function addFrontShip(obj, x, y, z){
	'use strict';

	geometry = new THREE.CylinderGeometry(0,8,20);
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI/2) ) );
	//geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0) );
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

function addShipWing(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CubeGeometry(8, 2, 20);
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	
	obj.add(mesh);
}

function addShipBody(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CylinderGeometry(8, 8, 20);
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI / 2) ) );
	//geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	
	obj.add(mesh);
}

function addShipBullets(obj, x, y ,z){
	'use strict'
	geometry = new THREE.CubeGeometry(4 ,4 , 3);
	material = new THREE.MeshBasicMaterial({ color: 0x0000FF, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	
	
	obj.add(mesh);
}

function createShip(x, y, z) {
	'use strict';
	
	ship = new THREE.Object3D();
	
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	
	addShipBody(ship, 0, 0, 0);
	addFrontShip(ship,0, 0, -20);
	addWingSupport(ship, -8, 0, 0);
	addWingSupport(ship, 8, 0, 0);
	addShipWing(ship, 13, -3,7);
	addShipWing(ship, -13, -3,7);
	addShipBullets(ship, 0, 10 ,-8);
	
	ship.position.set(x,y,z);
	
	scene.add(ship);
}

/*------------------------------------ALIEN/MONSTER------------------------------*/

function addAlienSupport(obj, x, y, z){
	geometry = new THREE.CubeGeometry(4,2,2);
	material = new THREE.MeshBasicMaterial({color: 2600544, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function addAlienClaw(obj, x, y, z){
	'use strict';

	geometry = new THREE.CylinderGeometry(0,2,10/*,40*/);
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI/2) );
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}


function addAlienArm(obj, x, y, z){
	'use strict';
	geometry = new THREE.CylinderGeometry(3,3,10 /*,60*/);
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI/2)) );
	material = new THREE.MeshBasicMaterial({color: 2600544, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function addAlienBody(obj, x, y, z){
	'use strict';
	geometry = new THREE.SphereGeometry(8,30 /*,60*/);
	material = new THREE.MeshBasicMaterial({color: 2600544, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createMonster(x, y, z) {
	'use strict';
	
	var monster = new THREE.Object3D();
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	
	addAlienArm(monster, 13, 0, 5);
    addAlienArm(monster, -13, 0, 5);
    addAlienSupport(monster, 8, 0, 5);
    addAlienSupport(monster, -8, 0, 5);
    addAlienBody(monster, 0, 0, 0);
    addAlienClaw(monster, 13, 0, 15);
    addAlienClaw(monster, -13, 0, 15);
	
	monster.position.set(x,y,z);
	
	scene.add(monster);
	
	return monster;
}

/*------------------------------------ESPAÇO DE JOGO----------------------------*/

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
	
	if(acceleration*speed<0) {
		acceleration = (Math.abs(acceleration)/acceleration)*DEACCELERATIONCONST;
	}
	else if(acceleration!=0 && speed==0) {
		acceleration = (Math.abs(acceleration)/acceleration)*ACCELERATIONCONST;
	}
	speed+=(1/2)*acceleration*deltatime;
	ship.position.x += speed*deltatime;
	
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
			/*alien.userData.jumping = !alien.userData.jumping;
			if(clock.running==true) clock.stop();
			else clock.start();*/
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
	createShip(0, 0, 100);
	alien1 = createMonster(150, 0, -50);
	alien2 = createMonster(50, 0, -50);
	alien3 = createMonster(-50, 0, -50);
	alien4 = createMonster(-150, 0, -50);
	alien5 = createMonster(150, 0, -100);
	alien6 = createMonster(50, 0, -100);
	alien7 = createMonster(-50, 0, -100);
	alien8 = createMonster(-150, 0, -100);

	
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