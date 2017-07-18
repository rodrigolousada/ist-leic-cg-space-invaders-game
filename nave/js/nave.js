/* global THREE*/

/* Cilindro: (radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)*/
/* Cubo: */

var camera, scene, renderer, material, geometry, mesh;
function render() {
	'use strict';
	renderer.render(scene, camera);
}

function addWingSupport(obj, x, y, z) {
	'use strict';
	
	geometry = new THREE.CubeGeometry(4, 4, 2);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y - 3, z);
	obj.add(mesh);
}

function addFrontNave(obj, x, y, z){
	'use strict';

	geometry = new THREE.CylinderGeometry(1,8,10);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

function addNaveWing(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CubeGeometry(8, 30, 2);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	
	obj.add(mesh);
}

function addNaveBody(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CylinderGeometry(8, 8, 30);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	
	obj.add(mesh);
}

function addBullets(obj, x, y ,z){
	'use strict'
	geometry = new THREE.CubeGeometry(4 ,4 , 3);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	
	
	obj.add(mesh);
}
 
function createNave(x, y, z) {
	'use strict';
	
	var nave = new THREE.Object3D();
	
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	
	addNaveBody(nave, 0, 0, 0);
	addFrontNave(nave,0, 20, 0);
	addWingSupport(nave, -2, 0, 8);
	addWingSupport(nave, 16, 0, 8);
	addNaveWing(nave, 16, -10,0);
	addNaveWing(nave, -20, -10,0);
	addBullets(nave, 28, 30 ,32);
	
	
	scene.add(nave);
	
	nave.position.x = x;
	nave.position.y = y;
	nave.position.z = z;
}

function createScene() {
	'use strict';
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
	
	createNave(0, 0, 0);
	
}

function onResize(){
	'use strict';
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	if(window.innerHeight > 0 && window > 0){
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
	}
	
}

function onkeydown(e){
	'use strict';
	
	switch(e.keyCode){
		case 65: //A
		case 97: //a
			scene.traverse(function(node){
				if (node instanceof THREE.Mesh){
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
		case 83: //S
		case 115: //s
			ball.userData.jumping = !ball.userData.jumping;
			break;
	}
}

function animate() {
	'use strict';
	
	if(ball.userData.jumping){
		ball.userData.step = ball.userData.step + 0.04;
		ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
		ball.position.z = 15 * (Math.cos(ball.userData.step));
	}
	render();
	
	requestAnimationFrame(animate);
}

function createCamera() {
	'use strict';
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 50;
	camera.position.y = 50;
	camera.position.z = 50;
	camera.lookAt(scene.position);
}

function init() {
	'use strict';
	
	renderer = new THREE.WebGLRenderer();
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	document.body.appendChild(renderer.domElement);
	
	createScene();
	createCamera();
	
	render();
	
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onkeydown);
}