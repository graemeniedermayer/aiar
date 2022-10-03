// const 2200 = 2200;
// const LoopRepeat = 2201;
// const LoopPingPong = 2202;


// Soo I've started strongly coupling playercontroller and state is that okay?
// playerinput and playercontrollers need to be separate.
export const enemy_state = (() => {

    // ._parent._parent is code smell.
      class State {
        constructor(parent) {
          this._parent = parent;
        }
      
        Enter() {}
        Exit() {}
        Update() {}
      };
      class StrikeState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'strike';
        }
      
        Enter(prevState) {
          // random number between 0-5 (eventually do math to decide?)
          deathNum = 1
          this._action = this._parent._parent._animations[`strike`];
          this._action.loop = 2200;
          this._action.play();
          
        }
      
        Exit() {
        }
      
        Update(_) {
        }
      };


      class IdleStrikeState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'idlestrike';
        }
      
        Enter(prevState) {
          // random number between 0-5 (eventually do math to decide?)
          deathNum = 1
          this._action = this._parent._parent._animations[`strike`];
          this._action.loop = 2200;
          this._action.stop();
          
        }
      
        Exit() {
        }
      
        Update(_) {
        }
      };
    
      class DeathState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'death1';
        }
      
        Enter(prevState) {
          // random number between 0-5 (eventually do math to decide?)
          deathNum = 1
          this._action = this._parent._parent._animations[`death${deathNum}`];
          this._action.loop = 2200;
          this._action.play();
          
        }
      
        Exit() {
        }
      
        Update(_) {
        }
      };
    
      class IdleState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'idle';
        }
      
        Enter(prevState) {
          // this._action = this._parent._parent._animations['idle'];
          this._action = this._parent._parent._animations['strike'];
          if (prevState) {
            const prevAction = this._parent._parent._animations[prevState.Name];
    
            this._action.enabled = true;
      
            if (prevState?.Name !== 'strike' ) {
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
            this._parent.SetState('Left');
            return;
          }
          if (input.inputRight > 0) {
            this._parent.SetState('Right');
            return;
          }
          if (input.inputForward > 0) {
            this._parent.SetState('Forward');
            return;
          }
          if (input.inputForward < 0) {
            this._parent.SetState('Backward');
            return;
          }
    
          if (input.inputForward == 0 && input.inputRight==0) {
            this._parent.SetState('Idle');
          }
          return;
        }
      };
      
      
      class LeftState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'left';
        }
      
        Enter(prevState) {
          this._action = this._parent._parent._animations['left'];
          if (prevState) {
            const prevAction = this._parent._parent._animations[prevState.Name];
      
            this._action.enabled = true;
      
            if (prevState.Name !== 'left' ) {
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
            if (input.inputRight < 0) {
              return;
            }
            if (input.inputForward > 0) {
              this._parent.SetState('Forward');
              return;
            }
            if (input.inputForward < 0) {
              this._parent.SetState('Backward');
              return;
            }
            if (input.inputForward == 0 && input.inputRight==0) {
              this._parent.SetState('Idle');
            }
            return;
    
        }
      };
      class RightState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'right';
        }
      
        Enter(prevState) {
          this._action = this._parent._parent._animations['right'];
          if (prevState) {
            const prevAction = this._parent._parent._animations[prevState.Name];
      
            this._action.enabled = true;
      
            if (prevState?.Name !== 'right' ) {
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
          if (input.inputRight > 0) {
            return;
          }
          if (input.inputForward > 0) {
            this._parent.SetState('Forward');
            return;
          }
          if (input.inputForward < 0) {
            this._parent.SetState('Backward');
            return;
          }
          if (input.inputForward == 0 && input.inputRight==0) {
            this._parent.SetState('Idle');
          }
          return;
        }
      };
      class ForwardState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'forward';
        }
      
        Enter(prevState) {
          this._action = this._parent._parent._animations['forward'];
          if (prevState) {
            const prevAction = this._parent._parent._animations[prevState.Name];
      
            this._action.enabled = true;
      
            if (prevState?.Name !== 'forward' ) {
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
            this._parent.SetState('Left');
            return;
          }
          if (input.inputRight > 0) {
            this._parent.SetState('Right');
            return;
          }
          if (input.inputForward > 0) {
            return;
          }
          if (input.inputForward == 0 && input.inputRight==0) {
            this._parent.SetState('Idle');
          }
          return;
        }
      };
      class BackwardState extends State {
        constructor(parent) {
          super(parent);
      
          this._action = null;
        }
      
        get Name() {
          return 'backward';
        }
      
        Enter(prevState) {
          this._action = this._parent._parent._animations['backward'];
          if (prevState) {
            const prevAction = this._parent._parent._animations[prevState.Name];
      
            this._action.enabled = true;
      
            if (prevState?.Name !== 'backward' ) {
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
            this._parent.SetState('Left');
            return;
          }
          if (input.inputRight > 0) {
            this._parent.SetState('Right');
            return;
          }
          if (input.inputForward < 0) {
            return;
          }
          if (input.inputForward == 0 && input.inputRight==0) {
            this._parent.SetState('Idle');
          }
          return;
        }
      };
    
      return {
        RightState: RightState,
        LeftState:  LeftState,
        ForwardState: ForwardState,
        BackwardState:BackwardState,
        IdleState:IdleState,
      
        StrikeState: StrikeState,
        IdleStrikeState: IdleStrikeState,
      
        DeathState: DeathState
      };
    })();
