/* global THREE*/
var scene, renderer, material, geometry, mesh; //basic
var camera, perspectivecamera, perspectivecamera2, orthogonalcamera, width=500, height=300, cameraRatio = (width/height); //cameras
var board, ship; //objects
var boardWidth = width-20, boardHeight = height-20; //Board

var bullets = [];
var aliens = [];

var clock; //clock

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
/* ------------------------------------OBJECTS FUNCTIONS-------------------------------------- */
/* ------------------------------------------------------------------------------------------- */
/*------------------------------------ESPAÇO DE JOGO----------------------------*/

function createBoard(width, height) {
	'use strict';
	
	board = new THREE.Object3D();
	
	material = new THREE.MeshBasicMaterial({color: 0x006600, wireframe: true })
	geometry = new THREE.CubeGeometry(width,2,height);
	mesh = new THREE.Mesh(geometry, material);
	
	board.add(mesh);
	board.position.set(0, -100, 0);
	
	scene.add(board);
	
}

/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------CALLBACK FUNCTIONS--------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function onResize() {
	'use strict';
	
	if(window.innerWidth>0 && window.innerHeight>0){
		
		renderer.setSize(window.innerWidth,window.innerHeight);
		
		//ORTOGONAL CAMERA RESIZE
		var newAspectRatio = window.innerWidth/window.innerHeight;
		console.log(newAspectRatio);
		if (newAspectRatio > cameraRatio){
			orthogonalcamera.left = (height * newAspectRatio)/(-2);
			orthogonalcamera.right = (height * newAspectRatio)/2;
			orthogonalcamera.bottom = (height)/(-2);
			orthogonalcamera.top = (height)/2;
		}
		else{
			orthogonalcamera.left = (width)/(-2);  //para a camera ficar com a proporcao do campo de jogo em termos de largura
			orthogonalcamera.right = (width)/2;
			orthogonalcamera.bottom = (width/ newAspectRatio)/(-2);
			orthogonalcamera.top = (width/ newAspectRatio)/2;
		}
		orthogonalcamera.updateProjectionMatrix();
		
		
		//PERSPECTIVE STATIC CAMERA RESIZE
		perspectivecamera.aspect = window.innerWidth /window.innerHeight;
		perspectivecamera.updateProjectionMatrix();
		
		//PERSPECTIVE CAMERA RESIZE
		perspectivecamera2.aspect = window.innerWidth /window.innerHeight;
		perspectivecamera2.updateProjectionMatrix();
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
			ship.accelerateLeft()
			break;
		case 39: //right
			ship.accelerateRight()
			break;
		case 66: //B
		case 98: //b
			bullets.push(new Bullet(scene, ship.getPositionX(), ship.getPositionY(), ship.getPositionZ() - 25));
			break;
			
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

/* ------------------------------------------------------------------------------------------- */
/* ----------------------------------SCENE & CAMERAS CREATION--------------------------------- */
/* ------------------------------------------------------------------------------------------- */
function createScene() {
	'use strict';
	
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));
	
	createBoard(boardWidth, boardHeight);
	
	//Creating Objects//
	ship = new SpaceShip(scene, 0, 0, 100);
	aliens.push(new Alien(scene, 150, 0, -50));
	aliens.push(new Alien(scene, 50, 0, -50));
	aliens.push(new Alien(scene, -50, 0, -50));
	aliens.push(new Alien(scene, -150, 0, -50));
	aliens.push(new Alien(scene, 150, 0, -100));
	aliens.push(new Alien(scene, 50, 0, -100));
	aliens.push(new Alien(scene, -50, 0, -100));
	aliens.push(new Alien(scene, -150, 0, -100));

}

function createCameras() {
	'use strict';
	
	
	//FIRST CAMERA - ORTOGONAL//
	var aspectRatio = window.innerWidth/window.innerHeight;
	if(aspectRatio > cameraRatio) {
		orthogonalcamera = new THREE.OrthographicCamera( height*aspectRatio / (-2), height*aspectRatio/ (2), height / 2, height / (-2), 1, 1000);
	}
	else {
		orthogonalcamera = new THREE.OrthographicCamera( width / (-2), width / (2), (width/aspectRatio) / 2, (width/aspectRatio) / (-2), 1, 1000);
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
	perspectivecamera2.position.x = ship.getPositionX();
	perspectivecamera2.position.y = ship.getPositionY() + 15;
	perspectivecamera2.position.z = ship.getPositionZ() + 50;
	perspectivecamera2.lookAt((0,0,1));
	
}

/* ------------------------------------------------------------------------------------------- */
/* -----------------------------------MAIN FUNCTIONS ----------------------------------------- */
/* ------------------------------------------------------------------------------------------- */

function render() {
	'use strict';
	
	renderer.render(scene, camera);
}

function animate() {
	'use strict';
	var i,j;
	var deltatime = clock.getDelta();
	
	//CHECKING COLISIONS//
	//Aliens with Bullets
	for(i=0; i < aliens.length; i++) {
		for(j=0; j < bullets.length; j++) {
			if(aliens[i].getRadius()+bullets[j].getRadius() > distanceVector(aliens[i].getPosition(),bullets[j].getPosition())) {
				console.log("spliced");
				aliens[i].remove();
				bullets[j].remove();
				aliens.splice(i,1);
				bullets.splice(j,1);
				break;
			}
		}
	}
	
	//Aliens with Aliens
	for(i=0; i < aliens.length; i++) {
		for(j=i+1; j < aliens.length; j++) {
			if(aliens[i].getRadius()+aliens[j].getRadius() > distanceVector(aliens[i].getPosition(),aliens[j].getPosition())) {
				aliens[i].invertSpeed();
				aliens[j].invertSpeed();
			}
		}
	}
	
	
	//UPDATING SHIP & ALIEN POSITIONS//
	ship.update(deltatime);
	for(i = 0; i < bullets.length; i++) {
		if(bullets[i].update(deltatime)=="removed") bullets.splice(i,1);
	}
	for(i = 0; i < aliens.length; i++) {
		aliens[i].update(deltatime);
	}
	
	//UPDATING PERSPECTIVE CAMERA 2 POSITION//
	perspectivecamera2.position.x = ship.getPositionX();
	perspectivecamera2.position.y = ship.getPositionY() + 15;
	perspectivecamera2.position.z = ship.getPositionZ() + 50;
	
	render();

	requestAnimationFrame(animate);
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