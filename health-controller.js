import {THREE} from './three-defs.js';

import {entity} from './entity.js';


export const health_controller = (() => {

  class HealthController extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    InitEntity() {
      this.Parent.Attributes.health = this.params_.maxHealth;
      this.Parent.Attributes.maxHealth = this.params_.maxHealth;
      this.Parent.Attributes.dead = false;
    }

    InitComponent() {
      this.RegisterHandler_('player.hit', (m) => { this.OnHit_(m); });
      this.RegisterHandler_('physics.collision', (m) => { this.OnCollision_(m); });
    }

    OnCollision_() {
      if (this.Parent.Attributes.dead) {
        return;
      }

      if (this.params_.ignoreCollisions) {
        return;
      }
    }

    OnHit_(msg) {
      if (this.Parent.Attributes.dead) {
        return;
      }
      spawner.Spawn(this.Parent);
      // msg.value
      this.TakeDamage_(20);
    }

    TakeDamage_(dmg) {
      this.Parent.Attributes.health -= dmg;

      // extra knockback from damage?
      this.Broadcast({
        topic: 'health.damage', 
        amount:dmg, 
        // direction:{x:0,y:0,z:0}
      });

      if (this.Parent.Attributes.health <= 0) {
        this.Parent.Attributes.dead = true;
        this.Broadcast({topic: 'health.dead'});
        this.Parent.SetDead(true);
        const e = this.FindEntity('spawners').GetComponent('ExplosionSpawner').Spawn(this.Parent.Position);
        e.Broadcast({topic: 'health.dead'});
      }
    }

    Update(_) {
    }
  };

  return {
    HealthController: HealthController
  };
})();
