import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbit-controls';
import sceneB from './sceneB.gltf';
import sceneD from './sceneD.gltf';
import sceneE from './sceneE.gltf';
import sceneF from './sceneF.gltf';

window.onload = function() {
  const models = [
    { name: 'sceneB', scene: sceneB, zoom: 20, y: -10 },
    { name: 'sceneD', scene: sceneD, zoom: 15, y: -3.8 },
    { name: 'sceneE', scene: sceneE, zoom: 26, y: -3.8 },
    { name: 'sceneF', scene: sceneF, zoom: 24, y: -3.8 },
  ];
  models.forEach(model => {
    const thisCanvas = document.querySelector(`#${model.name}`);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: thisCanvas
    });
    renderer.setClearColor(0xFAFAFA);
    
    const scene = new THREE.Scene();

    const hemlight = new THREE.HemisphereLight(0xfff0f0, 0x606066, 0.5);
    const spotlight = new THREE.SpotLight(0xffffff);
    hemlight.position.set(10, 10, 10);
    spotlight.position.set(10000, 10000, 10000);
    scene.add(hemlight);
    scene.add(spotlight);

    const camera = new THREE.PerspectiveCamera(45, thisCanvas.getBoundingClientRect().width/300, 1, 1000);
    camera.position.z = model.zoom;

    const root = new THREE.Group;

    const loader = new GLTFLoader();
    loader.load(model.scene, gltf => {
      const object = gltf.scene;
      object.rotateY(40);
      object.translateY(model.y);
      root.add(object);
    });
    scene.add(root);
    animate();

    function render() {
      root.rotation.y += 0.005;
      renderer.render(scene, camera);
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }
  });
}