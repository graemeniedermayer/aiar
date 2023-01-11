
import {finite_state_machine} from './finite-state-machine.js'
import {player_state} from './state.js'
import {enemy_state} from './enemy-state.js'//split out?
  
export const fsm = (() => {
  class rotationFSM extends finite_state_machine.FiniteStateMachine {
    constructor(params) {
      super(params);
      this._Init();
    }
  
    _Init() {
      this._AddState('RotateLeft', player_state.RotateLeftState);
      this._AddState('RotateRight', player_state.RotateRightState);
      this._AddState('RotateIdle', player_state.RotateIdleState);
      this._AddState('Death', player_state.DeathState);
      }
  };
  // Static states
  class strafeFSM extends finite_state_machine.FiniteStateMachine {
    constructor(params) {
      super(params);
      this._Init();
    }
  
    _Init() {
      this._AddState('AimForward', player_state.AimForwardState);
      this._AddState('AimBackward', player_state.AimBackwardState);
      this._AddState('AimLeft', player_state.AimLeftState);
      this._AddState('AimRight', player_state.AimRightState);
      this._AddState('AimIdle', player_state.AimIdleState);
      this._AddState('Death', player_state.DeathState);
    }
  };
// Transition states?
  class drawFSM extends finite_state_machine.FiniteStateMachine {
    constructor(params) {
      super(params);
      this._Init();
    }
  
    _Init() {
      this._AddState('Draw', player_state.DrawState);
      // this._AddState('Overdraw', player_state.OverdrawState);
      this._AddState('Recoil', player_state.RecoilState);
      this._AddState('DrawIdle', player_state.DrawIdleState);
      this._AddState('Death', player_state.DeathState);
    }
  };
  
  class enemyStrafeFSM extends finite_state_machine.FiniteStateMachine {
    constructor(params) {
      super(params);
      this._Init();
    }
  
    _Init() {
      this._AddState('Forward', enemy_state.ForwardState);
      this._AddState('Backward', enemy_state.BackwardState);
      this._AddState('Left', enemy_state.LeftState);
      this._AddState('Right', enemy_state.RightState);
      this._AddState('Idle', enemy_state.IdleState);
      this._AddState('Death', enemy_state.DeathState);
    }
  };
  
  class enemySlashFSM extends finite_state_machine.FiniteStateMachine {
    constructor(params) {
      super(params);
      this._Init();
    }
  
    _Init() {
      this._AddState('Slash', enemy_state.SlashState);
      this._AddState('IdleSlash', enemy_state.IdleSlashState);
    }
  };
  

  return {
    rotationFSM: rotationFSM,
    strafeFSM: strafeFSM,
    drawFSM: drawFSM,
    
    enemyStrafeFSM: enemyStrafeFSM,
    enemySlashFSM: enemySlashFSM
  };
})();