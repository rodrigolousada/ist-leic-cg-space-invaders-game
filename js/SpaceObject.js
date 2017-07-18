class SpaceObject extends THREE.Object3D {
	constructor(scene) {
		super();
		
		this.radius = 0;
		
		this.last_position_x = this.position.x;
		this.last_position_y = this.position.y;
		this.last_position_z = this.position.z;
		
		this.speed = 0;
		this.speed_x = 0;
		this.speed_y = 0;
		this.speed_z = 0;
		this.speed_direction_x0z = 0;
		this.speed_direction_x = 1;
		this.speed_direction_z = 0;
		
		this.acceleration = 0;
		this.acceleration_x = 0;
		this.acceleration_y = 0;
		this.acceleration_z = 0;
		this.acceleration_direction_x0z = 0;
		this.acceleration_direction_x = 1;
		this.acceleration_direction_z = 0;
		
		scene.add(this);
	}
	
	remove() {
		scene.remove(this);
	}
	
	//RADIUS//
	getRadius() {
		return this.radius;
	}
	
	setRadius(new_radius) {
		this.radius = new_radius;
	}
	
	addSphere(radius){
		'use strict';
		var geometry = new THREE.SphereGeometry(radius,60);
		var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, 0);
		
		this.add(mesh);
	}
	
	//POSITION//
	getPosition() {
		return this.position;
	}
	
	setPosition(x,y,z) {
		this.position.set(x,y,z);
	}
	
	getPositionX() {
		return this.position.x;
	}
	
	getPositionY() {
		return this.position.y;
	}
	
	getPositionZ() {
		return this.position.z;
	}
	
	setPositionX(new_x) {
		this.position.x = new_x;
	}
	
	setPositionY(new_y) {
		this.position.y = new_y;
	}
	
	setPositionZ(new_z) {
		this.position.z = new_z;
	}

	stop() {
		this.stopSpeed();
		this.stopAcceleration();
	}

	getBackToLastPosition() {
		this.position.x = this.last_position_x;
		this.position.y = this.last_position_y;
		this.position.z = this.last_position_z;
	}
	


	//SPEED//
	getSpeed() {
		return this.speed;
	}
	
	setSpeed(new_direction, new_speed) {
		this.speed_direction_x0z = new_direction;
		this.speed = new_speed;
		this.speed_direction_x = Math.cos(this.speed_direction_x0z);
		this.speed_direction_z = -Math.sin(this.speed_direction_x0z);
		this.speed_x = this.speed * this.speed_direction_x;
		this.speed_z = this.speed * this.speed_direction_z;
	}
	
	stopSpeed() {
		this.setSpeed(0,0);
	}
	
	getSpeedDirectionX0Z() {
		return this.speed_direction_x0z;
	}
	
	getSpeedX() {
		return this.speed_x;
	}
	
	getSpeedY() {
		return this.speed_y;
	}
	
	getSpeedZ() {
		return this.speed_z;
	}
	
	setSpeedX(new_speed_x) {
		this.speed_x = new_speed_x;
	}
	
	setSpeedY(new_speed_y) {
		this.speed_y = new_speed_y;
	}
	
	setSpeedZ(new_speed_z) {
		this.speed_z = new_speed_z;
	}
	
	stopSpeedX() {
		this.speed_x = 0;
	}
	
	stopSpeedY() {
		this.speed_y = 0;
	}
	
	stopSpeedZ() {
		this.speed_z = 0;
	}
	
	invertSpeed() {
		this.setSpeed(this.speed_direction_x0z+Math.PI, this.getSpeed());
	}
	
	
	
	//ACCELERATION//
	getAcceleration() {
		return this.acceleration;
	}
	
	setAcceleration(new_direction, new_acceleration) {
		this.acceleration_direction_x0z = new_direction;
		this.acceleration = new_acceleration;
		this.acceleration_direction_x = Math.cos(this.acceleration_direction_x0z);
		this.acceleration_direction_z = -Math.sin(this.acceleration_direction_x0z);
		this.acceleration_x = this.acceleration * this.acceleration_direction_x;
		this.acceleration_z = this.acceleration * this.acceleration_direction_z;
	}
	
	stopAcceleration() {
		this.setAcceleration(0,0);
	}
	
	getAccelerationDirectionX0Z() {
		return this.acceleration_direction_x0z;
	}
	
	getAccelerationX() {
		return this.acceleration_x;
	}
	
	getAccelerationY() {
		return this.acceleration_y;
	}
	
	getAccelerationZ() {
		return this.acceleration_z;
	}
	
	setAccelerationX(new_acceleration_x) {
		this.acceleration_x = new_acceleration_x;
	}
	
	setAccelerationY(new_acceleration_y) {
		this.acceleration_y = new_acceleration_y;
	}
	
	setAccelerationZ(new_acceleration_z) {
		this.acceleration_z = new_acceleration_z;
	}
	
	stopAccelerationX() {
		this.acceleration_x = 0;
	}
	
	stopAccelerationY() {
		this.acceleration_y = 0;
	}
	
	stopAccelerationZ() {
		this.acceleration_z = 0;
	}
	
	
	
	
	//UDPATE FUNCTIONS//
	update(deltatime) { 
		//UPDATING LAST POSITION
		this.last_position_x = this.position.x;
		this.last_position_y = this.position.y;
		this.last_position_z = this.position.z;
		
		//EQUACAO DA VELOCIDADE		
		this.position.x += (1/2)*this.speed_x*deltatime;
		this.position.y += (1/2)*this.speed_y*deltatime;
		this.position.z += (1/2)*this.speed_z*deltatime;
		
		this.speed_x+=this.acceleration_x*deltatime;
		this.speed_y+=this.acceleration_y*deltatime;
		this.speed_z+=this.acceleration_z*deltatime;
		
		this.position.x += (1/2)*this.speed_x*deltatime;
		this.position.y += (1/2)*this.speed_y*deltatime;
		this.position.z += (1/2)*this.speed_z*deltatime;
	}

}