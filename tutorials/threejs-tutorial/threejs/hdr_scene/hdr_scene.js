// SCENE
let scene = new THREE.Scene();


// CAMERA
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// RENDERER
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// set the color encoding of the renderer to properly display the HDR map
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);

// make sure the scene adjusts to the browser window size
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// CONTROLS FOR NAVIGATION
let controls = new THREE.OrbitControls(camera, renderer.domElement);

// HDR SETUP
const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.load('pretville_street_1k.hdr', function (texture) {
    // APPLYING THE HDR TO THE ENVIVRONMENT
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    // You could also NOT use the texture as the background, so just use it for the reflections on the material!
    // scene.background = new THREE.Color('#000000');
    scene.environment = texture;
});

// GEOMETRY
// ICOSAHEDRON
let icosaGeometry = new THREE.IcosahedronGeometry(1.5, 0);
let icosaMaterial = new THREE.MeshPhysicalMaterial({ color: 0xaa5e82, roughness: 0.0,  metalness: 1.0 }); // We need a PHYSICAL material now, to make use of the reflections of the envivronment!
let mesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh.castShadow = true;
// add the mesh to the scene
scene.add(mesh);

// GUI
let gui = new dat.GUI({ width: 300 });
gui.open();

// get the default value
let parameters = {
    materialColor: icosaMaterial.color.getHex(),
    materialMetalness: icosaMaterial.metalness,
    materialRoughness: icosaMaterial.roughness
};

gui.addColor(parameters, 'materialColor').onChange(function (val) {
    icosaMaterial.color.setHex(val);
});
gui.add(parameters, 'materialMetalness', 0.0, 1.0).onChange(function (val) {
    icosaMaterial.metalness = val;
});
gui.add(parameters, 'materialRoughness', 0.0, 1.0).onChange(function (val) {
    icosaMaterial.roughness = val;
});

function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.007;

    controls.update();
    renderer.render(scene, camera);
}
animate();