// SCENE
let scene = new THREE.Scene();
scene.background = new THREE.Color('#a6a6a6');
scene.fog = new THREE.FogExp2(scene.background, 0.02);

// CAMERA
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// RENDERER
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// make sure the scene adjusts to the browser window size
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// CONTROLS FOR NAVIGATION
let controls = new THREE.OrbitControls(camera, renderer.domElement);

// GEOMETRY
// We store all the meshes we want to be "clickable" in an Array
let meshes = [];
// ICOSAHEDRON 01
let icosaGeometry = new THREE.IcosahedronGeometry(1.0, 0);
let icosaMaterial = new THREE.MeshPhongMaterial({ color: 0xaa5e82, roughness: 0.2 });
let mesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh.position.x = -5;
mesh.castShadow = true;
// add the mesh to the scene
scene.add(mesh);
// We push the new mesh into the "Click-Array"
meshes.push(mesh);
// Here we add a callback function, this is what happens once we click it!
mesh.callback = () => alert("Click click");

// ICOSAHEDRON 02
let mesh2 = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh2.position.x = -2.5;
mesh2.castShadow = true;
// add the mesh to the scene
scene.add(mesh2);
// We push the new mesh into the "Click-Array"
meshes.push(mesh2);
// Here we add a callback function, this is what happens once we click it!
mesh2.callback = () => alert("You clicked the right one: Let me tell you about a great investment oppurunity ...");

// ICOSAHEDRON 03
let mesh3 = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh3.position.x = 0;
mesh3.castShadow = true;
// add the mesh to the scene
scene.add(mesh3);
// We push the new mesh into the "Click-Array"
meshes.push(mesh3);
// Here we add a callback function, this is what happens once we click it!
mesh3.callback = () => alert("Nice to see you!");

// ICOSAHEDRON 04
let mesh4 = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh4.position.x = 2.5;
mesh4.castShadow = true;
// add the mesh to the scene
scene.add(mesh4);
// We push the new mesh into the "Click-Array"
meshes.push(mesh4);
// Here we add a callback function, this is what happens once we click it!
mesh4.callback = () => alert("Don't click too hard, I'm sensitive ..");

// ICOSAHEDRON 05
let mesh5 = new THREE.Mesh(icosaGeometry, icosaMaterial);
mesh5.position.x =  5;
mesh5.castShadow = true;
// add the mesh to the scene
scene.add(mesh5);
// We push the new mesh into the "Click-Array"
meshes.push(mesh5);
// Here we add a callback function, this is what happens once we click it!
mesh5.callback = () => alert("Hey there!");

// We initialize the Raycasting functionality once all the logic is set
initRaycasting();

// FLOOR
let planeGeometry = new THREE.PlaneBufferGeometry(300, 300);
let planeMaterial = new THREE.MeshPhongMaterial({ color: '#9c9595', depthWrite: false });
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


function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.007;

    mesh2.rotation.x += 0.004;
    mesh2.rotation.y += 0.007;


    mesh3.rotation.x += 0.004;
    mesh3.rotation.y += 0.007;

    mesh4.rotation.x += 0.004;
    mesh4.rotation.y += 0.007;

    mesh5.rotation.x += 0.004;
    mesh5.rotation.y += 0.007;

    controls.update();
    renderer.render(scene, camera);
}
animate();

function objectClickHandler() {
    console.log(this);
}


function initRaycasting() {
    // The logic here is simple:
    // When we click on the scene, a Ray is shot from the camera
    // We then check if the Ray intersects something
    // if what is "hit" aka intersected, is part of our Array holding all the clickable objects, we execute the callback
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // See https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
    // Handle all clicks to determine of a three.js object was clicked and trigger its callback
    function onDocumentMouseDown(event) {
        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        meshObjects = meshes;
        //meshObjects = audioDiamonds;
        //meshObjects = [mesh]; // three.js objects with click handlers we are interested in

        var intersects = raycaster.intersectObjects(meshObjects);

        if (intersects.length > 0) {
            intersects[0].object.callback();
        }

    }

    document.addEventListener('mousedown', onDocumentMouseDown, false);

    // Support for touch 

    function onDocumentTouchDown(event) {
        event.preventDefault();

        mouse.x = (event.changedTouches[0].pageX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y =  - (event.changedTouches[0].pageY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        meshObjects = meshes;
        //meshObjects = audioDiamonds;
        //meshObjects = [mesh]; // three.js objects with click handlers we are interested in

        var intersects = raycaster.intersectObjects(meshObjects);

        if (intersects.length > 0) {
            intersects[0].object.callback();
        }

    }

    document.addEventListener('touchstart', onDocumentTouchDown, false);
};
