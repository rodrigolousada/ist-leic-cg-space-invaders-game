/*------------------------------------BULLET------------------------------*/
class Bullet extends SpaceObject {
	
	constructor(scene,x,y,z,wireframe_flag,shadow_flag){
		'use strict';
		
		super(scene);
		this.basic_material = new THREE.MeshBasicMaterial({ color: 12597547, wireframe: wireframe_flag });
		this.phong_material = new THREE.MeshPhongMaterial({ color: 12597547, wireframe: wireframe_flag, shininess: 70, specular:0xfffff });
		this.lambert_material = new THREE.MeshLambertMaterial({ color: 12597547, wireframe: wireframe_flag });
		
		this.material = this.basic_material;
		
		this.addBulletBody(0, 0, 0);

		this.radius = 4;
		//this.addSphere(this.radius);	
		
		this.setSpeed(Math.PI/2, 50);
		
		this.setPosition(x,y,z);
		
		this.changeShadow(shadow_flag);
	}
	
	addBulletBody(x, y, z){
		'use strict';
		var geometry = new THREE.CylinderGeometry(2,0,6/*,20*/);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI/2) );
		var mesh = new THREE.Mesh(geometry, this.material);
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