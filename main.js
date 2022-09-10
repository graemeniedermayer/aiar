import {entity_manager} from './entity-manager.js';
import {entity} from './entity.js';

import {load_controller} from './load-controller.js';
import {spawners} from './spawners.js';

import {spatial_hash_grid} from './spatial-hash-grid.js';
import {threejs_component} from './threejs-component.js';

import {math} from './math.js';

import {THREE} from './three-defs.js';


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

    // Hack
    this.scene_ = threejs.GetComponent('ThreeJSController').scene_;
    this.camera_ = threejs.GetComponent('ThreeJSController').camera_;
    this.threejs_ = threejs.GetComponent('ThreeJSController');

    const l = new entity.Entity();
    l.AddComponent(new load_controller.LoadController());
    this.entityManager_.Add(l, 'loader');


    const basicParams = {
      grid: this.grid_,
      scene: this.scene_,
      camera: this.camera_,
    };

    const spawner = new entity.Entity();
    spawner.AddComponent(new spawners.PlayerSpawner(basicParams));
    spawner.AddComponent(new spawners.OtherPlayerSpawner(basicParams));
    spawner.AddComponent(new spawners.ArrowSpawner(basicParams));
    spawner.AddComponent(new spawners.ParticleEffectSpawner(basicParams));
    this.entityManager_.Add(spawner, 'spawners');

    spawner.GetComponent('PlayerSpawner').Spawn();


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

  }
}


let _APP = null;

// This could be automatic right?
window.addEventListener('DOMContentLoaded', () => {
  _APP = new aielf();
});
