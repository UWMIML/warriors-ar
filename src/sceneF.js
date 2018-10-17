import * as THREE from 'three';
import {
  ArToolkitSource,
  ArToolkitContext,
  ArMarkerControls,
} from 'node-ar.js';
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbit-controls';
import sceneGLTF from './sceneF.gltf';
import markerPattern from './patterns/letterF.patt';
import cameraParam from './camera_para.dat';

const ready = cb => {
  /in/.test(document.readyState) // in = loadINg
    ? setTimeout(ready.bind(null, cb), 9)
    : cb();
}

ready(function() {
  let mixer;
  const clock = new THREE.Clock();
  const [ windowWidth, windowHeight ] = [ window.innerWidth, window.innerHeight ];
  // Set up renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(windowWidth, windowHeight);
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  document.body.appendChild(renderer.domElement);

  // Set up scene
  const scene = new THREE.Scene();

  // Add light to scene
  const hemlight = new THREE.HemisphereLight(0xfff0f0, 0x606066, 0.5);
  const spotlight = new THREE.SpotLight(0xffffff);
  hemlight.position.set(10, 10, 10);
  spotlight.position.set(10000, 10000, 10000);
  scene.add(hemlight);
  scene.add(spotlight);

  // Add camera
  const camera = new THREE.Camera();
  camera.position.z = 10;

  // Controls
  const _orbitControls = OrbitControls(THREE);
  const controls = new _orbitControls(camera);

  // Set up AR
  const _artoolkitsource = ArToolkitSource(THREE);
  const arToolkitSource = new _artoolkitsource({
    sourceType: 'webcam'
  });
  arToolkitSource.init(() => onResize());

  const arToolkitContext = new ArToolkitContext({
    cameraParametersUrl: cameraParam,
    detectionMode: 'mono',
    maxDetectionRate: 30,
    canvasWidth: 80 * 3,
    canvasHeight: 60 * 3
  });
  arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  // Update dimensions on resize
  window.addEventListener('resize', () => onResize());
  function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if(arToolkitContext.arController){
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
  }

  // Build Mesh
  const markerRoot = new THREE.Group;
  scene.add(markerRoot);

  const markerControls = new ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: markerPattern,
    changeMatrixMode: 'cameraTransformMatrix'
  });
  // Prepare geometries and meshes
  const loader = new GLTFLoader();
  loader.load(sceneGLTF, gltf => {
    const object = gltf.scene;
    object.rotateX(21);
    object.rotateY(42);
    object.translateY(-10);
    const gltfAnimation = gltf.animations;
    markerRoot.add(object);
    object.traverse(node => {
      if(node.material){
        // Modify the material here
      }
    });
    if(gltfAnimation && gltfAnimation.length) {
      mixer = new THREE.AnimationMixer(object);
      gltfAnimation.forEach(animation => {
        mixer.clipAction(animation).play();
      });
    }
  });
  animate();

  // render scene
  function render() {
    if(mixer) mixer.update(0.75 * clock.getDelta());
    if(arToolkitSource.ready) {
      arToolkitContext.update(arToolkitSource.domElement);
      scene.visible = camera.visible;
    }
    renderer.render(scene, camera);
  }
  function animate() {
    renderer.setAnimationLoop(render);
  }
});
