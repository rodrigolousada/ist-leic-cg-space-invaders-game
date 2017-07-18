/* global THREE*/
var scene, renderer, material, geometry, mesh; //basic
var camera, perspectivecamera, perspectivecamera2, orthogonalcamera; //cameras
var board, alien1, alien2, alien3, alien4, alien5, alien6, alien7, alien8, ship, bullet; //objects
var boardWidth = 500, boardHeight = 300, cameraRatio = (boardWidth/boardHeight); //Board
const ACCELERATIONCONST=100 , DEACCELERATIONCONST=4*ACCELERATIONCONST; //Acceleration

var Bullets = {};
var bullets_counter = 0;

var clock; //clock

/* ------------------------------------------------------------------------------------------- */
/* ------------------------------------OBJECTS FUNCTIONS-------------------------------------- */
/* ------------------------------------------------------------------------------------------- */
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
	var b = bullets_counter-1;
	
	ship.update(perspectivecamera2, deltatime);
	if(Bullets["bullet" + b]){ Bullets["bullet" + b].fire(deltatime);}
	alien1.update(deltatime);
	alien2.update(deltatime);
	alien3.update(deltatime);
	alien4.update(deltatime);
	alien5.update(deltatime);
	alien6.update(deltatime);
	alien7.update(deltatime);
	alien8.update(deltatime);
	
	render();

	requestAnimationFrame(animate);
}

function onResize() {
	'use strict';
	
	if(window.innerWidth>0 && window.innerHeight>0){
		
		//ORTOGONAL CAMERA RESIZE
		var newAspectRatio = window.innerWidth/window.innerHeight;
		console.log(newAspectRatio);
		renderer.setSize(window.innerWidth,window.innerHeight);
		if (newAspectRatio > cameraRatio){
			orthogonalcamera.left = (boardHeight * newAspectRatio)/(-2);
			orthogonalcamera.right = (boardHeight * newAspectRatio)/2;
			orthogonalcamera.bottom = (boardHeight)/(-2);
			orthogonalcamera.top = (boardHeight)/2;
		}
		else{
			orthogonalcamera.left = (boardWidth)/(-2);  //para a camera ficar com a proporcao do campo de jogo em termos de largura
			orthogonalcamera.right = (boardWidth)/2;
			orthogonalcamera.bottom = (boardWidth/ newAspectRatio)/(-2);
			orthogonalcamera.top = (boardWidth/ newAspectRatio)/2;
		}
		orthogonalcamera.updateProjectionMatrix();
		
		
		//PERSPECTIVE STATIC CAMERA RESIZE
		
		//PERSPECTIVE CAMERA RESIZE
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
		case 49: //1
			camera=orthogonalcamera;
			break;
		case 50: //2
			camera=perspectivecamera;
			break;
		case 51: //3
			camera=perspectivecamera2;
			break;
		case 37: //left
			ship.setAcceleration(-ACCELERATIONCONST);
			break;
		case 39: //right
			ship.setAcceleration(ACCELERATIONCONST);
			break;
		case 66: //B
		case 98: //b
			var deltatime = clock.getDelta();
			//bullet = new Bullet(scene, ship.getPositionX(), ship.getPositionY(), 75);
			//bullet.setAcceleration(ACCELERATIONCONST*5);
			console.log("bullet");
			Bullets["bullet" + bullets_counter] = new Bullet(scene, ship.getPositionX(), ship.getPositionY(), 75);
			Bullets["bullet" + bullets_counter].setAcceleration(ACCELERATIONCONST*5);
			bullets_counter++;
			break;
			
	}
}


function onKeyUp(e) {
	'use strict';
	
	switch(e.keyCode) {
		case 37: //left
		case 39: //right
			ship.stopAcceleration();
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
	
	//Creating Objects//
	ship = new SpaceShip(scene, 0, 0, 100);
	alien1 = new Alien(scene, 150, 0, -50);
	alien2 = new Alien(scene, 50, 0, -50);
	alien3 = new Alien(scene, -50, 0, -50);
	alien4 = new Alien(scene, -150, 0, -50);
	alien5 = new Alien(scene, 150, 0, -100);
	alien6 = new Alien(scene, 50, 0, -100);
	alien7 = new Alien(scene, -50, 0, -100);
	alien8 = new Alien(scene, -150, 0, -100);

}

function createCameras() {
	'use strict';
	
	
	//FIRST CAMERA - ORTOGONAL//
	var aspectRatio = window.innerWidth/window.innerHeight;
	if(aspectRatio > cameraRatio) {
		orthogonalcamera = new THREE.OrthographicCamera( boardHeight*aspectRatio / (-2), boardHeight*aspectRatio/ (2), boardHeight / 2, boardHeight / (-2), 1, 1000);
	}
	else {
		orthogonalcamera = new THREE.OrthographicCamera( boardWidth / (-2), boardWidth / (2), (boardWidth/aspectRatio) / 2, (boardWidth/aspectRatio) / (-2), 1, 1000);
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
	perspectivecamera2 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	perspectivecamera2.position.x = 0;
	perspectivecamera2.position.y = 15;
	perspectivecamera2.position.z = 150;
	perspectivecamera2.lookAt((0,0,1));
	
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