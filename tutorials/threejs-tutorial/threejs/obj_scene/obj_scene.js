// SCENE
let scene = new THREE.Scene();
scene.background = new THREE.Color('#a6a6a6');
// scene.fog = new THREE.FogExp2(scene.background, 0.02);


// CAMERA
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// RENDERER
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

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

// OBJ SETUP
const objMaterial = new THREE.MeshPhongMaterial({ color: 0xaa5e82, flatShading: false, shininess: 100 });
const objLoader = new THREE.OBJLoader();
objLoader.load('lego.obj', function (model) {
    // WHEN the OBJ is loaded, we traverse the vertice groups and add a material
    model.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = objMaterial;
        }
    });

    // Then we set the transformations
    model.position.x = -2.5;
    model.position.y = -2.5;
    model.position.z = 0;
    let scale = 0.1;
    model.scale.x = scale;
    model.scale.y = scale;
    model.scale.z = scale;
    // And add it to the scene
    scene.add(model);
});

// GEOMETRY
// ICOSAHEDRON
let icosaGeometry = new THREE.IcosahedronGeometry(1.5, 0);
let icosaMaterial = new THREE.MeshPhysicalMaterial({ color: 0xaa5e82}); // We need a PHYSICAL material now, to make use of the reflections of the envivronment!
let mesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh.castShadow = true;
// add the mesh to the scene
// scene.add(mesh);

// FLOOR
let planeGeometry = new THREE.PlaneBufferGeometry(300, 300);
let planeMaterial = new THREE.MeshPhongMaterial({ color: '#9c9595', depthWrite: false });
let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = -10;
planeMesh.receiveShadow = true;
// scene.add(planeMesh);

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


function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.007;

    controls.update();
    renderer.render(scene, camera);
}
animate();