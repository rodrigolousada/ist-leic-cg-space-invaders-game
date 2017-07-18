/*------------------------------------BULLET------------------------------*/
class Bullet extends SpaceObject {
	
	constructor(scene,x,y,z){
		'use strict';
		
		super();
		var material = new THREE.MeshBasicMaterial({ color: 12597547, wireframe: true });
		
		this.addBulletBody(material, 0, 0, 0);
		
		this.setSpeed(Math.PI/2, 80);	
		
		this.setPosition(x,y,z);
		
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
}