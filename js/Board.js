class Board extends SpaceObject {
	constructor(scene, x, y, z, width, height, shadow_flag, wireframe_flag) {
		'use strict';
		
		super(scene);
		
		this.basic_material = new THREE.MeshBasicMaterial({color: 0x006600, wireframe: wireframe_flag });
		this.phong_material = new THREE.MeshPhongMaterial({color: 0x006600, wireframe: wireframe_flag, shininess: 30, specular:0x111111, shading:THREE.SmoothShading });
		this.lambert_material = new THREE.MeshLambertMaterial({color: 0x006600, wireframe: wireframe_flag });
		
		this.material = this.basic_material;
		var geometry = new THREE.CubeGeometry(width,2,height);
		var mesh = new THREE.Mesh(geometry, this.material);
	
		this.add(mesh);
		this.setPosition(x,y,z);
		
		this.changeShadow(shadow_flag);
		
		this.visible = false;
	}
}