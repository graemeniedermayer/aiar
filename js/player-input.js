import {entity} from "./entity.js";
import {THREE} from './three-defs.js';


export const player_input = (() => {

  class PlayerInput extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }
  
    InitEntity() {
      this.Parent.Attributes.InputCurrent = {
        inputForwards: 0.0,
        inputRight: 0.0,
        button1: false,
        button2: false,
        target: new THREE.Vector3(0,0,0)
      };
      this.Parent.Attributes.InputPrevious = {
        ...this.Parent.Attributes.InputCurrent};
      // controller = document.getElementById('controller')
      document.getElementById("up-control").addEventListener('touchstart', e=>{
        this.Parent.Attributes.InputCurrent.inputForward = 1.0;
      }, false);
      document.getElementById("down-control").addEventListener('touchstart', e=>{
        this.Parent.Attributes.InputCurrent.inputForward = -1.0;
      }, false);
      document.getElementById("left-control").addEventListener('touchstart', e=>{
        this.Parent.Attributes.InputCurrent.inputRight = -1.0;
      }, false);
      document.getElementById("right-control").addEventListener('touchstart', e=>{
        this.Parent.Attributes.InputCurrent.inputRight = 1.0;
      }, false);
      document.getElementById("button1").addEventListener('touchstart', e=>{
        this.Parent.Attributes.InputCurrent.button1 = true;
      }, false);
      document.getElementById("up-control").addEventListener('touchend', e=>{
        this.Parent.Attributes.InputCurrent.inputForward = 0.0;
      }, false);
      document.getElementById("down-control").addEventListener('touchend', e=>{
        this.Parent.Attributes.InputCurrent.inputForward = 0.0;
      }, false);
      document.getElementById("left-control").addEventListener('touchend', e=>{
        this.Parent.Attributes.InputCurrent.inputRight = 0.0;
      }, false);
      document.getElementById("right-control").addEventListener('touchend', e=>{
        this.Parent.Attributes.InputCurrent.inputRight = 0.0;
      }, false);
      document.getElementById("button1").addEventListener('touchend', e=>{
        this.Parent.Attributes.InputCurrent.button1 = false;
      }, false);
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2( 0, 0);

      setInterval(() => {
        raycaster.setFromCamera( mouse, globalThis.camera );
        let intersects = raycaster.intersectObjects( [globalThis.plane] );
        if (intersects[0]){
          this.Parent.Attributes.InputCurrent.target = intersects[0].point
        }
      }, 1000/60);
      // document.getElementById("button2").addEventListener('touchend', e=>{
      //   this.Parent.Attributes.InputCurrent.space = false;
      // }, false);
      document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
      document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }
  
    OnKeyDown_(event) {
      if (event.currentTarget.activeElement != document.body) {
        return;
      }
    }
  
    OnKeyUp_(event) {
      if (event.currentTarget.activeElement != document.body) {
        return;
      }
    }

    Update(_) {
      this.Parent.Attributes.InputPrevious = {
          ...this.Parent.Attributes.InputCurrent};
    }
  };

  return {
    PlayerInput: PlayerInput,
  };

})();