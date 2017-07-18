const ACCELERATIONCONST=100 , DEACCELERATIONCONST=4*ACCELERATIONCONST; //Acceleration

/*------------------------------------NAVE----------------------------*/
class SpaceShip extends SpaceObject {
	
	constructor(scene,x,y,z,shadow_flag,wireframe_flag,n_lives) {
		'use strict';
		
		super(scene);
		this.basic_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: wireframe_flag});
		this.phong_material = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: wireframe_flag, shininess:70, specular:0x111111, shading:THREE.SmoothShading });
		this.lambert_material = new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: wireframe_flag});
		
		this.material = this.basic_material;
		
		this.addShipBody(0, 0, 0);
		this.addWingSupport(-8, 0, 0);
		this.addWingSupport(8, 0, 0);
		this.addShipWing(13, -3,7);
		this.addShipWing(-13, -3,7);
		this.addShipLamp(0, 10 ,-8);
		
		this.radius = 20;
		//this.addSphere(this.radius);
		
		this.setPosition(x,y,z);
		
		this.setMaxLives(3);
		
		this.changeShadow(shadow_flag);
	}
	
	//SHIP PARTS//
	createCubeGeometry(x,y,z) {
		var geometry = new THREE.Geometry();
		
		//Vertices
		geometry.vertices.push(new THREE.Vector3(x/2,y/2,z/2));
		geometry.vertices.push(new THREE.Vector3(x/2,-y/2,z/2));
		geometry.vertices.push(new THREE.Vector3(-x/2,-y/2,z/2));
		geometry.vertices.push(new THREE.Vector3(-x/2,y/2,z/2));
		geometry.vertices.push(new THREE.Vector3(x/2,y/2,-z/2));
		geometry.vertices.push(new THREE.Vector3(x/2,-y/2,-z/2));
		geometry.vertices.push(new THREE.Vector3(-x/2,-y/2,-z/2));
		geometry.vertices.push(new THREE.Vector3(-x/2,y/2,-z/2));
		
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
		
		geometry.computeVertexNormals();
		geometry.computeFaceNormals();
		
		return geometry;
	}
	
	addShipBody(x, y, z) {
		'use strict';
		
		var geometry = new THREE.Geometry();
		var raiz_32 = Math.sqrt(32);
		
		//Vertices
		geometry.vertices.push(new THREE.Vector3(0,0,10));
		geometry.vertices.push(new THREE.Vector3(0,8,10));
		geometry.vertices.push(new THREE.Vector3(-raiz_32,raiz_32,10));
		geometry.vertices.push(new THREE.Vector3(-8,0,10));
		geometry.vertices.push(new THREE.Vector3(-raiz_32,-raiz_32,10));
		geometry.vertices.push(new THREE.Vector3(0,-8,10));
		geometry.vertices.push(new THREE.Vector3(raiz_32,-raiz_32,10));
		geometry.vertices.push(new THREE.Vector3(8,0,10));
		geometry.vertices.push(new THREE.Vector3(raiz_32,raiz_32,10));
		
		geometry.vertices.push(new THREE.Vector3(0,0,-30));
		geometry.vertices.push(new THREE.Vector3(0,8,-10));
		geometry.vertices.push(new THREE.Vector3(-raiz_32,raiz_32,-10));
		geometry.vertices.push(new THREE.Vector3(-8,0,-10));
		geometry.vertices.push(new THREE.Vector3(-raiz_32,-raiz_32,-10));
		geometry.vertices.push(new THREE.Vector3(0,-8,-10));
		geometry.vertices.push(new THREE.Vector3(raiz_32,-raiz_32,-10));
		geometry.vertices.push(new THREE.Vector3(8,0,-10));
		geometry.vertices.push(new THREE.Vector3(raiz_32,raiz_32,-10));
		
		
		//Faces
		//back
		geometry.faces.push(new THREE.Face3(1,2,0));
		geometry.faces.push(new THREE.Face3(2,3,0));
		geometry.faces.push(new THREE.Face3(3,4,0));
		geometry.faces.push(new THREE.Face3(4,5,0));
		geometry.faces.push(new THREE.Face3(5,6,0));
		geometry.faces.push(new THREE.Face3(6,7,0));
		geometry.faces.push(new THREE.Face3(7,8,0));
		geometry.faces.push(new THREE.Face3(8,1,0));
		
		//front
		geometry.faces.push(new THREE.Face3(10,11,9));
		geometry.faces.push(new THREE.Face3(11,12,9));
		geometry.faces.push(new THREE.Face3(12,13,9));
		geometry.faces.push(new THREE.Face3(13,14,9));
		geometry.faces.push(new THREE.Face3(14,15,9));
		geometry.faces.push(new THREE.Face3(15,16,9));
		geometry.faces.push(new THREE.Face3(16,17,9));
		geometry.faces.push(new THREE.Face3(17,10,9));
		
		
		//sides
		geometry.faces.push(new THREE.Face3(2,1,10));
		geometry.faces.push(new THREE.Face3(2,10,11));
		
		geometry.faces.push(new THREE.Face3(3,2,11));
		geometry.faces.push(new THREE.Face3(3,11,12));
		
		geometry.faces.push(new THREE.Face3(4,3,12));
		geometry.faces.push(new THREE.Face3(4,12,13));
		
		geometry.faces.push(new THREE.Face3(5,4,13));
		geometry.faces.push(new THREE.Face3(5,13,14));
		
		geometry.faces.push(new THREE.Face3(6,5,14));
		geometry.faces.push(new THREE.Face3(6,14,15));
		
		geometry.faces.push(new THREE.Face3(7,6,15));
		geometry.faces.push(new THREE.Face3(7,15,16));
		
		geometry.faces.push(new THREE.Face3(8,7,16));
		geometry.faces.push(new THREE.Face3(8,16,17));
		
		geometry.faces.push(new THREE.Face3(1,8,17));
		geometry.faces.push(new THREE.Face3(1,17,10));		
		
		geometry.computeVertexNormals();
		geometry.computeFaceNormals();
		
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}
	
	addWingSupport(x, y, z) {
		'use strict';
		
		var geometry = this.createCubeGeometry(5,2,2);
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y - 3, z);
		
		this.add(mesh);
	}

	addShipWing(x, y, z) {
		'use strict';		
		var geometry = this.createCubeGeometry(8,2,20);
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}

	addShipLamp(x, y ,z){
		'use strict'
		var geometry = this.createCubeGeometry(4,4,3);		
		mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(x, y, z);
		
		
		this.add(mesh);
	}
	
	//SPOTLIGHT
	addLight(light) {
		super.addLight(light);
		
		this.spotlight.target.position.set(0,0,-boardHeight/2);
		this.add(this.spotlight.target);
		
		this.spotlight.position.set(0, 10, -20);
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
		//this.spotlight.target.updateMatrixWorld();
	}
}
