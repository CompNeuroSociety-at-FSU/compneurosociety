// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Camera controls
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// GLTF loader
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Scene and Camera Setup
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

// Renderer Setup
const container = document.getElementById("brain-container");
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x999999, 1.5);
scene.add(ambientLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Load GLTF Model
let object;
const loader = new GLTFLoader();
loader.load(
  'brain_realistic_free/scene.gltf',
  function (gltf) {
    object = gltf.scene;

    // Center
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    box.getCenter(center);
    object.position.sub(center);

    // Normalize scale
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim; // Scale to fit within 2 units max
    object.scale.setScalar(scale);
    object.scale.set(1, 1, 1);
    // MRI effect setup
    object.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        child.material.emissiveIntensity = 0.7;
        child.userData.mriPhase = Math.random() * Math.PI * 2;
      }
    });

    scene.add(object);
    console.log('GLTF object loaded, centered, and scaled.');
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Error loading GLTF:", error);
  }
);


// Helper: interpolate between two colors
function lerpColor(a, b, t) {
  return a.clone().lerp(b, t);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (object) {
    object.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        const period = 3000;
        const time = (performance.now() + (child.userData.mriPhase || 0) * 1000) % period;
        const t = 0.5 * (1 - Math.cos((2 * Math.PI * time) / period));
        const yellow = new THREE.Color(0xffff00);
        const blue = new THREE.Color(0x0000ff);
        child.material.emissive = lerpColor(blue, yellow, t);
      }
    });
  }

  controls.update(); // Required when damping is enabled
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
