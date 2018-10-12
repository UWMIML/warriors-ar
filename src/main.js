import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbit-controls';
import sceneB from './sceneB.gltf';
import sceneD from './sceneD.gltf';

window.onload = function() {
  const allCanvas = document.querySelectorAll('canvas');
  const sceneBFn = function() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector('#sceneB')
    });
    renderer.setClearColor(0xFAFAFA);
    
    const scene = new THREE.Scene();

    const hemlight = new THREE.HemisphereLight(0xfff0f0, 0x606066, 0.5);
    const spotlight = new THREE.SpotLight(0xffffff);
    hemlight.position.set(10, 10, 10);
    spotlight.position.set(10000, 10000, 10000);
    scene.add(hemlight);
    scene.add(spotlight);

    const camera = new THREE.PerspectiveCamera(45, allCanvas[0].getBoundingClientRect().width/300, 1, 1000);
    camera.position.z = 24;

    const _orbitControls = OrbitControls(THREE);
    const controls = new _orbitControls(camera);

    const loader = new GLTFLoader();
    loader.load(sceneB, gltf => {
      const object = gltf.scene;
      object.rotateY(42);
      object.translateY(-4);
      scene.add(object);
    });
    animate();

    function render() {
      controls.update();
      renderer.render(scene, camera);
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }
  };
  const sceneDFn = function() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector('#sceneD')
    });
    renderer.setClearColor(0xFAFAFA);
    
    const scene = new THREE.Scene();

    const hemlight = new THREE.HemisphereLight(0xfff0f0, 0x606066, 0.5);
    const spotlight = new THREE.SpotLight(0xffffff);
    hemlight.position.set(10, 10, 10);
    spotlight.position.set(10000, 10000, 10000);
    scene.add(hemlight);
    scene.add(spotlight);

    const camera = new THREE.PerspectiveCamera(45, allCanvas[0].getBoundingClientRect().width/300, 1, 1000);
    camera.position.z = 8;

    const _orbitControls = OrbitControls(THREE);
    const controls = new _orbitControls(camera);

    const loader = new GLTFLoader();
    loader.load(sceneD, gltf => {
      const object = gltf.scene;
      object.translateY(-4);
      scene.add(object);
    });
    animate();

    function render() {
      controls.update();
      renderer.render(scene, camera);
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }
  };
  sceneBFn();
  sceneDFn();
}