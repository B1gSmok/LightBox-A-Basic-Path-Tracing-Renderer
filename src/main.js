import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WebGLPathTracer } from 'three-gpu-pathtracer';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-6, 6, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Add a basic object
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
// const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

const geo = new THREE.TorusKnotGeometry(0.6, 0.15, 100, 16);
const mat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 1,
  clearcoat: 1,
  roughness: 0.3, // slightly higher
clearcoatRoughness: 0.2

});
const mesh = new THREE.Mesh(geo, mat);
mesh.position.z=-0.8
mesh.position.y=-1.2
mesh.rotation.x -= 23 
scene.add(mesh);

const wall = {
  "hight":6,
  "width":6,
  "depth":0.1,
}
// 1. Back wall
const backWallGeo = new THREE.BoxGeometry(wall.hight, wall.width, wall.depth);
const wallMat = new THREE.MeshPhysicalMaterial({
  color: 0x888888,
  metalness: 0,
  roughness: 0.8,
clearcoatRoughness: 0.2

});

const backWall = new THREE.Mesh(backWallGeo, wallMat);
backWall.position.z = -3.05;
scene.add(backWall);

// 2. Floor (rotated flat)
const floorGeo = new THREE.BoxGeometry(wall.hight, wall.width, wall.depth);
const floor = new THREE.Mesh(floorGeo, wallMat);
floor.rotation.x = -Math.PI / 2; // rotate 90° to lie flat
floor.position.y = -3.05;
scene.add(floor);

// 3. Front wall (opposite to back wall)
const frontWallGeo = new THREE.BoxGeometry(wall.hight, wall.width /2, wall.depth);
const frontWall = new THREE.Mesh(frontWallGeo, wallMat);
frontWall.position.z = 3.05; // opposite side of back wall
frontWall.position.y = -1.55; // opposite side of back wall
scene.add(frontWall);


const lightGeo = new THREE.SphereGeometry(0.2);
const lightMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: new THREE.Color(1, 1, 1),
  emissiveIntensity: 1
});
const lightMesh = new THREE.Mesh(lightGeo, lightMat);
lightMesh.position.set(2, 2, 0);
scene.add(lightMesh);


// Mark it as an emissive light source for the path tracer



// Path Tracer
const pathTracer = new WebGLPathTracer(renderer);
pathTracer.setScene(scene, camera);

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



const sampleCounter = document.createElement('div');
sampleCounter.style.position = 'absolute';
sampleCounter.style.top = '10px';
sampleCounter.style.left = '10px';
sampleCounter.style.color = 'white';
sampleCounter.style.background = 'rgba(0,0,0,0.5)';
sampleCounter.style.padding = '5px';
sampleCounter.style.fontFamily = 'monospace';
sampleCounter.style.zIndex = '999';
document.body.appendChild(sampleCounter);


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  pathTracer.renderSample();
  sampleCounter.innerText = `Samples: ${pathTracer.samples}`;
}

animate();
