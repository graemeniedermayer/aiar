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
      return 'death0';
    }
  
    Enter(prevState) {
      // random number between 0-5 (eventually do math to decide?)
      deathNum = 0
      this._action = this._parent._parent._animations[`death${deathNum}`];
      this._action.loop = 2200;
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
      return 'drawbow';
    }
  
    Enter(prevState) {
      if(prevState){
        const prevAction = this._parent._parent._animations[prevState.Name];
        this._action = this._parent._parent._animations['drawbow'];
        this._action.loop = 2200;
        this._action.play();
        if(prevAction && prevAction.Name!='idledraw'){
          prevAction.stop()
        }
      }
    }
  
    Exit() {
    }
  
    Update(_) {
      if( !this._action.isRunning() ){
        // unblocked firing?
        this._parent.SetState('DrawIdle');
      }
    }
  };

  class RecoilState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'recoil';
    }
  
    Enter(prevState) {
      if(prevState){
        const prevAction = this._parent._parent._animations[prevState.Name];
        
        this._action = this._parent._parent._animations['recoil'];
        this._action.loop = 2200;
        this._action.play();
        if(prevState.Name!='idledraw'){

          prevAction.stop()
        }
      }
    }
  
    Exit() {
    }
  
    Update(_,input) {

      if( !this._action.isRunning() ){
        this._parent.SetState('Draw');
      }
    }
  };


  class DrawIdleState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'idledraw';
    }
  
    Enter(prevState) {
      if(prevState && prevState.Name!='idledraw'){
        const prevAction = this._parent._parent._animations[prevState.Name];   
        this._action = this._parent._parent._animations['idledraw'];
        
        if(prevState.Name!='idledraw'){

          prevAction.stop()
        }
      }
      
    }
  
    Exit() {
    }
  
    Update(_,input) {

      if( input && input.button1){
        // block action button
        this._parent.SetState('Recoil');
      }
    }
  };

  class AimIdleState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'idlebow';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['idlebow'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];

        this._action.enabled = true;
  
        if (prevState?.Name !== 'idlebow' ) {
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

      if (input.inputForward == 0 && input.inputRight==0) {
        this._parent.SetState('AimIdle');
      }
      return;
    }
  };
  
  
  class AimLeftState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'aimleft';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimleft'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name !== 'aimleft' ) {
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
        if (input.inputForward == 0 && input.inputRight==0) {
          this._parent.SetState('AimIdle');
        }
        return;

    }
  };
  class AimRightState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'aimright';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimright'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState?.Name !== 'aimright' ) {
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
      if (input.inputForward == 0 && input.inputRight==0) {
        this._parent.SetState('AimIdle');
      }
      return;
    }
  };
  class AimForwardState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'aimforwards';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimforwards'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState?.Name !== 'aimforwards' ) {
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
      if (input.inputForward == 0 && input.inputRight==0) {
        this._parent.SetState('AimIdle');
      }
      return;
    }
  };
  class AimBackwardState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'aimbackwards';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['aimbackwards'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState?.Name !== 'aimbackwards' ) {
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
      if (input.inputForward == 0 && input.inputRight==0) {
        this._parent.SetState('AimIdle');
      }
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
      if (!input) {
        return;
      }
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
    if (!input) {
      return;
    }
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

    // this._action = this._parent._parent._animations['empty'];

  }
  Exit() {
  }

  Update(_, input) {
    if (!input) {
      return;
    }
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
    AimIdleState:AimIdleState,
  
    RotateRightState: RotateRightState,
    RotateLeftState: RotateLeftState,
    RotateIdleState: RotateIdleState,
  
    DrawState: DrawState,
    RecoilState: RecoilState,
    // OverdrawState: OverdrawState,
    DrawIdleState: DrawIdleState,
  
    DeathState: DeathState
  };
})();
