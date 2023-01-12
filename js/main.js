import {entity_manager} from './core/entity-manager.js';
import {spatial_hash_grid} from './core/spatial-hash-grid.js';
import {threejs_component} from './core/threejs-component.js';
import {math} from './core/math.js';
import {THREE} from './core/three-defs.js';
import {entity} from './core/entity.js';
import {load_controller} from './core/load-controller.js';
import {xr_component} from './core/webxr-component.js';

import {ammojs_component} from './physics/ammojs-component.js';
import {basic_rigid_body} from './physics/rigid-body.js';

import {spawners} from './spawners.js';

class aielf {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this.entityManager_ = new entity_manager.EntityManager();

    this.OnGameStarted_();
  }

  OnGameStarted_() {
    this.grid_ = new spatial_hash_grid.SpatialHashGrid(
        [[-50, -50], [50, 50]], [1, 1]);

    this.LoadControllers_();

    this.previousRAF_ = null;
    this.RAF_();
  }

  LoadControllers_() {
    const threejs = new entity.Entity();
    threejs.AddComponent(new threejs_component.ThreeJSController());
    this.entityManager_.Add(threejs, 'threejs');

    // This might be an issue if the player controller moves too soon.
    Ammo().then((AmmoLib) => {
        Ammo = AmmoLib;
        const ammojs = new entity.Entity();
        ammojs.AddComponent( new ammojs_component.AmmoJSController());
        // is this still in scope?
        _APP.entityManager_.Add(ammojs, 'physics');
        _APP.ammojs_ = ammojs.GetComponent('AmmoJSController');
        
      })
  
    // Hack
    this.scene_ = threejs.GetComponent('ThreeJSController').scene_;
    this.camera_ = threejs.GetComponent('ThreeJSController').camera_;
    this.threejs_ = threejs.GetComponent('ThreeJSController');


		const geometry = new THREE.PlaneGeometry( 2000, 2000 );
		geometry.rotateX( - Math.PI / 2 );

		const material = new THREE.ShadowMaterial();
		material.opacity = 0.4;

    // floor
		const plane = new  THREE.Mesh( geometry, material );
		plane.scale.y = 1;
		plane.scale.x = 4;
		plane.scale.z = 4;
		plane.position.y = -1.13;
		plane.receiveShadow = true;
    globalThis.plane = plane
		this.scene_.add( plane );

    const l = new entity.Entity();
    l.AddComponent(new load_controller.LoadController());
    this.entityManager_.Add(l, 'loader');

    const basicParams = {
      grid: this.grid_,
      scene: this.scene_,
      camera: this.camera_,
    };

    const spawner = new entity.Entity();
    // spawner.AddComponent(new spawners.BuildingSpawner(basicParams));
    spawner.AddComponent(new spawners.GoblinWeaponSpawner(basicParams));
    spawner.AddComponent(new spawners.WeaponSpawner(basicParams));
    spawner.AddComponent(new spawners.ArrowSpawner(basicParams));
    spawner.AddComponent(new spawners.FloraSpawner(basicParams));
    spawner.AddComponent(new spawners.PlayerSpawner(basicParams));
    spawner.AddComponent(new spawners.GoblinSpawner(basicParams));
    
    this.entityManager_.Add(spawner, 'spawners');
    spawner.GetComponent('WeaponSpawner').Spawn()
    spawner.GetComponent('GoblinWeaponSpawner').Spawn()
    spawner.GetComponent('ArrowSpawner').Spawn()

    document.getElementById('character').addEventListener('click',(e)=>{
      let ele = e.target
      spawner.GetComponent('PlayerSpawner').Spawn(ele.id);
      
      spawner.GetComponent('GoblinSpawner').Spawn()
      document.getElementById('character').style.display = 'none'
    })
    spawner.GetComponent('FloraSpawner').Spawn()

    const webxr = new entity.Entity();
    webxr.AddComponent(new  xr_component.XRController(this.threejs_.threejs_, basicParams))
    this.entityManager_.Add(webxr, 'webxr');

  }

  RAF_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      } else {
        this.Step_(t - this.previousRAF_);
        this.threejs_.Render();
        this.previousRAF_ = t;
      }

      setTimeout(() => {
        this.RAF_();
      }, 1);
    });
  }

  Step_(timeElapsed) {
    const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

    this.entityManager_.Update(timeElapsedS, 0);
    this.entityManager_.Update(timeElapsedS, 1);
    if(this.ammojs_){
      this.ammojs_.StepSimulation(timeElapsedS);
    }
  }
}


let _APP = null;

// This could be automatic right?
window.addEventListener('DOMContentLoaded', () => {
  // this is blocking...
      _APP = new aielf();
      globalThis._APP =_APP
});
