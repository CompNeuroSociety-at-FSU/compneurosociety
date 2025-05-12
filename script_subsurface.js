import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
import {OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';



		let container, stats;
		let camera, scene, renderer;
		let model;
        let model2;
		const lights = {};
		let lowerBound;
		let upperBound;
		let textMesh;
		let renderingEnabled = true;
		let animationFrameId = null;

	

		const canvas = document.getElementById('canvas');
		const lightNames = ['fp1', 'fp2', 'fz', 'f3', 'f4', 'f7', 'f8', 'fc1', 'fc2', 'fc5', 'fc6' , 'cz', 'c3', 'c4', 't3', 't4', 'a1' ,'a2', 'cp1', 'cp2', 'cp5', 'cp6', 'pz', 'p3','p4', 't5', 't6', 'po3', 'po4', 'oz', 'o1', 'o2'];

		function createLight(name) {
			const lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.001, 8, 8), new THREE.MeshBasicMaterial({ color: 0xc1c100 }));
			const pointLight = new THREE.PointLight(0xc1c100, 0.5, 50, 0);
			lightMesh.add(pointLight); 
			scene.add(lightMesh);
			return lightMesh;
}

	
		let globalEEGData = null;
		let currentDataPoint = 0; 
		let videoClipIndex = 0;
	let interpolationFrames = 30;
	let progressBar, progressBarBackground;
		let maxDataPoints = 0;

	const fontLoader = new FontLoader();

	

	function updateText(newText, font) {
		if (textMesh) {
			scene.remove(textMesh); // Remove the existing text mesh
		}
		const textGeometry = new TextGeometry(newText, {
			font: font,
			size: 40,
			height: 10,
			curveSegments: 12,
			bevelEnabled: false,
			bevelThickness: 3,
			bevelSize: 5,
			bevelOffset: 1,
			bevelSegments: 10
		});
		const textMaterial = new THREE.MeshBasicMaterial({ color: 0xc1c100 });
		textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh.position.set(-300, 200, 0); // Adjust position as needed
		scene.add(textMesh);
	}

		
		
	window.addEventListener('DOMContentLoaded', () => {
		init();
		onWindowResize();
	
		fontLoader.load('https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
			updateText(" ", font);
		});
	
		animate();
	
		const toggleCheckbox = document.getElementById("toggle-brain-model");
		if (toggleCheckbox) {
			toggleCheckbox.addEventListener("change", () => {
				renderingEnabled = toggleCheckbox.checked;
				if (renderingEnabled) {
					if (model) model.visible = true;
					if (model2) model2.visible = true;
					renderer.domElement.style.display = "block";
					animate(); // restart loop
				} else {
					cancelAnimationFrame(animationFrameId); // stop loop
					if (model) model.visible = false;
					if (model2) model2.visible = false;
					renderer.domElement.style.display = "none";
				}
			});
		}
	});
	
	

		function init() {
			// Use the existing container
			container = document.getElementById('brain-container');

			camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
			camera.position.set( 0.0, 300, -250 ); // x, y, z
			camera.lookAt( 0, 0, 0 );

			scene = new THREE.Scene();
			scene.background = null; // Transparent background

			// Lights
			const ambient_light = new THREE.AmbientLight( 0xc1c1c1 , 2)
			scene.add( ambient_light );
			// createProgressBar(); 

			
		
			
		lightNames.forEach(name => {
			lights[name] = createLight(name);
		});
		lightNames.forEach(name => {
			if (lights[name] && lights[name].children[0]) {
				lights[name].currentIntensity = lights[name].children[0].intensity;
				lights[name].targetIntensity = lights[name].children[0].intensity;
			}
		});
		// Fetch the EEG data
		fetch('eeg_data_10ex.json')
			.then((response) => response.json())
			.then((eegData) => {
				globalEEGData = eegData; // Store the data in the global variable
					// Flatten the EEG data to find percentiles
				const flatEEGData = flattenEEGData(globalEEGData);
				const percentiles  = findPercentiles(flatEEGData, 5, 95); // Using 5th and 95th percentiles
				lowerBound = percentiles.lowerBound;
				upperBound = percentiles.upperBound;
				maxDataPoints = globalEEGData[videoClipIndex][0].length;
				

			})
			.catch((error) => {
				console.error("Error fetching EEG data:", error);
			});

		


			
		
		lights['fp1'].position.set(-33, -16, -102);
		lights['fp2'].position.set(33, -16, -102);

		lights['f7'].position.set(-60, -16, -60);
		lights['f8'].position.set(60, -16, -60);


		lights['f3'].position.set(-40, 30, -60);
		lights['f4'].position.set(40, 30, -60);

		lights['fz'].position.set(0, 50, -60);
		lights['pz'].position.set(0, 60, 70);
		
		lights['a1'].position.set(-90, -16, 0);
		lights['a2'].position.set(90, -16, 0);


		lights['t3'].position.set(-66, 0, 0);
		lights['t4'].position.set(66, 0, 0);


		lights['c3'].position.set(-60, 50, 0);
		lights['cz'].position.set(0, 80, 0);
		lights['c4'].position.set(60, 40, 0);
		
		
		lights['t5'].position.set(-80,-10, 30);
		lights['p3'].position.set(-60, 50, 70);
	
		lights['p4'].position.set(60, 50, 70);
		lights['t6'].position.set(80,-10, 30);
		lights['o1'].position.set(-40, -10, 90);
		lights['o2'].position.set(40, -10, 90);
		lights['oz'].position.set(0, -5, 100);
		lights['fc1'].position.set(-25, 50, -30);
		lights['fc2'].position.set(25, 50, -30);
		lights['fc5'].position.set(-60, 20, -20);
		lights['fc6'].position.set(60, 20, -20);
		lights['cp1'].position.set(-25, 60, 40);
		lights['cp2'].position.set(25, 60, 40);
		lights['cp5'].position.set(-50, 40, 50);
		lights['cp6'].position.set(50, 40, 50);

		lights['po3'].position.set(-30, 15, 80);
		lights['po4'].position.set(30, 15, 80);
		



			renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true }); // Enable alpha
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(600, 600); // Match your CSS size
			renderer.setClearColor(0x000000, 0); // Transparent clear color (alpha = 0)

			camera.aspect = 1; // Keep aspect ratio square for 600x600
			camera.updateProjectionMatrix();
			renderer.setSize(600, 600);

            // Helpers
        const axesHelper = new THREE.AxesHelper( 1000);
        axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff); // R, G, B
        // scene.add(axesHelper);

			// stats = new Stats();
			// container.appendChild( stats.dom );

			const controls = new OrbitControls( camera, container );
			controls.minDistance = 500;
			controls.maxDistance = 3000;
			controls.enablePan = false;
			controls.enableZoom = false;

			window.addEventListener( 'resize', onWindowResize );

			initMaterial();

		}

		function initMaterial() {

			const loader = new THREE.TextureLoader();
			const imgTexture = loader.load('white.jpg');
			imgTexture.colorSpace = THREE.SRGBColorSpace;

			const thicknessTexture = loader.load('white.jpg');
			imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;

			const shader = SubsurfaceScatteringShader;
			const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			uniforms[ 'map' ].value = imgTexture;

            //default values
			uniforms[ 'diffuse' ].value = new THREE.Vector3( 1.0, 0.2, 0.2 );
			uniforms[ 'shininess' ].value = 500;
            
            // default color values
			uniforms[ 'thicknessMap' ].value = thicknessTexture;
			uniforms[ 'thicknessColor' ].value = new THREE.Vector3( 0.5, 0.3, 0.0 );


			uniforms[ 'thicknessDistortion' ].value = 0.25;
			uniforms[ 'thicknessAmbient' ].value = 0.0;
			uniforms[ 'thicknessAttenuation' ].value = 0.1;
			uniforms[ 'thicknessPower' ].value = 2.0;
			uniforms[ 'thicknessScale' ].value = 25.0;

			const material = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader,
				lights: true
			} );
			material.extensions.derivatives = true;

			// LOADER

            const loaderOBJ = new OBJLoader();
            loaderOBJ.load('brain_model.obj', function ( object ) {
                model = object.children[ 0 ];
                model.position.set( 0, 0, 0 );
                model.scale.setScalar( 50);
                model.material = material;

               model2 = model.clone();
                model2.scale.x *= -1;


                scene.add( model );
                scene.add( model2);
               

            } );
			//initGUI( uniforms );

		}


		function flattenEEGData(eegData) {
			return eegData.flat(2); // Flatten the 3D array into a 1D array
		}
		
		function findPercentiles(data, lowerPercentile, upperPercentile) {
			const sortedData = [...data].sort((a, b) => a - b);
			const lowerIndex = Math.floor(lowerPercentile / 100.0 * (sortedData.length - 1));
			const upperIndex = Math.floor(upperPercentile / 100.0 * (sortedData.length - 1));
			
			return {'lowerBound' : sortedData[lowerIndex],
			'upperBound' : sortedData[upperIndex] };
		}
		
		function normalizeValue(value, lowerBound, upperBound) {	
			
			return  (10 - (-10)) * ((value - lowerBound)/(upperBound - lowerBound)) - 10;
		}
		
		
		

	
	function updateLightIntensities() {
		if (!globalEEGData || !globalEEGData.length) return;
	
		const numberOfElectrodes = 32;
		if (currentDataPoint < globalEEGData[videoClipIndex][0].length) {
			// updateProgressBar(); 
			for (let i = 0; i < numberOfElectrodes; i++) {
				if (lights[lightNames[i]] && lights[lightNames[i]].children[0]) {
					const electrodeData = globalEEGData[videoClipIndex][i];
					const rawIntensity = electrodeData[currentDataPoint];
					lights[lightNames[i]].targetIntensity = normalizeValue(rawIntensity, lowerBound, upperBound);
	
					// Perform linear interpolation
					lights[lightNames[i]].currentIntensity += (lights[lightNames[i]].targetIntensity - lights[lightNames[i]].currentIntensity) / interpolationFrames;
					lights[lightNames[i]].children[0].intensity = lights[lightNames[i]].currentIntensity;
				}
			}
			currentDataPoint++;
		}
	}

		function onWindowResize() {
			camera.aspect = 1; // Keep aspect ratio square for 600x600
			camera.updateProjectionMatrix();
			renderer.setSize(600, 600);
		}

		//

		function animate() {
			if (!renderingEnabled) return;
			animationFrameId = requestAnimationFrame(animate);
			render();
		}
		

		function render() {

		
			updateLightIntensities();


			renderer.render( scene, camera );

		}