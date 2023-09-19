import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { ARButton } from "https://unpkg.com/three@0.120.1/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js";
import { AnimationMixer } from "https://unpkg.com/three@0.120.1/src/animation/AnimationMixer.js";

let loadedModels = [];
let hitTestSource = null;
let hitTestSourceRequested = false;
let glass = {};
// let isMatch = false;

window.glass = glass;
let firstModel;

// 创建Three.js场景
const scene = new THREE.Scene();
// 定义视口的大小
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// 创建一个网格对象reticle，使用环形几何体和随机颜色材质，并将其添加到场景中
let reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() })
);
reticle.visible = false;
reticle.matrixAutoUpdate = false;
scene.add(reticle);

// 创建透视相机，设置视场角、宽高比、近裁剪面和远裁剪面，并设置相机的位置和目标点
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// 创建WebGL渲染器，设置抗锯齿和透明度
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

// 创建WebGL渲染器，并设置其属性
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true;

// 将渲染器的画布添加到HTML页面中
document.body.appendChild(renderer.domElement);
// 添加AR按钮，用于启用AR功能
let startButton = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
});
document.body.appendChild(startButton);
startButton.addEventListener("click", () => {
  scene.remove(firstModel);
  firstModel = null;
});

let controller = renderer.xr.getController(0);
// controller.addEventListener("select", onSelect);
scene.add(controller);

function setupLight() {
  // 添加光源
  addLight(0.4, [2, 2, 0]); // 右上
  addLight(0.4, [-2, 2, 0]); // 左上
  addLight(0.3, [0, 3, 3]); // 正前上
  addLight(0.5, [0, 4, 0]); // 正上
  addLight(0.5, [0, 0, -5]); // 後
}
setupLight();

function addLight(intensity, [x, y, z]) {
  const light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true; // 针对产生阴影的光源进行设置
  light.position.set(x, y, z);
  scene.add(light);
}

function createGltf() {
  let gltfLoader = new GLTFLoader();
  gltfLoader.load("/models/wineglass.glb", (gltf) => {
    glass.gltf = gltf;
    glass.animation = gltf.animations[0];
    glass.model = gltf.scene;
    ``;
    // 遍历模型的子对象，将其材质设置为玻璃材质
    glass.model.traverse((child) => {
      if (child.isMesh) {
        const glassMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xffffff), // 设置为白色
          transparent: true,
          opacity: 0.5,
          roughness: 0.5,
          metalness: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.0,
        });
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = glassMaterial;
      }
    });

    // addFirstGlassToScene
    firstModel = glass.model.clone();
    firstModel.position.set(0, -3, -10);
    firstModel.scale.set(0.5, 0.5, 0.5); // 調整模型的大小
    firstModel.rotation.y = Math.floor(Math.random() * 6) + 1;
    firstModel.name = "glass-model-first";
    addGlassModelToScene(firstModel);
  });
}

createGltf();

function addGlassModelToScene(model) {
  loadedModels.push(model);
  scene.add(model);

  // 创建AnimationMixer并将模型的动画添加到混合器中
  const mixer = new AnimationMixer(model);
  model.mixer = mixer;
  const action = mixer.clipAction(glass.animation);
  action.loop = THREE.LoopOnce; // 设置动画循环为一次
  // action.loop = THREE.LoopRepeat; // 设置动画循环为無限次
  action.play();

  // 更新混合器的时间
  function animate() {
    if (!isMatch) {
      requestAnimationFrame(animate);
      return;
    }
    // 检查动画是否超过了一次动画的总时长
    let step = 0.01;
    if (mixer.time + step < glass.animation.duration) {
      mixer.update(0.01); // 可以调整时间步长以控制动画速度
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }

  if (isMatch) {
    animate();
    matched();
    console.log("animate playing");
    isMatch = false;
  }
}

document.querySelector("#play").addEventListener("click", () => {
  isMatch = true;
});
document.querySelector("#create").addEventListener("click", () => {
  if (firstModel) {
    firstModel.mixer.stopAllAction(); // 暂停所有动画
    // scene.remove(firstModel);
    // firstModel = null;
    // countdownTimer();
  }
  onSelect();
});

function onSelect() {
  if (reticle.visible) {
    addMoreGlass();
  }
}

function addMoreGlass() {
  // 添加新的模型
  let model = glass.model.clone();
  model.position.setFromMatrixPosition(reticle.matrix);
  model.scale.set(0.02, 0.02, 0.02); // 調整模型的大小
  model.name = "glass-model-" + (loadedModels.length + 1);
  model.rotation.y = Math.floor(Math.random() * 6) + 1;
  addGlassModelToScene(model);
  counterSpan.textContent++;
}

// 渲染循环函数，用于更新场景和相机的渲染
renderer.setAnimationLoop(render);
function render(timestamp, frame) {
  if (frame) {
    // 获取参考空间和会话对象
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (session) {
      // 检查AR会话是否已启动
      const isARSessionStarted =
        session.isARSession && session.isARSessionStarted;

      // 根据AR会话的状态显示或隐藏播放按钮
      if (isARSessionStarted) {
        // document.getElementById("counterSpan").style.display = "none";
        // document.getElementById("timer").style.display = "none";
      } else {
        // document.getElementById("counterSpan").style.display = "block";
        document.getElementById("timer").style.display = "block";
        document.getElementById("play").style.display = "block";
        document.getElementById("create").style.display = "block";
        document.querySelector(".canvas-container").style.display = "block";
        document.querySelector(".listen").style.display = "block";
        document.querySelector("#restart").style.display = "block";
        document.querySelector("#match-note").style.display = "block";
        document.querySelector("#matchTest").style.display = "block";
      }
    }

    // 请求用于击中测试的参考空间
    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then((referenceSpace) => {
        // 请求用于击中测试的源
        session
          .requestHitTestSource({ space: referenceSpace })
          .then((source) => (hitTestSource = source));
      });

      hitTestSourceRequested = true;

      // 监听会话结束事件，重置击中测试相关的变量
      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });
    }

    // 进行击中测试，更新网格对象reticle的位置和可见性
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
  // 渲染场景
  renderer.render(scene, camera);
}
// 监听窗口大小变化事件，更新相机和渲染器的尺寸
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

async function getSound() {
  // await fetch(`${import.meta.env.VITE_BACKEND_URL}/sound`);
  console.log(`${import.meta.env.VITE_BACKEND_URL}/sound`);
}
