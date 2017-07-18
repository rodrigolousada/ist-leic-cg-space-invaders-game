/*------------------------------------NAVE----------------------------*/
class SpaceShip extends SpaceObject {
	
	constructor(scene, x, y, z) {
		'use strict';
		
		super();
		var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
		
		
		this.addShipBody(material, 0, 0, 0);
		this.addFrontShip(material,0, 0, -20);
		this.addWingSupport(material, -8, 0, 0);
		this.addWingSupport(material, 8, 0, 0);
		this.addShipWing(material, 13, -3,7);
		this.addShipWing(material, -13, -3,7);
		this.addShipCannon(material, 0, 10 ,-8);
		this.speed=0;
		this.acceleration=0;
		
		this.position.set(x,y,z);
		
		scene.add(this);
	}
	
	//SHIP PARTS//
	addShipBody(material, x, y, z) {
		'use strict';
		var geometry = new THREE.CylinderGeometry(8, 8, 20);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI / 2) ) );
		//geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}
	
	addFrontShip(material, x, y, z){
		'use strict';

		var geometry = new THREE.CylinderGeometry(0,8,20);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI/2) ) );
		//geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0) );
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);

		this.add(mesh);
	}
	
	addWingSupport(material, x, y, z) {
		'use strict';
		
		var geometry = new THREE.CubeGeometry(5, 2, 2);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y - 3, z);
		
		this.add(mesh);
	}

	addShipWing(material, x, y, z) {
		'use strict';
		var geometry = new THREE.CubeGeometry(8, 2, 20);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}

	addShipCannon(material, x, y ,z){
		'use strict'
		var geometry = new THREE.CubeGeometry(4 ,4 , 3);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		
		
		this.add(mesh);
	}
	
	
	//POSITION
	getPosition() {
		return this.position;
	}
	
	setPostion(x,y,z) {
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
		return this.position.x = new_x;
	}
	
	setPositionY(new_y) {
		return this.position.y = new_y;
	}
	
	setPositionZ(new_z) {
		return this.position.z = new_z;
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
	
	//UPDATE FUNCTION//
	update(perspectivecamera2, deltatime) {
		if(this.acceleration*this.speed<0) {
			this.acceleration = (Math.abs(this.acceleration)/this.acceleration)*DEACCELERATIONCONST;
		}
		else if(this.acceleration!=0 && this.speed==0) {
			this.acceleration = (Math.abs(this.acceleration)/this.acceleration)*ACCELERATIONCONST;
		}
		this.speed+=(1/2)*this.acceleration*deltatime;
		this.position.x += this.speed*deltatime;
		perspectivecamera2.position.x += this.speed*deltatime;
	}
}