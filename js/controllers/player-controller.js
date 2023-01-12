import {THREE} from '../core/three-defs.js';
import {entity} from '../core/entity.js';
import {math} from '../core/math.js';
import {globals} from '../core/globals.js';

import {fsm} from '../animations/fsm.js';

export const player_controller = (() => {

  class PlayerController extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
      this.dead_ = false;
      this._mixer;
      this.scale = globals.scale
      this._animations = {};
      this._drawFSM = new fsm.drawFSM(this);
      this._rotationFSM = new fsm.rotationFSM(this);
      this._strafeFSM = new fsm.strafeFSM(this);
    }

    InitComponent() {
      this.RegisterHandler_('physics.collision', (m) => { this.OnCollision_(m); });
      this.RegisterHandler_('health.dead', (m) => { this.OnDeath_(m); });
    }

    InitEntity() {
      this.decceleration_ = new THREE.Vector3(-0.00005, -0.00001, -0.01);
      this.acceleration_ = new THREE.Vector3(1, 0.005, 250);
      this.velocity_ = new THREE.Vector3(0, 0, 0);
    }
    OnDeath_(m) {
      if (!this.dead_) {
        this.dead_ = true;
      }
      this.Parent.components_.BasicRigidBody.Destroy()
      
      this._rotationFSM.SetState('Death')
      this._strafeFSM.SetState('Death') 
      this._drawFSM.SetState('Death')
    }
    OnCollision_(m) {
      // This should be used for death aminations

      // damage dealing collision
      // if(collision.EnemyWeapon){
      //     this.Broadcast({topic: 'health.dead'});

      // }
      // if(collision.EnemySpawner && collision.PlayerSpawner){

      // }

      // if (!this.dead_) {
      //   this.dead_ = true;
      //   this.Broadcast({topic: 'health.dead'});
      // }
    }

    Fire_() {
    }

    Update(timeInSeconds) {
      if (this.dead_) {
        return;
      }

      const input = this.Parent.Attributes.InputCurrent;
      if (!input) {
        return;
      }
      this._drawFSM.Update(timeInSeconds, input);
      this._rotationFSM.Update(timeInSeconds, input);
      this._strafeFSM.Update(timeInSeconds, input);
      
      if(this._mixer){
        this._mixer.update(timeInSeconds);
      }

      const velocity = this.velocity_;
  
      const _PARENT_Q = this.Parent.Quaternion.clone();
      const _PARENT_P = this.Parent.Position.clone();

      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = _PARENT_Q.clone();

      let direction = new THREE.Vector3(0, 0, 1).applyQuaternion(_PARENT_Q)
      globalThis.direction = direction
      let target = input.target.clone().sub(_PARENT_P)
      target.y = 0;
      direction.y = 0;
      let anglesin = (direction.clone().cross(target)).dot(new THREE.Vector3(0,1,0))/(direction.length() * target.length())
  
      const acc = this.acceleration_.clone();
      if (input.button2) {
        let velForward = input.inputForward > 0 ? 1.38/0.7333 : input.inputForward < 0 ? -1.38/1.0333 : 0
        let velLeft = input.inputRight > 0 ? -1.8/1.3333 : input.inputRight < 0 ? 1.8/1.2333 : 0
        if(input.button1){
          velForward /= 2
          velLeft /= 2
        }
        velocity.z = velForward * this.scale
        velocity.x = velLeft * this.scale
      }else{
        let velForward = input.inputForward > 0 ? 1.38/0.7333 : input.inputForward < 0 ? -1.38/1.0333 : 0
        let velLeft = input.inputRight > 0 ? -1.8/1.3333 : input.inputRight < 0 ? 1.8/1.2333 : 0
        if(input.button1){
          velForward /= 2
          velLeft /= 2
        }
        velocity.z = velForward * this.scale
        velocity.x = velLeft * this.scale
        
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 0.1*anglesin );
        _R.multiply(_Q);
        
      }
  
      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(_PARENT_Q);
      forward.normalize();
  
      const updown = new THREE.Vector3(0, 1, 0);
      updown.applyQuaternion(_PARENT_Q);
      updown.normalize();

      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(_PARENT_Q);
      sideways.normalize();
      let vel = velocity.clone().multiplyScalar(1.2).applyQuaternion(_PARENT_Q)
      try{
        // likely not scaled correctly...
        this.Parent.components_.BasicRigidBody.body_.body_.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z))
        this.Parent.SetQuaternion(_R);
        this.Parent.components_.BasicRigidBody.body_.body_.activate()
      }catch(e){
        sideways.multiplyScalar(velocity.x * timeInSeconds);
        updown.multiplyScalar(velocity.y * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);
        this.lastTime = timeInSeconds
        
        const pos = _PARENT_P;
        pos.add(forward);
        pos.add(sideways);
        pos.add(updown);

        this.Parent.SetQuaternion(_R);
        this.Parent.SetPosition(pos);
      }
    }
  };
  
  return {
    PlayerController: PlayerController,
  };

})();