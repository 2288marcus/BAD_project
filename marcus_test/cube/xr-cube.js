import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

const scene = new THREE.Scene(); // 建立場景物件

const sizes = {
  width: window.innerWidth, // 視窗寬度
  height: window.innerHeight, // 視窗高度
};

const light = new THREE.AmbientLight(0xffffff, 1.0); // 建立環境光源物件，顏色為白色，強度為 1.0
scene.add(light); // 將環境光源物件添加到場景中

const geometry = new THREE.BoxGeometry(1, 1, 1); // 建立立方體的幾何體，寬度、高度和深度各為 1
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff * Math.random(), // 建立材質物件，顏色為隨機生成的白色
});
const cube = new THREE.Mesh(geometry, material); // 建立網格物體，使用立方體的幾何體和材質
cube.position.set(0, 0, -2); // 設定立方體的位置
scene.add(cube); // 將立方體網格物體添加到場景中

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
); // 建立透視相機，設定視角、寬高比、近平面和遠平面
camera.position.set(0, 2, 5); // 設定相機位置
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
document.body.appendChild(ARButton.createButton(renderer)); // 創建並添加 AR 按鈕到網頁中，用於啟用擴增實境

renderer.setAnimationLoop(render); // 設定渲染循環，每一幀更新時呼叫 render 函數

function render() {
  cube.rotation.y += 0.01; // 更新立方體物體的旋轉
  renderer.render(scene, camera); // 使用渲染器渲染場景和相機
}

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth; // 更新視窗寬度
  sizes.height = window.innerHeight; // 更新視窗高度

  camera.aspect = sizes.width / sizes.height; // 更新相機的寬高比
  camera.updateProjectionMatrix(); // 更新相機的投影矩陣

  renderer.setSize(sizes.width, sizes.height); // 更新渲染器的尺寸
  renderer.setPixelRatio(window.devicePixelRatio); // 更新渲染器的畫素比
});
