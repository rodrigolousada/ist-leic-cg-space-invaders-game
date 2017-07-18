const ACCELERATIONCONST=100 , DEACCELERATIONCONST=4*ACCELERATIONCONST; //Acceleration

/*------------------------------------NAVE----------------------------*/
class SpaceShip extends SpaceObject {
	
	constructor(scene,x,y,z,shadow_flag) {
		'use strict';
		
		super(scene);
		this.basic_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
		this.phong_material = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true, shininess: 30, specular:0x111111, shading:THREE.SmoothShading });
		this.lambert_material = new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: true});
		
		this.material = this.basic_material;
		
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
		
		this.changeShadow(shadow_flag);
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
		
		var geometry = new THREE.Geometry();
		
		//Vertices
		geometry.vertices.push(new THREE.Vector3(2.5,1,1));
		geometry.vertices.push(new THREE.Vector3(2.5,-1,1));
		geometry.vertices.push(new THREE.Vector3(-2.5,-1,1));
		geometry.vertices.push(new THREE.Vector3(-2.5,1,1));
		geometry.vertices.push(new THREE.Vector3(2.5,1,-1));
		geometry.vertices.push(new THREE.Vector3(2.5,-1,-1));
		geometry.vertices.push(new THREE.Vector3(-2.5,-1,-1));
		geometry.vertices.push(new THREE.Vector3(-2.5,1,-1));
		
		//Faces
		//front
		geometry.faces.push(new THREE.Face3(4,5,6));
		geometry.faces.push(new THREE.Face3(6,7,4));
		//back
		geometry.faces.push(new THREE.Face3(0,3,2));
		geometry.faces.push(new THREE.Face3(0,2,1));
		//left
		geometry.faces.push(new THREE.Face3(3,7,6));
		geometry.faces.push(new THREE.Face3(3,6,2));
		//top
		geometry.faces.push(new THREE.Face3(0,4,7));
		geometry.faces.push(new THREE.Face3(0,7,3));
		//right
		geometry.faces.push(new THREE.Face3(1,5,4));
		geometry.faces.push(new THREE.Face3(1,4,0));
		//bottom
		geometry.faces.push(new THREE.Face3(1,2,6));
		geometry.faces.push(new THREE.Face3(1,6,5));
		
		geometry.computeFaceNormals();
		
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y - 3, z);
		
		this.add(mesh);
	}

	addShipWing(x, y, z) {
		'use strict';		
		var geometry = new THREE.Geometry();
		
		//Vertices
		geometry.vertices.push(new THREE.Vector3(4,1,10));
		geometry.vertices.push(new THREE.Vector3(4,-1,10));
		geometry.vertices.push(new THREE.Vector3(-4,-1,10));
		geometry.vertices.push(new THREE.Vector3(-4,1,10));
		geometry.vertices.push(new THREE.Vector3(4,1,-10));
		geometry.vertices.push(new THREE.Vector3(4,-1,-10));
		geometry.vertices.push(new THREE.Vector3(-4,-1,-10));
		geometry.vertices.push(new THREE.Vector3(-4,1,-10));
		
		//Faces
		//front
		geometry.faces.push(new THREE.Face3(4,5,6));
		geometry.faces.push(new THREE.Face3(6,7,4));
		//back
		geometry.faces.push(new THREE.Face3(0,3,2));
		geometry.faces.push(new THREE.Face3(0,2,1));
		//left
		geometry.faces.push(new THREE.Face3(3,7,6));
		geometry.faces.push(new THREE.Face3(3,6,2));
		//top
		geometry.faces.push(new THREE.Face3(0,4,7));
		geometry.faces.push(new THREE.Face3(0,7,3));
		//right
		geometry.faces.push(new THREE.Face3(1,5,4));
		geometry.faces.push(new THREE.Face3(1,4,0));
		//bottom
		geometry.faces.push(new THREE.Face3(1,2,6));
		geometry.faces.push(new THREE.Face3(1,6,5));
		
		geometry.computeFaceNormals();
		
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}

	addShipCannon(x, y ,z){
		'use strict'
		var geometry = new THREE.Geometry();
		
		//Vertices
		geometry.vertices.push(new THREE.Vector3(2,2,1.5));
		geometry.vertices.push(new THREE.Vector3(2,-2,1.5));
		geometry.vertices.push(new THREE.Vector3(-2,-2,1.5));
		geometry.vertices.push(new THREE.Vector3(-2,2,1.5));
		geometry.vertices.push(new THREE.Vector3(2,2,-1.5));
		geometry.vertices.push(new THREE.Vector3(2,-2,-1.5));
		geometry.vertices.push(new THREE.Vector3(-2,-2,-1.5));
		geometry.vertices.push(new THREE.Vector3(-2,2,-1.5));
		
		//Faces
		//front
		geometry.faces.push(new THREE.Face3(4,5,6));
		geometry.faces.push(new THREE.Face3(6,7,4));
		//back
		geometry.faces.push(new THREE.Face3(0,3,2));
		geometry.faces.push(new THREE.Face3(0,2,1));
		//left
		geometry.faces.push(new THREE.Face3(3,7,6));
		geometry.faces.push(new THREE.Face3(3,6,2));
		//top
		geometry.faces.push(new THREE.Face3(0,4,7));
		geometry.faces.push(new THREE.Face3(0,7,3));
		//right
		geometry.faces.push(new THREE.Face3(1,5,4));
		geometry.faces.push(new THREE.Face3(1,4,0));
		//bottom
		geometry.faces.push(new THREE.Face3(1,2,6));
		geometry.faces.push(new THREE.Face3(1,6,5));
		
		geometry.computeFaceNormals();
		
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
	
	//UPDATE FUNCTIONS//
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
