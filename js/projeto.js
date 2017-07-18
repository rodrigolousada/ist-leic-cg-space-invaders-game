/* global THREE*/
var scene, renderer, material, geometry, mesh, wireframe_flag = true; //basic
var camera, perspectivecamera, perspectivecamera2, orthogonalcamera, width=500, height=300, cameraRatio = (width/height); //cameras
var board, ship; //objects
var boardWidth = width-20, boardHeight = height-20; //Board
var sun, stars = [], sun_light_color = 0xffff99, stars_light_color = 0xffffff, sun_intensity = 1, stars_intensity = 0.3; //lights
var shadow_flag = "gouraud", last_shadow_flag = shadow_flag; //shadows

var objects = [];

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
		ship.getCamera().aspect = window.innerWidth /window.innerHeight;
		ship.getCamera().updateProjectionMatrix();
	}
}

function onKeyDown(e) {
	'use strict';
	
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
	//scene.add(new THREE.AxisHelper(10));
	
	//Board
	board = new Board(scene,0,-20,0,boardWidth,boardHeight,shadow_flag);
	
	//Creating Objects//
	ship = new SpaceShip(scene, 0, 0, 100, shadow_flag);
	objects.push(new Alien(scene, 150, 0, -50, shadow_flag));
	objects.push(new Alien(scene, 50, 0, -50, shadow_flag));
	objects.push(new Alien(scene, -50, 0, -50, shadow_flag));
	objects.push(new Alien(scene, -150, 0, -50, shadow_flag));
	objects.push(new Alien(scene, 150, 0, -100, shadow_flag));
	objects.push(new Alien(scene, 50, 0, -100, shadow_flag));
	objects.push(new Alien(scene, -50, 0, -100, shadow_flag));
	objects.push(new Alien(scene, -150, 0, -100, shadow_flag));
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
	ship.addCamera(new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000));
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
	}
	
	
	//UPDATING OBJECTS POSITIONS//
	ship.update(deltatime);
	for(i = 0; i < objects.length; i++) {
		if(objects[i].update(deltatime)=="removed") objects.splice(i,1);
	}
	
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
	createLights();
	
	render();
	
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}
