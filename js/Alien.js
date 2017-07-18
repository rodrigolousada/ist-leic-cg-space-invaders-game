/*------------------------------------ALIEN/MONSTER------------------------------*/
class Alien extends SpaceObject {
	
	constructor(scene,x,y,z){
		'use strict';
		
		super();
		var material = new THREE.MeshBasicMaterial({ color: 2600544, wireframe: true });
		var material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
		
		this.addAlienBody(material, 0, 0, 0);
		this.addAlienSupport(material, 8, 0, 5);
		this.addAlienSupport(material, -8, 0, 5);
		this.addAlienArm(material, 13, 0, 5);
		this.addAlienArm(material, -13, 0, 5);
		this.addAlienClaw(material2, 13, 0, 15);
		this.addAlienClaw(material2, -13, 0, 15);
		this.acceleration=10;
		this.speed=0;
		this.dir = Math.random()*Math.PI*2;
		this.dx = Math.cos(this.dir);
		this.dz = Math.sin(this.dir);
				
		this.position.set(x,y,z);
		
		
		scene.add(this);
	}
	
	
	addAlienBody(material, x, y, z){
		'use strict';
		var geometry = new THREE.SphereGeometry(8,30 /*,60*/);
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}
		
	addAlienSupport(material, x, y, z){
		var geometry = new THREE.CubeGeometry(4,2,2);
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x,y,z);
		this.add(mesh);
	}

	addAlienArm(material, x, y, z){
		'use strict';
		var geometry = new THREE.CylinderGeometry(3,3,10 /*,60*/);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI/2)) );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}
	
	addAlienClaw(material, x, y, z){
		'use strict';

		var geometry = new THREE.CylinderGeometry(0,2,10/*,40*/);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI/2) );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		this.add(mesh);
	}
	
	//POSITION//
	
	getPositionX(){
		return this.position.x;
	}
	
	setPositionX(new_x){
		this.position.x = new_x;
	}
	
	getPositionY(){
		return this.position.y;
	}
	
	setPositionY(new_y){
		this.position.y = new_y;
	}
	
	getPositionZ(){
		return this.position.z;
	}
	
	setPositionZ(new_z){
		this.position.z = new_z;
	}
	
	//SPEED//
	getSpeed() {
		return this.speed;
	}
	
	setSpeed(new_speed) {
		return this.speed = new_speed;
	}
	
	//ACCELERATION//
	getAcceleration() {
		return this.acceleration;
	}
	
	setAcceleration(new_acceleration) {
		return this.acceleration = new_acceleration;
	}
	
	stopAcceleration() {
		this.acceleration = 0;
	}
	
	update(deltatime){
		
		this.speed += this.acceleration*deltatime;
		this.position.x += this.speed*deltatime*this.dx;
		this.position.z += this.speed*deltatime*this.dz;
	}
}