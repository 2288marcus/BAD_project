import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

let hitTestSource = null; // 儲存擊中測試的源
let hitTestSourceRequested = false; // 標記是否已經請求擊中測試源

const scene = new THREE.Scene(); // 創建場景

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}; // 視窗大小

const light = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(light); // 創建環境光源並添加到場景中

let reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() })
);
reticle.visible = false;
reticle.matrixAutoUpdate = false;
scene.add(reticle); // 創建瞄準器並添加到場景中

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera); // 創建相機並添加到場景中

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
}); // 創建渲染器

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true; // 設定渲染器的大小和像素比例，並啟用WebXR

document.body.appendChild(renderer.domElement);
document.body.appendChild(
  ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
); // 將渲染器的DOM元素和AR按鈕添加到網頁中

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff * Math.random(),
}); // 創建方塊的幾何體和材質

let controller = renderer.xr.getController(0);
controller.addEventListener("select", onSelect);
scene.add(controller); // 獲取第一個控制器，並添加到場景中

function onSelect() {
  if (reticle.visible) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.setFromMatrixPosition(reticle.matrix);
    cube.name = "cube";
    scene.add(cube); // 在瞄準器的位置創建方塊並添加到場景中
  }
}

renderer.setAnimationLoop(render); // 執行渲染循環

function render(timestamp, frame) {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then((referenceSpace) => {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then((source) => (hitTestSource = source));
      });

      hitTestSourceRequested = true;

      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }

  scene.children.forEach((object) => {
    if (object.name === "cube") {
      object.rotation.y += 0.01;
    }
  }); // 旋轉方塊

  renderer.render(scene, camera); // 渲染場景和相機
}

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
}); //以上程式碼是一個使用Three.js和WebXR的示例，用於在AR環境中擺放方塊。
