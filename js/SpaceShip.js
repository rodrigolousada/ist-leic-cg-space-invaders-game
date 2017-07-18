const ACCELERATIONCONST=100 , DEACCELERATIONCONST=4*ACCELERATIONCONST; //Acceleration

/*------------------------------------NAVE----------------------------*/
class SpaceShip extends SpaceObject {
	
	constructor(scene,x,y,z) {
		'use strict';
		
		super(scene);
		this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
		
		
		this.addShipBody(0, 0, 0);
		this.addFrontShip(0, 0, -20);
		this.addWingSupport(-8, 0, 0);
		this.addWingSupport(8, 0, 0);
		this.addShipWing(13, -3,7);
		this.addShipWing(-13, -3,7);
		this.addShipCannon(0, 10 ,-8);
		
		this.radius = 25;
		//this.addSphere(this.radius);
		
		this.setPosition(x,y,z);
	}
	
	toggleWireframe() {
		this.material.wireframe = !this.material.wireframe;
	}
	
	//SHIP PARTS//
	addShipBody(x, y, z) {
		'use strict';
		var geometry = new THREE.CylinderGeometry(8, 8, 20);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI / 2) ) );
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}
	
	addFrontShip(x, y, z){
		'use strict';

		var geometry = new THREE.CylinderGeometry(0,8,20);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 3*(Math.PI/2) ) );
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);

		this.add(mesh);
	}
	
	addWingSupport(x, y, z) {
		'use strict';
		
		var geometry = new THREE.CubeGeometry(5, 2, 2);
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y - 3, z);
		
		this.add(mesh);
	}

	addShipWing(x, y, z) {
		'use strict';
		var geometry = new THREE.CubeGeometry(8, 2, 20);
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}

	addShipCannon(x, y ,z){
		'use strict'
		var geometry = new THREE.CubeGeometry(4 ,4 , 3);
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);
		
		
		this.add(mesh);
	}
	
	//ACCELERATION FUNCTIONS//
	accelerateLeft() {
		this.setAcceleration(Math.PI, ACCELERATIONCONST);
	}
	
	accelerateRight() {
		this.setAcceleration(0, ACCELERATIONCONST);
	}
	
	stopAccelerateRight() {
		if(this.getAccelerationDirectionX0Z()==0) this.stopAcceleration();
	}
	
	stopAccelerateLeft() {
		if(this.getAccelerationDirectionX0Z()==Math.PI) this.stopAcceleration();
	}
	
	//UPDATE FUNCTION//
	update(deltatime) {
		//Colision with boarders
		if(this.getPositionX()-17 < -boardWidth/2) {
			this.stopSpeed();
			this.stopAccelerateLeft();
			this.setPositionX(-boardWidth/2+17);
		}
		else if(this.getPositionX()+17 > boardWidth/2) {
			this.stopSpeed();
			this.stopAccelerateRight();
			this.setPositionX(boardWidth/2-17);
		}
		
		//Contrariar o movimento
		if(this.acceleration_x*this.speed_x<0) {
			this.setAcceleration(this.getAccelerationDirectionX0Z(), DEACCELERATIONCONST);
		}
		else if(this.acceleration_x!=0) {
			this.setAcceleration(this.getAccelerationDirectionX0Z(), ACCELERATIONCONST);
		}
		
		super.update(deltatime);
	}
}