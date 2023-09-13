import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

let loadedModels = {}; // 存儲加載的模型的對象
let hitTestSource = null; // 儲存擊中測試的源
let hitTestSourceRequested = false; // 標記是否已經請求擊中測試源
let overlayContent = document.getElementById("overlay-content"); // 覆蓋層的內容元素
let selectInput = document.getElementById("model-select"); // 模型選擇的下拉框
let modelName = selectInput.value; // 選擇的模型名稱

selectInput.addEventListener("change", (e) => {
  modelName = e.target.value; // 監聽模型選擇的變化
});

// 創建GLTFLoader和DRACOLoader實例
let gltfLoader = new GLTFLoader();
let dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/"); // 設定DRACO解碼器的路徑
gltfLoader.setDRACOLoader(dracoLoader); // 將DRACOLoader分配給GLTFLoader

// 預先加載模型
gltfLoader.load("/models/banana.gltf", onLoad);
gltfLoader.load("/models/cup.gltf", onLoad);
gltfLoader.load("/models/Cow.gltf", onLoad);
gltfLoader.load("/models/Horse.gltf", onLoad);
// gltfLoader.load("/models/LittlestTokyo.glb", onLoad);
// gltfLoader.load("/models/uploads_files_2530657_ShotCups.glb");

function onLoad(gltf) {
  loadedModels[gltf.scene.name] = gltf.scene; // 將加載的模型存儲到loadedModels對象中

  if (gltf.scene.name === "banana") {
    gltf.scene.scale.set(0.05, 0.05, 0.05); // 設定"banana"模型的縮放大小
  }

  if (gltf.scene.name === "cup") {
    gltf.scene.scale.set(1, 1, 1); // 設定"cup"模型的縮放大小
  }
}

const scene = new THREE.Scene(); // 創建場景

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const light = new THREE.AmbientLight(0xffffff, 1.0); // 創建環境光源
scene.add(light);

let reticle = new THREE.Mesh(
  // 創建瞄準器
  new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() })
);
reticle.visible = false;
reticle.matrixAutoUpdate = false;
scene.add(reticle);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
); // 創建相機
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
}); // 創建渲染器

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true; // 啟用WebXR

document.body.appendChild(renderer.domElement);
document.body.appendChild(
  // 將渲染器的DOM元素和AR按鈕添加到網頁中
  ARButton.createButton(renderer, {
    requiredFeatures: ["hit-test"], // 要求擊中測試功能
    optionalFeatures: ["dom-overlay"], // 可選的DOM覆蓋功能
    domOverlay: { root: overlayContent }, // 將覆蓋層的根元素設定為指定的DOM元素
  })
);

let controller = renderer.xr.getController(0); // 獲取第一個控制器
controller.addEventListener("select", onSelect); // 監聽控制器的選擇事件
scene.add(controller); // 將控制器添加到場景中

function onSelect() {
  if (reticle.visible) {
    let model = loadedModels[modelName].clone(); // 複製選擇的模型
    model.position.setFromMatrixPosition(reticle.matrix); // 設定模型的位置為瞄準器的位置
    // model.scale.set(0.5, 0.5, 0.5); // 設定複製模型的縮放大小
    scene.add(model); // 將模型添加到場景中
  }
}

renderer.setAnimationLoop(render); // 設定渲染循環

function render(timestamp, frame) {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace(); // 獲取參考空間
    const session = renderer.xr.getSession(); // 獲取XR會話

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
      const hitTestResults = frame.getHitTestResults(hitTestSource); // 獲取擊中測試結果
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix); // 更新瞄準器的位置和姿態
      } else {
        reticle.visible = false;
      }
    }
  }

  renderer.render(scene, camera); // 渲染場景和相機
}

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});
