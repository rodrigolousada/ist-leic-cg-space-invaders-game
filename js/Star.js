class Star extends THREE.Object3D {
	constructor(scene, light_color, light_intensity, x, y, z) {
		'use strict';
		super();
		
		this.light_color = light_color;
		this.light_intensity = light_intensity;
		this.light;
		this.addSphere(2);
		this.position.set(x,y,z);
		
		scene.add(this);
	}
	
	toggleVisible() {
		this.visible=!this.visible;
	}
	
	addSphere(radius){
		'use strict';
		var geometry = new THREE.SphereGeometry(radius,60);
		var material = new THREE.MeshBasicMaterial({ color: this.light_color, wireframe: true });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, 0);
		
		this.add(mesh);
	}
}

class DirectionalStar extends Star {
	constructor(scene, light_color, light_intensity, x, y, z) {
		'use strict';
		super(scene, light_color, light_intensity, x, y, z);
		
		this.light = new THREE.DirectionalLight(this.light_color, this.light_intensity);
		this.light.target.position.set(boardWidth/2, 0 ,0);
		this.add(this.light.target);
		//this.light.target = SpaceShip; (falta receber objecto)
		this.add(this.light);
	}
}

class PointStar extends Star {
	constructor(scene, light_color, light_intensity, x, y, z) {
		'use strict';
		super(scene,  light_color, light_intensity, x, y, z);
		
		this.light = new THREE.PointLight(this.light_color, this.light_intensity);
		this.add(this.light);
	}
}
