import './OBJLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.classList.add('butterfly');

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("img/texture.jpg"), side: THREE.DoubleSide});
const cube = new THREE.Mesh(cubeGeometry, material);
camera.position.z = 5;

var loader = new THREE.OBJLoader();

loader.load('butterfly.obj', object => {
  object.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material = material;
    }
  });
  object.scale.set(0.02, 0.02, 0.02);
  scene.add(object);
  window.object = object;
});
window.scene = scene;

function render() {
  requestAnimationFrame(render);

  object.position.x = Math.sin(+new Date() / 700);
  object.position.y = Math.cos(+new Date() / 1000) - 1;
  object.position.z = Math.cos(+new Date() / 800);
  object.rotateX(Math.sin(+new Date() / 700)/100);

  renderer.render(scene, camera);
}
render();
