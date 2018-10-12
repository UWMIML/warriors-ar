import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbit-controls';
import sceneB from './sceneB.gltf';
import sceneD from './sceneD.gltf';
import sceneE from './sceneE.gltf';

window.onload = function() {
  const allCanvas = document.querySelectorAll('canvas');
  const models = [
    { name: 'sceneB', scene: sceneB, zoom: 24 },
    { name: 'sceneD', scene: sceneD, zoom: 15 },
    { name: 'sceneE', scene: sceneE, zoom: 26 },
  ];
  models.forEach(model => {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector(`#${model.name}`)
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
    camera.position.z = model.zoom;


    const loader = new GLTFLoader();
    loader.load(model.scene, gltf => {
      const object = gltf.scene;
      object.rotateY(40);
      object.translateY(-3.5);
      scene.add(object);
    });
    animate();

    function render() {
      renderer.render(scene, camera);
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }
  });
}