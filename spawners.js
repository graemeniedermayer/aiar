import {THREE} from './three-defs.js';

import {entity} from './entity.js';

import {player_controller} from './player-controller.js';
import {player_input} from './player-input.js';
import {render_component} from './render-component.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';

// import {other_player_controller} from './other-player-controller.js';
// import {other_player_ai_controller} from './other-player-ai-controller.js';


export const spawners = (() => {
  let scale = 0.1
  class PlayerSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn(model) {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        characterModel: model, //this.params_characterModel,
        offset: new THREE.Vector3(0, 0, 0),
        blasterStrength: 10,
      };

      const player = new entity.Entity();
      // player.Attributes.team = 'allies';
      player.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid})
      );
      player.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: `./aiar/models/`,
        resourceName: `${params.characterModel}.glb`,
        scale: scale,
        castShadow:true,
        receiveShadow:true,
        sided:THREE.FrontSide,
        offset: {
          position: new THREE.Vector3(0, 0, 0),
          quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' )),
        },
        //this really isn't my favourite style, but it does preserve renderComponents independence and consolidates the resource paths
        callback: (mdl, anim, self) => {
          const loader = self.FindEntity('loader').GetComponent('LoadController');
          let controller = self.Parent.components_.PlayerController
          controller._mixer = new THREE.AnimationMixer( mdl.children[0] );
          anim.forEach(x=>{
            controller._animations[x.name] = controller._mixer.clipAction(x);
          });
          controller._rotationFSM.SetState('RotateIdle')
          controller._strafeFSM.SetState('AimIdle') 
          controller._drawFSM.SetState('DrawIdle')

          let righthand = mdl.children[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].children[0]
          let lefthand = mdl.children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0]

          mdl.children[0].children[1].frustumCulled=false
          mdl.children[0].children[2].frustumCulled=false
          loader.LoadAttachImageToObject('/static/eave/experiment/aiar/models/', 'aquaBow.png', 
            player,
            lefthand, {
              scale:0.6, 
              item:'bow', 
          })
          loader.LoadAttachImageToObject('/static/eave/experiment/aiar/models/', 'moon1.png', 
            player,
            righthand,  {
              scale:1, 
              item:'arrow', 
          })
        }
      }));
      player.AddComponent(new player_input.PlayerInput());
      player.AddComponent(new player_controller.PlayerController());
      player.SetPosition(new THREE.Vector3(0, -1.2, -1))
      this.Manager.Add(player, 'player');

      return player;
    }
  };

  class FloraSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn(model) {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        offset: new THREE.Vector3(0, 0, 0),
      };

      const flora = new entity.Entity();
      flora.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: `./aiar/models/`,
        resourceName: `treesDouble.glb`,
        scale: scale,
        castShadow:true,
        receiveShadow:true,
        sided:THREE.DoubleSide,
        offset: {
          position: new THREE.Vector3(0, 0, 0),
          quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' )),
        },
        callbackOrder: 'postLoad',
        callback: (mdl, anim, _) => {
          let floraSet = mdl.children
          for(let flo of floraSet){
            flo.position.copy( new THREE.Vector3(40*(Math.random() - 0.5), 40*(Math.random() - 0.5), 0) )
            // intersections are usually bad
          }

        }
      }));
      flora.SetPosition(new THREE.Vector3(0, -1.15, 0))
      this.Manager.Add(flora, 'flora');

      return flora;
    }
  };

  class BuildingSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn(model) {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        offset: new THREE.Vector3(0, 0, 0),
      };
      const building = new entity.Entity();
      building.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: `./aiar/models/`,
        resourceName: `town.glb`,
        scale: scale,
        castShadow:true,
        receiveShadow:true,
        sided: THREE.DoubleSide,
        offset: {
          position: new THREE.Vector3(0, 0, 0),
          quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' )),
        },
        callbackOrder: 'postLoad',
        callback: (mdl, anim, _) => {
          let buildingSet = mdl.children
          globalThis.buildingSet = buildingSet
          for(let build of buildingSet){
            build.position.copy( new THREE.Vector3(40*(Math.random() - 0.5), 40*(Math.random() - 0.5), 0) )
          }

        }
      }));
      building.SetPosition(new THREE.Vector3(0, -1.15, 0))
      this.Manager.Add(building, 'building');

      return building;
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
        characterModel: 'dark', 
        blasterStrength: 10,
        offset: new THREE.Vector3(0, -.05, -.04),
      };

      const e = new entity.Entity();
      e.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
      e.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: './aiar/models/',
        resourceName: 'orca.glb',
        castShadow:true,
        receiveShadow:true,
        scaled: .2,
        offset: {
          position: new THREE.Vector3(0, -.05, -.04),
          quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' )),
        },
      }));
      // e.AddComponent(new other_player_controller.EnemyAIController({
      //   grid: this.params_.grid,
      // }));

      this.Manager.Add(e);

      return e;
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
    FloraSpawner: FloraSpawner,
    BuildingSpawner: BuildingSpawner,
    OtherPlayerSpawner: OtherPlayerSpawner,
    ArrowSpawner: ArrowSpawner,
    ParticleEffectSpawner: ParticleEffectSpawner,
  };
})();
