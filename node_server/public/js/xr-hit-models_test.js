import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { ARButton } from "https://unpkg.com/three@0.120.1/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js";
import { AnimationMixer } from "https://unpkg.com/three@0.120.1/src/animation/AnimationMixer.js";

let loadedModels = [];
let hitTestSource = null;
let hitTestSourceRequested = false;

let gltfLoader = new GLTFLoader();
gltfLoader.load("/models/wineglass.glb", onLoad);

function onLoad(gltf) {
  loadedModels.push(gltf.scene);
  // 遍历模型的子对象，将其材质设置为玻璃材质
  gltf.scene.traverse((child) => {
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
  // 添加光源
  const light1 = new THREE.PointLight(0xffffff, 0.4);
  light1.position.set(2, 2, 0); //右上
  scene.add(light1);
  const light2 = new THREE.PointLight(0xffffff, 0.4);
  light2.position.set(-2, 2, 0); // 左上
  scene.add(light2);
  const light3 = new THREE.PointLight(0xffffff, 0.5);
  light3.position.set(0, 3, 3); // 正前上
  scene.add(light3);
  const light4 = new THREE.PointLight(0xffffff, 0.5);
  light2.position.set(0, 4, 0); // 正上
  scene.add(light4);
  const light5 = new THREE.PointLight(0xffffff, 0.5);
  light3.position.set(0, 0, -5); // 後
  scene.add(light5);
  // 针对产生阴影的光源进行设置
  light1.castShadow = true;
  light2.castShadow = true;
  light3.castShadow = true;
  light4.castShadow = true;
  light5.castShadow = true;

  // 创建AnimationMixer并将模型的动画添加到混合器中
  const mixer = new AnimationMixer(gltf.scene);
  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.loop = THREE.LoopOnce; // 设置动画循环为一次
    action.play();
  });
  function animate() {
    requestAnimationFrame(animate);

    // 检查动画是否超过了一次动画的总时长
    const duration = mixer.time;
    const totalDuration = gltf.animations.reduce(
      (total, clip) => total + clip.duration,
      0
    );
    if (duration >= totalDuration) {
      mixer.stopAllAction(); // 暂停所有动画
    } else {
      mixer.update(0.01); // 可以调整时间步长以控制动画速度
      renderer.render(scene, camera);
    }
  }
  document.querySelector("#play").addEventListener("click", () => animate());
}
// function animate() {
//   requestAnimationFrame(animate);

//   if (currentModel) {
//     const mixer = new AnimationMixer(currentModel);

//     // 检查动画是否超过了一次动画的总时长
//     const duration = mixer.time;
//     const totalDuration = mixer._actions.reduce(
//       (total, action) => total + action._clip.duration,
//       0
//     );
//     if (duration >= totalDuration) {
//       mixer.stopAllAction(); // 暂停所有动画
//       scene.remove(currentModel);
//       currentModel = null;
//     } else {
//       mixer.update(0.01); // 可以调整时间步长以控制动画速度
//       renderer.render(scene, camera);
//     }
//   }
// }

// // 更新混合器的时间
// function animate() {
//   requestAnimationFrame(animate);

//   // 检查动画是否超过了一次动画的总时长
//   const duration = mixer.time;
//   const totalDuration = gltf.animations.reduce(
//     (total, clip) => total + clip.duration,
//     0
//   );
//   if (duration >= totalDuration) {
//     mixer.stopAllAction(); // 暂停所有动画
//   } else {
//     mixer.update(0.01); // 可以调整时间步长以控制动画速度
//     renderer.render(scene, camera);
//   }
// }
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

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);
document.body.appendChild(
  ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
);

let controller = renderer.xr.getController(0);
controller.addEventListener("select", onSelect);
scene.add(controller);

let currentModel = null;

function onSelect() {
  if (reticle.visible && !currentModel) {
    // 添加新的模型
    let randomIndex = Math.floor(Math.random() * loadedModels.length);
    let model = loadedModels[randomIndex].clone();
    model.position.setFromMatrixPosition(reticle.matrix);
    model.scale.set(0.02, 0.02, 0.02);
    model.name = "model";
    scene.add(model);

    currentModel = model;
  }
}

renderer.setAnimationLoop(render);

function render(timestamp, frame) {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (session) {
      // 检查AR会话是否已启动
      const isARSessionStarted =
        session.isARSession && session.isARSessionStarted;

      // 根据AR会话的状态显示或隐藏播放按钮
      if (isARSessionStarted) {
        document.getElementById("play").style.display = "none";
      } else {
        document.getElementById("play").style.display = "block";
      }
    }

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
  renderer.render(scene, camera);
}

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
