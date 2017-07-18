/*------------------------------------BULLET------------------------------*/
class Bullet extends SpaceObject {
	
	constructor(scene,x,y,z,wireframe_flag){
		'use strict';
		
		super(scene);
		this.material = new THREE.MeshBasicMaterial({ color: 12597547, wireframe: wireframe_flag });
		
		this.addBulletBody(this.material, 0, 0, 0);

		this.radius = 4;
		//this.addSphere(this.radius);	
		
		this.setSpeed(Math.PI/2, 150);
		
		this.setPosition(x,y,z);
	}
	
	toggleWireframe() {
		this.material.wireframe = !this.material.wireframe;
	}
	
	addBulletBody(material, x, y, z){
		'use strict';
		var geometry = new THREE.CylinderGeometry(2,0,6/*,20*/);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI/2) );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		
		this.add(mesh);
	}
	
	update(deltatime) {
		if(this.getPositionZ() < -boardHeight/2+this.getRadius()) {
			this.remove();
			return "removed";
		}
		super.update(deltatime);
	}
}