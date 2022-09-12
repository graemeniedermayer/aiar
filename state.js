
export const player_state = (() => {
// ._parent._parent is code smell.
  class State {
    constructor(parent) {
      this._parent = parent;
    }
  
    Enter() {}
    Exit() {}
    Update() {}
  };

  class DeathState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'death';
    }
  
    Enter(prevState) {
      // random number between 0-5 (eventually do math to decide?)
      deathNum = 0
      this._action = this._parent._parent._animations[`death${deathNum}`];
      this._action.loop = THREE.LoopOnce;
      this._action.play();
      
    }
  
    Exit() {
    }
  
    Update(_) {
    }
  };

  class DrawState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'Draw';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['draw'];
      this._action.loop = THREE.LoopOnce;
      this._action.play();
      if(prevAction.Name!='DrawIdle'){
        const prevAction = this._parent._parent._animations[prevState.Name];
        prevAction.stop()
      }
    }
  
    Exit() {
    }
  
    Update(_) {
      if( !this._action.isRunning() ){
        // unblocked firing?
        this._parent.SetState('AimIdle');
      }
    }
  };

  class RecoilState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'Recoil';
    }
  
    Enter(prevState) {
      const prevAction = this._parent._parent._animations[prevState.Name];
      
      this._action = this._parent._parent._animations['recoil'];
      this._action.loop = THREE.LoopOnce;
      this._action.play();
      if(prevAction.Name!='DrawIdle'){
        const prevAction = this._parent._parent._animations[prevState.Name];
        prevAction.stop()
      }
    }
  
    Exit() {
    }
  
    Update(_) {

      if( !this._action.isRunning() ){
        this._parent.SetState('Drawing');
      }
    }
  };

  class DrawIdleState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'DrawIdle';
    }
  
    Enter(prevState) {
      if(prevAction.Name!='DrawIdle'){
        const prevAction = this._parent._parent._animations[prevState.Name];
        prevAction.stop()
      }
    }
  
    Exit() {
    }
  
    Update(_) {

      if( input.actionButton1){
        // block action button
        this._parent.SetState('Drawing');
      }
    }
  };

  class AimIdleState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'AimIdle';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimleft'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name !== 'AimLeft') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
      
    }
  
    Exit() {
    }
  
    Update(_) {

      if( input.actionButton1){
        // block action button
        this._parent.SetState('Drawing');
      }
    }
  };
  
  
  class AimLeftState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'AimLeft';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimleft'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name !== 'AimLeft') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
        if (!input) {
          return;
        }
    // aome concept of momentum?
        if (input.inputRight < 0) {
          this._parent.SetState('AimLeft');
          return;
        }
        if (input.inputRight > 0) {
          this._parent.SetState('AimRight');
          return;
        }
        if (input.inputForward > 0) {
          this._parent.SetState('AimForward');
          return;
        }
        if (input.inputForward < 0) {
          this._parent.SetState('AimBackward');
          return;
        }
        this._parent.SetState('AimIdle');
        return;

    }
  };
  class AimRightState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'AimRight';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimright'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name !== 'AimRight') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
      if (!input) {
        return;
      }
  // aome concept of momentum?
      if (input.inputRight < 0) {
        this._parent.SetState('AimLeft');
        return;
      }
      if (input.inputRight > 0) {
        this._parent.SetState('AimRight');
        return;
      }
      if (input.inputForward > 0) {
        this._parent.SetState('AimForward');
        return;
      }
      if (input.inputForward < 0) {
        this._parent.SetState('AimBackward');
        return;
      }
      this._parent.SetState('AimIdle');
      return;
    }
  };
  class AimForwardState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'AimForward';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimforwards'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name !== 'AimForward') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
      if (!input) {
        return;
      }
  // aome concept of momentum?
      if (input.inputRight < 0) {
        this._parent.SetState('AimLeft');
        return;
      }
      if (input.inputRight > 0) {
        this._parent.SetState('AimRight');
        return;
      }
      if (input.inputForward > 0) {
        this._parent.SetState('AimForward');
        return;
      }
      if (input.inputForward < 0) {
        this._parent.SetState('AimBackward');
        return;
      }
      this._parent.SetState('AimIdle');
      return;
    }
  };
  class AimBackwardState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'AimBackward';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimbackwards'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name !== 'AimBackward') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
      if (!input) {
        return;
      }
  // aome concept of momentum?
      if (input.inputRight < 0) {
        this._parent.SetState('AimLeft');
        return;
      }
      if (input.inputRight > 0) {
        this._parent.SetState('AimRight');
        return;
      }
      if (input.inputForward > 0) {
        this._parent.SetState('AimForward');
        return;
      }
      if (input.inputForward < 0) {
        this._parent.SetState('AimBackward');
        return;
      }
      this._parent.SetState('AimIdle');
      return;
    }
  };
  
class RotateRightState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'RotateRight';
    }
    Enter(prevState){

    }
    Exit() {
    }
  
    Update(_, input) {
      // if (!input) {
      //   return;
      // }
      // // aome concept of momentum?
      if (input.leftButton > 0) {
        this._parent.SetState('RotateLeft');
        return;
      }
      // idle instead
      if (input.rightButton > 0) {
        this._parent.SetState('RotateRight');
        return;
      }
      this._parent.SetState('RotateIdle');
      return;
      
  }
};
class RotateLeftState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'RotateLeft';
  }
  Enter(prevState){

  }
  Exit() {
  }

  Update(_, input) {
    // if (!input) {
    //   return;
    // }
    // // aome concept of momentum?
    if (input.leftButton > 0) {
      this._parent.SetState('RotateLeft');
      return;
    }
    // idle instead
    if (input.rightButton > 0) {
      this._parent.SetState('RotateRight');
      return;
    }
    this._parent.SetState('RotateIdle');
    return;
    
  }
};
class RotateIdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'RotateRight';
  }
  Enter(prevState){

  }
  Exit() {
  }

  Update(_, input) {
    // if (!input) {
    //   return;
    // }
    // // aome concept of momentum?
    if (input.leftButton > 0) {
      this._parent.SetState('RotateLeft');
      return;
    }
    // idle instead
    if (input.rightButton > 0) {
      this._parent.SetState('RotateRight');
      return;
    }
    this._parent.SetState('RotateIdle');
    return;
    
  }
};

  return {
    AimRightState: AimRightState,
    AimLeftState:  AimLeftState,
    AimForwardState: AimForwardState,
    AimBackwardState:AimBackwardState,

    RotateRightState: RotateRightState,
    RotateLeftState: RotateLeftState,
    RotateIdleState: RotateIdleState,

    DrawState: DrawState,
    RecoilState: RecoilState,
    AimingState: AimingState,

    DeathState: DeathState
  };

})();
