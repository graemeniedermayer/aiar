import {entity} from "./entity.js";
import {globals} from "./globals.js";
import {THREE, RenderPass, EffectComposer} from './three-defs.js';

// This is a little messy. I need to review JS context/scope

export const xr_component = (() => {

    // scoping get a little confusing with all the promises so this avoid global scope
let thisScope = {
    xrLightProbe: null,
    xrRefSpace: null,
    reflectionchange: false,
    renderTarget: null
}

class XRController extends entity.Component {
    constructor(renderer, params) {
      super();

      let {camera, scene} = params;
      this.renderer_ = renderer;
      this.camera_ = camera;
      this.scene_ = scene;
      this.xrLightProbe_ = null;
    //   global variables are the bestest of best variables.
      globalThis.camera = this.camera_
      globalThis.renderer = this.renderer_
      globalThis.scene = this.scene_
      this.options = {
        requiredFeatures: [ 'dom-overlay', 'light-estimation'],//'depth-sensing'
        domOverlay: { root: document.body },
        // depthSensing: {
        //   usagePreference: ["cpu-optimized"],
        //   dataFormatPreference: ["luminance-alpha"]
        // }
      };

      const size = renderer.getSize( new THREE.Vector2() );
      let pixelRatio = renderer.getPixelRatio();
      let width = size.width;
      let height = size.height;
      thisScope.renderTarget =  new THREE.WebGLRenderTarget(  width * pixelRatio, height * pixelRatio )
    }
    Options(options) {
        this.options = options
    }

    InitEntity() {
        // construct AR button

        this.button = document.createElement( 'button' );
        this.button.id = 'ArButton'
        this.button.textContent = 'ENTER AR' ;
        this.button.style.cssText+= `position: absolute;top:80%;left:40%;width:20%;height:2rem;`;

        document.body.appendChild(this.button)
        document.getElementById('ArButton').addEventListener('click',x=>this.InitAR())
    }
    
    getXRSessionInit( mode, options) {
        if ( options && options.referenceSpaceType ) {
            this.renderer_.xr.setReferenceSpaceType( options.referenceSpaceType );
        }
        var space = (options || {}).referenceSpaceType || 'local-floor';
        var sessionInit = (options && options.sessionInit) || {};
    
        // Nothing to do for default features.
        if ( space == 'viewer' )
            return sessionInit;
        if ( space == 'local' && mode.startsWith('immersive' ) )
            return sessionInit;
    
        // If the user already specified the space as an optional or required feature, don't do anything.
        if ( sessionInit.optionalFeatures && sessionInit.optionalFeatures.includes(space) )
            return sessionInit;
        if ( sessionInit.requiredFeatures && sessionInit.requiredFeatures.includes(space) )
            return sessionInit;
    
        var newInit = Object.assign( {}, sessionInit );
        newInit.requiredFeatures = [ space ];
        if ( sessionInit.requiredFeatures ) {
            newInit.requiredFeatures = newInit.requiredFeatures.concat( sessionInit.requiredFeatures );
        }
        return newInit;
     }

    onSessionEnded( /*event*/ ){
        let onSessionEnded = this.onSessionEnded
        currentSession.removeEventListener( 'end', onSessionEnded );
        this.renderer_.xr.setSession( null );
        currentSession = null;
    }

    onSessionStarted( session, context ){
        let onSessionEnded = context.onSessionEnded
        session.addEventListener( 'end', onSessionEnded );
        context.renderer_.xr.setSession( session );
        context.button.style.display = 'none';
        context.button.textContent = 'EXIT AR';

        session.requestReferenceSpace('local').then((refSpace) => {
            thisScope.xrRefSpace = refSpace;
            session.requestLightProbe().then((lightProbe) => {
                thisScope.xrLightProbe = lightProbe;
                thisScope.xrLightProbe.addEventListener('reflectionchange', () => thisScope.reflectionChanged = true);
            }).catch(err => console.error(err));
            session.requestAnimationFrame(context.InitRender);
          });
    }

    InitAR(){
        let currentSession = null;
        if ( currentSession === null ) {
            var sessionInit = this.getXRSessionInit( 'immersive-ar', {
                mode: 'immersive-ar',
                referenceSpaceType: 'local', // 'local-floor'
                sessionInit: this.options
            });
            navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( x=>{this.onSessionStarted(x, this)} );
        } else {
            currentSession.end();
        }
        this.renderer_.xr.addEventListener('sessionstart',
            (ev) => {
                console.log('sessionstart', ev);
                document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                this.renderer_.domElement.style.display = 'none';
            });
        this.renderer_.xr.addEventListener('sessionend',
            (ev) => {
                console.log('sessionend', ev);
                document.body.style.backgroundColor = '';
                this.renderer_.domElement.style.display = '';
            });
    }
    InitRender(initt, initframe){
        // renderer.setRenderTarget(thisScope.renderTarget)
        let composer = new EffectComposer( renderer, thisScope.renderTarget)
        const renderPass = new RenderPass( scene, camera );
        composer.addPass( renderPass );
        let Render = (t, frame) => {
            renderer.shadowMap.needsUpdate = true;
            const session = frame.session;
            session.requestAnimationFrame(Render);

	        composer.render()
            // renderer.render( scene, camera );
            let baseLayer = session.renderState.baseLayer;
            const pose = frame.getViewerPose(thisScope.xrRefSpace);
            if (pose) {
              for (const view of pose.views) {
                const viewport = baseLayer.getViewport(view);
                let gl = renderer.getContext()
                gl.viewport(viewport.x, viewport.y,
                    viewport.width, viewport.height);
                if(thisScope.xrLightProbe){
                    let estimate = frame.getLightEstimate(thisScope.xrLightProbe);
                    if (estimate) {
                      lightProbe.sh.fromArray(estimate.sphericalHarmonicsCoefficients);
                      lightProbe.intensity = 1;
                    
                      const intensityScalar =
                        Math.max(1.0,
                        Math.max(estimate.primaryLightIntensity.x,
                        Math.max(estimate.primaryLightIntensity.y,
                                 estimate.primaryLightIntensity.z)));
                        
                      directionalLight.color.setRGB(
                        estimate.primaryLightIntensity.x / intensityScalar,
                        estimate.primaryLightIntensity.y / intensityScalar,
                        estimate.primaryLightIntensity.z / intensityScalar);

                      directionalLight.intensity = intensityScalar;
                      directionalLight.position.copy(estimate.primaryLightDirection);

                    } else {
                      console.log("light estimate not available");
                    }
                    if (thisScope.reflectionChanged) {
                        let glBinding = new XRWebGLBinding(session, gl);

                        const cubeMap = glBinding.getReflectionCubeMap(thisScope.xrLightProbe);
                        if (cubeMap) {
                            globalThis.cubeMap = cubeMap
                          let rendererProps = renderer.properties.get( thisScope.renderTarget );
                          rendererProps.__webglTexture = cubeMap;
                        } else {
                          console.log("Cube map not available");
                        }
                        thisScope.reflectionChanged = false;
                    }
                }
              }
            }
              
        }   
        Render(initt,initframe)
    }
    Update(){

    }
}
    return {
        XRController: XRController,
    };
})();