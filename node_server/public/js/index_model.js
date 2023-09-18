import * as THREE from "three";
import { GLTFLoader } from "https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.147.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene(); // 建立場景物件

let measureSizeStyle = getComputedStyle(measureSize);
console.log(measureSizeStyle.width, measureSizeStyle.height);
const sizes = {
  width: +measureSizeStyle.width.replace("px", ""),
  height: +measureSizeStyle.height.replace("px", ""),
};

let loadedModels = [];

let gltfLoader = new GLTFLoader();
gltfLoader.load("/models/wineglass.glb", onLoad);

function onLoad(gltf) {
  const model = gltf.scene;
  loadedModels.push(model);

  // 创建玻璃材质
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    roughness: 0.5,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.0,
  });

  // 设置模型的材质
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = glassMaterial;
    }
  });

  model.scale.set(0.3, 0.3, 0.3);
  scene.add(model); // 将模型添加到场景中
}

function setupLight() {
  // 添加光源
  addLight(0.5, [2, 2, 0]); // 右上
  addLight(0.5, [-2, 2, 0]); // 左上
  addLight(0.3, [0, 3, 3]); // 正前上
  addLight(0.5, [0, 4, 0]); // 正上
  addLight(0.4, [0, 0, -5]); // 後
}
setupLight();

function addLight(intensity, [x, y, z]) {
  const light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true; // 针对产生阴影的光源进行设置
  light.position.set(x, y, z);
  scene.add(light);
}

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
); // 建立透視相機，設定視角、寬高比、近平面和遠平面
camera.position.set(0, 5, 5); // 設定相機位置
camera.lookAt(new THREE.Vector3(0, 0, 0)); // 設定相機觀察點為原點
scene.add(camera); // 將相機添加到場景中

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
}); // 建立 WebGL 渲染器物件，開啟抗鋸齒效果和 alpha 通道

renderer.setSize(sizes.width, sizes.height); // 設定渲染器尺寸為視窗寬度和高度
renderer.setPixelRatio(window.devicePixelRatio); // 根據視窗的設備像素比例來設定渲染器的畫素比
renderer.xr.enabled = true; // 啟用 WebXR 渲染器

document.body.appendChild(renderer.domElement); // 將渲染器的畫布元素添加到網頁的 body 元素中

renderer.setAnimationLoop(render); // 設定渲染循環，每一幀更新時呼叫 render 函數

const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();

  loadedModels.forEach((model) => {
    model.rotation.y = elapsedTime * 1; // 控制 y 轴自旋转速度
    model.rotation.x = elapsedTime * 0.2; // 控制 x 轴自旋转速度
    model.rotation.z = elapsedTime * 0.3; // 控制 z 轴自旋转速度
  });

  renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 启用阻尼效果，使相机平滑过渡
controls.update();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth; // 更新視窗寬度
  sizes.height = window.innerHeight; // 更新視窗高度

  camera.aspect = sizes.width / sizes.height; // 更新相機的寬高比
  camera.updateProjectionMatrix(); // 更新相機的投影矩陣

  renderer.setSize(sizes.width, sizes.height); // 更新渲染器的尺寸
  renderer.setPixelRatio(window.devicePixelRatio); // 更新渲染器的畫素比
});
