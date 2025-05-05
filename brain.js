// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .obj file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
scene.background = null; // Transparent background
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000); //

let object;
let controls;
let animationFrameId; // Store the animation frame ID
const loader = new GLTFLoader();

// Load the GLTF file
loader.load(
  'brain_realistic_free/scene.gltf',
  function (gltf) {
    object = gltf.scene;
    object.position.set(0, 0, 0); // Center the object
    scene.add(object);
    // Store all mesh materials for MRI effect
    object.traverse((child) => {
      if (child.isMesh && child.material) {
        // Ensure the material supports emissive
        if (child.material.emissive) {
          child.material.emissiveIntensity = 0.7;
          // Assign a random phase for MRI activity
          child.userData.mriPhase = Math.random() * Math.PI * 2;
        }
      }
    });
    console.log('GLTF object loaded:', object); // Debug log
  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);

// Get the container's size
const container = document.getElementById("brain-container");
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(containerWidth, containerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

camera.aspect = containerWidth / containerHeight;
camera.updateProjectionMatrix();

camera.position.set(0, 0, 4); // Move camera closer to the object for a zoomed-in view
camera.lookAt(0, 0, 0); // Ensure camera looks at the model

// Use only ambient light:
const ambientLight = new THREE.AmbientLight(0x999999, 1.5); // Grey ambient light
scene.add(ambientLight);

// Add controls to the camera, so we can rotate/zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

// Helper: interpolate between two colors
function lerpColor(a, b, t) {
  return a.clone().lerp(b, t);
}

// Render the scene
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  // MRI activity simulation
  if (object) {
    object.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        // Gradually shift from yellow to blue every 3 seconds
        const period = 3000; // 3 seconds in ms
        const time = (performance.now() + (child.userData.mriPhase || 0) * 1000) % period;
        const t = 0.5 * (1 - Math.cos((2 * Math.PI * time) / period)); // Smooth oscillation between 0 and 1
        const yellow = new THREE.Color(0xffff00);
        const blue = new THREE.Color(0x0000ff);
        child.material.emissive = lerpColor(blue, yellow, t);
      }
    });
  }
  renderer.render(scene, camera);
}

// Update resize event to use container size
window.addEventListener("resize", function () {
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

animate();

