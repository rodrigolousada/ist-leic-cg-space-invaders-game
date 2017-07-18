/*------------------------------------BULLET------------------------------*/
class Bullet extends SpaceObject {
	
	constructor(scene,x,y,z){
		'use strict';
		
		super();
		var material = new THREE.MeshBasicMaterial({ color: 12597547, wireframe: true });
		
		this.addBulletBody(material, 0, 0, 0);
		this.acceleration=0;
		this.speed=0;	
		this.dz = Math.sin(1);
		this.position.set(x,y,z);
		
		scene.add(this);
	}
	
	
	addBulletBody(material, x, y, z){
		'use strict';
		var geometry = new THREE.CylinderGeometry(2,0,6,20);
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
		console.log("stop acceleration");
	}
	
	stopSpeed(){
		this.speed = 0;
		console.log("stop speed");
	}
	
	fire(deltatime){
		this.speed += this.acceleration*deltatime;
		this.position.z += -(this.speed*deltatime*this.dz);
	}
}