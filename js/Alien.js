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
		
		this.setSpeed(Math.random()*Math.PI*2, 20);
		
		this.setPosition(x,y,z);
		
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
}