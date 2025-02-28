<template>
	<view class="content">
		<view id="threeView"></view> <!-- 用于渲染虚拟人 -->
		<view class="chat-bar"> <!-- 对话栏 -->
			<text class="chat-text">虚拟人正在说话...</text>
		</view>
	</view>
</template>
<script module="three" lang="renderjs">
	const THREE = require('static/three/build/three.min.js');
	import {
		OrbitControls
	} from 'static/three/examples/jsm/controls/OrbitControls.js';
	import {
		FBXLoader
	} from 'static/three/examples/jsm/loaders/FBXLoader.js';
	import {
		RGBELoader
	} from 'static/three/examples/jsm/loaders/RGBELoader.js';

	var renderer;
	var scene, FBXloader;
	var camera;
	var controls;
	let pmremGenerator, envMap;
	let renderEnabled = false;
	let timeOut = null;

	export default {
		mounted() {
			this.initThree();
		},
		methods: {
			initThree() {
				let that = this;

				// 创建场景对象Scene
				scene = new THREE.Scene();

				// 相机设置
				var width = window.innerWidth * 0.4; // threeView 的宽度
				var height = window.innerHeight * 0.9; // threeView 的高度
				var fov = 45; // 视野范围
				camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 10000);
				camera.position.set(-20, 0, 55); // 调整相机位置，向后移动并适当提高高度
				scene.add(camera);

				// 创建渲染器对象
				const element = document.getElementById('threeView');
				renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true,
				});
				renderer.physicallyCorrectLights = true;
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(width, height);
				pmremGenerator = new THREE.PMREMGenerator(renderer);
				pmremGenerator.compileEquirectangularShader();
				element.appendChild(renderer.domElement); // 将 canvas 插入到 threeView 中

				// 光源设置
				const hemiLight = new THREE.HemisphereLight();
				hemiLight.intensity = 0.3;
				scene.add(hemiLight);

				const ambientLight = new THREE.AmbientLight(0xffffff, 1);
				scene.add(ambientLight);

				const light = new THREE.DirectionalLight(0xffffff, 0.3);
				light.position.set(-10, -1, 100);
				scene.add(light);

				// 控制器
				controls = new OrbitControls(camera, renderer.domElement);
				controls.enablePan = false;
				controls.enableDamping = true;
				controls.dampingFactor = 0.05;
				controls.screenSpacePanning = false;
				controls.maxPolarAngle = Math.PI / 2;

				// 环境纹理
				this.getfile("./static/images/venice_sunset_1k.hdr").then((res) => {
					new RGBELoader()
						.setDataType(THREE.UnsignedByteType)
						.load(res, (texture) => {
							envMap = pmremGenerator.fromEquirectangular(texture).texture;
							pmremGenerator.dispose();
							scene.environment = envMap;
						});
				});

				// 加载模型
				FBXloader = new FBXLoader();
				this.getfile("./static/model/catch.fbx").then((res) => {
					FBXloader.load(res, (fbx) => {
						fbx.scale.set(0.1, 0.1, 0.1); // 调整模型缩放比例
						// fbx.position.set(150, 0, 0); // 将模型向左移动，使其紧贴左下角
						fbx.position.set(-2, -23, 0); // 将模型向左移动，使其紧贴左下角

						// 创建动画混合器
						const mixer = new THREE.AnimationMixer(fbx);

						// 检查是否有动画片段
						if (fbx.animations && fbx.animations.length) {
							// 获取第一个动画片段
							const clip = fbx.animations[0];
							const action = mixer.clipAction(clip);

							// 播放动画的一部分
							const duration = clip.duration; // 动画总时长
							const halfDuration = duration / 2; // 动画一半的时长

							// 设置动画只播放前半部分
							action.timeScale = 1; // 正常播放速度
							action.play();
							setTimeout(() => {
								action.time = halfDuration; // 跳到动画的中间位置
								action.timeScale = -1; // 设置为倒放
								action.play();
							}, halfDuration * 1000); // 等待前半部分播放完成
						}
						// 设置相机焦点指向模型中心
						camera.lookAt(fbx.position);

						scene.add(fbx);

						// 动画更新逻辑
						function animate() {
							requestAnimationFrame(animate);
							controls.update();

							// 更新动画混合器
							if (mixer) {
								mixer.update(0.016); // 16ms 的时间步长
							}

							renderer.render(scene, camera);
						}
						animate();
					});
				});
			},
			getfile(e) {
				// 文件加载逻辑保持不变
				return new Promise((resolve, reject) => {
					resolve(e);
				});
			},
		},
	};
</script>
<style>
	.content {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	#threeView {
		position: absolute;
		bottom: 10px;
		/* 距离底部10px */
		left: 0;
		z-index: 10;
		/* width: 30%; */
		/* 宽度为屏幕宽度的30% */
		/* height: 30%; */
		/* 高度为屏幕高度的30% */
	}

	.chat-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 300px;
		/* 对话栏高度 */
		background: linear-gradient(to bottom, rgba(180, 250, 180, 0.6), rgba(0, 110, 0, 0.4));
		/* 浅绿色渐变背景 */
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: white;
		padding: 10px;
		box-sizing: border-box;
		border-radius: 10px 10px 0 0;
		/* 上方圆角 */
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		/* 轻微的向上投射阴影 */
		animation: fadePulse 4s infinite;
		/* 动态透明度变化动画 */
	}

	.chat-text {
		font-family: 'Arial', sans-serif;
		/* 字体美观 */
		font-weight: bold;
		text-align: center;
		margin: 0;
	}

	/* 动态透明度变化动画 */
	@keyframes fadePulse {

		0%,
		100% {
			opacity: 0.8;
		}

		50% {
			opacity: 0.5;
		}
	}
</style>