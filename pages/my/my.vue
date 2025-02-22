<template>
	<view class="container">
		<canvas type="webgl" id="webgl" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
	</view>
</template>

<script>
	import * as THREE from 'three'
	import {
		OrbitControls
	} from 'three/examples/jsm/controls/OrbitControls.js'
	import {
		GLTFLoader
	} from 'three/examples/jsm/loaders/GLTFLoader.js';
	import {
		FBXLoader
	} from 'three/examples/jsm/loaders/FBXLoader.js';
	export default {
		data() {
			return {
				canvasWidth: 375,
				canvasHeight: 600,
				renderer: null,
				camera: null,
				scene: null,
				cube: null,
				controls: null,
				canvas: null,
			};
		},
		onReady() {
			const info = uni.getSystemInfoSync();
			this.canvasWidth = info.windowWidth;
			this.canvasHeight = info.windowHeight;
			this.$nextTick(() => {
				this.initThree();
			});
		},
		methods: {
			initThree() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#webgl')
					.node()
					.exec((res) => {
						const canvas = res[0].node;
						this.canvas = canvas;

						// 创建渲染器
						this.renderer = new THREE.WebGLRenderer({
							canvas: canvas,
							antialias: true,
						});
						this.renderer.setSize(this.canvasWidth, this.canvasHeight);
						this.renderer.setPixelRatio(uni.getSystemInfoSync().pixelRatio);

						// 创建场景
						this.scene = new THREE.Scene();
						this.scene.background = new THREE.Color(0xf0f0f0);

						// 创建相机
						this.camera = new THREE.PerspectiveCamera(
							75,
							this.canvasWidth / this.canvasHeight,
							0.1,
							1000
						);
						this.camera.position.z = 5;

						// 创建控制器
						this.controls = new OrbitControls(this.camera, canvas);
						this.controls.enableDamping = true;

						// 添加光源
						const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
						this.scene.add(ambientLight);
						const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
						directionalLight.position.set(2, 2, 5);
						this.scene.add(directionalLight);

						// 创建立方体
						const geometry = new THREE.BoxGeometry(1, 1, 1);
						const material = new THREE.MeshPhongMaterial({
							color: 0x00ff00
						});
						this.cube = new THREE.Mesh(geometry, material);
						this.scene.add(this.cube);

						// 开始动画循环
						this.animate();
					});
			},
			animate() {
				requestAnimationFrame(() => {
					this.animate();
				});
				if (this.cube) {
					this.cube.rotation.x += 0.01;
					this.cube.rotation.y += 0.01;
				}
				if (this.controls) {
					this.controls.update();
				}
				if (this.renderer && this.scene && this.camera) {
					this.renderer.render(this.scene, this.camera);
				}
			},
		},
	};
</script>

<style>
	.container {
		width: 100%;
		height: 100vh;
	}
</style>