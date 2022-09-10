import {THREE} from './three-defs.js';

import {entity} from './entity.js';

import {player_controller} from './player-controller.js';
import {player_input} from './player-input.js';
import {render_component} from './render-component.js';
import {other_player_controller} from './other-player-controller.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {other_player_ai_controller} from './other-player-ai-controller.js';


export const spawners = (() => {

  class PlayerSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn() {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        characterModel: 'orca', //this.params_characterModel,
        offset: new THREE.Vector3(0, -.05, -.04),
        blasterStrength: 10,
      };

      const player = new entity.Entity();
      // player.Attributes.team = 'allies';
      player.SetPosition(new THREE.Vector3(0, 6, -3));
      player.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
      player.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: `./models/`,
        resourceName: `${params.characterModel}.glb`,
        scale: 0.02,
        offset: {
          position: new THREE.Vector3(0, -.05, -.04),
          quaternion: new THREE.Quaternion(),
        },
      }));
      player.AddComponent(new player_input.PlayerInput());
      player.AddComponent(new player_controller.PlayerController());

      this.Manager.Add(player, 'player');

      return player;
    }
  };

  class ArrowSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn() {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        blasterStrength: 20,
      };

      // const e = new entity.Entity();
      // e.AddComponent(
      //   new spatial_grid_controller.SpatialGridController(
      //       {grid: this.params_.grid}));
      // e.AddComponent(new render_component.RenderComponent({
      //   scene: params.scene,
      //   resourcePath: './resources/models/x-wing/',
      //   resourceName: 'scene.gltf',
      //   scale: 0.15,
      //   colour: new THREE.Color(0xFFFFFF),
      // }));
      // e.AddComponent(new other_player_controller.EnemyFighterController(params));
      // e.AddComponent(new other_player_ai_controller.EnemyAIController({
      //   grid: this.params_.grid,
      // }));

      // this.Manager.Add(e);

      // return e;
    }
  };

  class OtherPlayerSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn() {
      const params = {
        // alter this....
        camera: this.params_.camera,
        scene: this.params_.scene,
        blasterStrength: 10,
        offset: new THREE.Vector3(0, -.05, -.04),
      };

      const e = new entity.Entity();
      e.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
      e.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: './models/',
        resourceName: 'dark.glb',
        scale: .1,
        offset: {
          position: new THREE.Vector3(0, -.05, -.04),
          quaternion: new THREE.Quaternion(),
        },
      }));
      e.AddComponent(new other_player_controller.EnemyAIController({
        grid: this.params_.grid,
      }));

      this.Manager.Add(e);

      return e;
    }
  };


  class ParticleEffectSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn(target) {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        target: target,
      };

      // const e = new entity.Entity();
      // e.SetPosition(target.Position);
      // e.AddComponent(new ship_effect.ShipEffects(params));

      // this.Manager.Add(e);

      return e;
    }
  };


  return {
    PlayerSpawner: PlayerSpawner,
    OtherPlayerSpawner: OtherPlayerSpawner,
    ArrowSpawner: ArrowSpawner,
    ParticleEffectSpawner: ParticleEffectSpawner,
  };
})();