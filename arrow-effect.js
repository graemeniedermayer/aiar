import {THREE, SkeletonUtils} from './three-defs.js';

import {particle_system} from "./particle-system.js";
import {entity} from "./entity.js";

export const arrow_effect = (() => {

  class ArrowEffect extends particle_system.ParticleEmitter {
    constructor(offset, parent) {
      super();
      this.parent_ = parent;
      this.offset_ = offset;
      this.blend_ = 1.0;
    }

    OnUpdate_() {
    }

    AddParticles(num) {


      for (let i = 0; i < num; ++i) {
        this.particles_.push(this.CreateParticle_());
      }
    }

    CreateParticle_() {
      const life = (Math.random() * 0.85 + 0.15) * 6.0;
      const p = this.offset_.clone().applyQuaternion(this.parent_.Quaternion).add(this.parent_.Position);
      const d = new THREE.Vector3(0, 0, 0);

      return {
          position: p,
          size: (Math.random() * 0.5 + 0.5) * 0.5,
          colour: new THREE.Color(),
          alpha: 1.0,
          life: life,
          maxLife: life,
          rotation: Math.random() * 2.0 * Math.PI,
          velocity: d,
          blend: this.blend_,
          drag: 1.0,
      };
    }
  };
  class ArrowTrail extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
      this.particles_ = null;
      this.emitter_ = null;
    }


    Destroy() {
      this.particles_.Destroy();
      this.particles_ = null;
    }

    InitEntity() {
      this.particles_ = new particle_system.ParticleSystem({
          camera: this.params_.camera,
          parent: this.params_.scene,
          texture: '/static/eave/experiment/aiar/textures/fx/moon.png',
      });
      this.ArrowFired_();
    }

    ArrowFired_() {
      const emitter = new ArrowEffect(new THREE.Vector3(0, 0, .05), this.Parent);
      emitter.SetEmissionRate(50);
      emitter.SetLife(8.0);
      emitter.blend_ = 1.0;
      this.particles_.AddEmitter(emitter);
      emitter.AddParticles(15);

      this.emitter_ = emitter;
    }

    Update(timeElapsed) {
      this.particles_.Update(timeElapsed);

      const emitter = new ArrowEffect(new THREE.Vector3(0, 0, .05), this.Parent);
      emitter.alphaSpline_.AddPoint(0.0, 0.0);
      emitter.alphaSpline_.AddPoint(0.7, 1.0);
      emitter.alphaSpline_.AddPoint(1.0, 0.0);
      
      emitter.colourSpline_.AddPoint(0.0, new THREE.Color(0x808080));
      emitter.colourSpline_.AddPoint(1.0, new THREE.Color(0x404040));
      
      emitter.sizeSpline_.AddPoint(0.0, 0.5);
      emitter.sizeSpline_.AddPoint(0.25, 2.0);
      emitter.sizeSpline_.AddPoint(0.75, 4.0);
      emitter.sizeSpline_.AddPoint(1.0, 10.0);
      emitter.SetEmissionRate(50);
      emitter.SetLife(8.0);
      emitter.blend_ = 1.0;
      this.particles_.AddEmitter(emitter);
      emitter.AddParticles(15);

      this.emitter_ = emitter;

      if (!this.emitter_.IsAlive) {
        this.Parent.SetDead(true);
        return;
      }
      if (this.params_.target.IsDead) {
        this.emitter_.SetLife(0.0);
        return;
      }
      this.Parent.SetPosition(this.params_.target.Position);
    }
  }
  
  // only for effect arrows (exploding/fire/ice)
  class ArrowImpact extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
      this.particles_ = null;
      this.emitter_ = null;
    }


    Destroy() {
      this.particles_.Destroy();
      this.particles_ = null;
    }

    InitEntity() {
      this.particles_ = new particle_system.ParticleSystem({
          camera: this.params_.camera,
          parent: this.params_.scene,
          texture: '/static/eave/experiment/aiar/textures/fx/arrowCollision.png',
      });
      this.OnDamaged_();
    }

    OnDamaged_() {
      const emitter = new ArrowEffect(new THREE.Vector3(0, 0, .05), this.Parent);
      emitter.alphaSpline_.AddPoint(0.0, 0.0);
      emitter.alphaSpline_.AddPoint(0.7, 1.0);
      emitter.alphaSpline_.AddPoint(1.0, 0.0);
      
      emitter.colourSpline_.AddPoint(0.0, new THREE.Color(0x808080));
      emitter.colourSpline_.AddPoint(1.0, new THREE.Color(0x404040));
      
      emitter.sizeSpline_.AddPoint(0.0, 0.5);
      emitter.sizeSpline_.AddPoint(0.25, 2.0);
      emitter.sizeSpline_.AddPoint(0.75, 4.0);
      emitter.sizeSpline_.AddPoint(1.0, 10.0);
      emitter.SetEmissionRate(50);
      emitter.SetLife(8.0);
      emitter.blend_ = 1.0;
      this.particles_.AddEmitter(emitter);
      emitter.AddParticles(15);

      this.emitter_ = emitter;
    }

    Update(timeElapsed) {
      this.particles_.Update(timeElapsed);

      if (!this.emitter_.IsAlive) {
        this.Parent.SetDead(true);
        return;
      }
      if (this.params_.target.IsDead) {
        this.emitter_.SetLife(0.0);
        return;
      }
      this.Parent.SetPosition(this.params_.target.Position);
    }
  }

  class ArrowController extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
      this.particles_ = null;
      this.emitter_ = null;
      this.particleSystem_ = new THREE.Group()
      this.arrows_ = {}
    }


    Destroy() {
      this.particles_.Destroy();
      this.particles_ = null;
    }

    InitEntity() {
      this.particleSystem_ = new THREE.Group()
      scene.add(this.particleSystem_)
      this.arrows_ = {}
      this.rigidBodies = this.Parent.GetComponent('ArrowRigidBodySystem')
      this.RegisterHandler_('player.fire', (m) => { this.FireArrow_(m); });
    }

    FireArrow_(m){
      let arrowOrig = this.Parent.FindEntity('arrows').GetComponent('RenderComponent').group_.children[0].children[0]
      let player = this.Parent.FindEntity('arrows')
      let index = Object.keys(this.arrows_).length;
      let direction = (new THREE.Vector3(0,0,1)).applyQuaternion(this.Parent._rotation)
      let pos = direction.clone().multiplyScalar(0.1).add(this.Parent._position)
      pos.y+=0.05
      let quat = this.Parent._rotation.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' )))
      this.rigidBodies.InitArrow(index, {
        initialVelocity: direction.multiplyScalar(5) ,
        pos: pos,
        quat: quat,
        size:1,
      });
      // this struct okay? maybe we want arrowOrig.children[0]
      let arrow = SkeletonUtils.clone(arrowOrig);
      this.arrows_[index] = arrow
      arrow.frustumCulled = false;

      arrow.scale.copy( new THREE.Vector3(0.001,0.001,0.001))
      arrow.position.copy( pos )
      // arrow.position.z-= 0.05
      arrow.quaternion.copy( quat)
      // useful to have off for debugging
      // let depthMesh =  new THREE.MeshDepthMaterial( {
      //   depthPacking: THREE.RGBADepthPacking,
      //   map: arrow.children[0].children[0].material.map,
      //   alphaTest: 0.5
      // } );
      // arrow.children[0].children[0].customDepthMaterial = depthMesh
      // arrow.children[0].children[1].customDepthMaterial = depthMesh

      this.particleSystem_.add( arrow );

    }

    Update(timeElapsed) {
    }
  }

  return {
    ArrowTrail: ArrowTrail,
    ArrowController: ArrowController
  };
})();
