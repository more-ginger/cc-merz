// SCENE
let scene = new THREE.Scene();
scene.background = new THREE.Color("#a6a6a6");
scene.fog = new THREE.FogExp2(scene.background, 0.02);

// CAMERA
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// RENDERER
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// make sure the scene adjusts to the browser window size
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// CONTROLS FOR NAVIGATION
let controls = new THREE.OrbitControls(camera, renderer.domElement);

// GEOMETRY
// ICOSAHEDRON
let icosaGeometry = new THREE.IcosahedronGeometry(1.5, 0);
let icosaMaterial = new THREE.MeshPhongMaterial({ color: 0xaa5e82, roughness: 0.2 });
let mesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh.castShadow = true;
// add the mesh to the scene
scene.add(mesh);

//ICOSAHEDRON 2
let icosaGeometry_2 = new THREE.IcosahedronGeometry(2.0, 0); //radius, detail
let material_2 = new THREE.MeshPhongMaterial({ color: 0x2d2d2d, wireframe: true });
let icosa_2 = new THREE.Mesh(icosaGeometry_2, material_2);
scene.add(icosa_2);

// FLOOR
let planeGeometry = new THREE.PlaneBufferGeometry(300, 300);
let planeMaterial = new THREE.MeshPhongMaterial({ color: "#9c9595", depthWrite: false });
let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = -10;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// LIGHTING
// AMBIENT
let ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // (color, intensity)
// add the ambient light to the scene
scene.add(ambientLight);

// POINTLIGHT
let pointLight = new THREE.PointLight(0xc9efff, 0.8);
pointLight.position.set(0, 4, 2);
// shadow settings
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 600;
pointLight.shadow.radius = 10;

// add the point light to the scene
scene.add(pointLight);

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
// add the point light helper to the scene
scene.add(pointLightHelper);

// GUI
let gui = new dat.GUI({ width: 300 });
gui.open();

// get the default value
let parameters = {
  material: icosaMaterial.color.getHex(),
  light_color: pointLight.color.getHex(),
  positionX: mesh.position.x,
};

gui.addColor(parameters, "material").onChange(function (val) {
  icosaMaterial.color.setHex(val);
});
gui.addColor(parameters, "light_color").onChange(function (val) {
  pointLight.color.setHex(val);
});
gui.add(parameters, "positionX", -4.0, 4.0).onChange(function (val) {
  mesh.position.x = val;
});

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.004;
  mesh.rotation.y += 0.007;

  icosa_2.rotation.x += 0.008;
  icosa_2.rotation.z += 0.005;

  controls.update();
  renderer.render(scene, camera);
}
animate();
