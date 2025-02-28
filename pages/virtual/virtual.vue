<template>
	<view class="container">
		<!-- 背景图片 -->
		<!-- <image src="/static/sow/back.png" class="background-image"></image> -->
		<view id="threeView"></view> <!-- 用于渲染虚拟人 -->
		<!-- 聊天内容区域 -->
		<scroll-view :scroll-into-view="scrollToView" scroll-y="true" :style="{ height: windowHeight + 'rpx' }"
			scroll-with-animation enable-flex="true">
			<view v-for="(item, index) in chatInfo.chatMessage" class="box" :id="`msg${index}`">
				<view v-if="item.cmFlag" class="plant">
					<image :src="`/static/sow/sprout.png`" class="avatar" />
					<view class="content">
						<view class="message">{{ item.cmContent }}</view>
					</view>
				</view>
				<view v-else class="user">
					<view class="userContent">
						<view class="message">{{ item.cmContent }}</view>
					</view>
					<image src="/static/avatar.jpg" class="avatar" />
				</view>
			</view>
		</scroll-view>

		<!-- 悬浮窗 -->
		<view v-if="audioDialogVisible" class="audio-dialog">
			<view class="close-btn" @click="closeAudioDialog">×</view>
			<view class="audio-dialog-content">
				<view class="audio-text">绿宝发送了一条语音</view>
				<view class="audio-btn" @click="playAudio">点击播放</view>
			</view>

		</view>

		<!-- 输入区域 -->
		<view class="input-container">
			<!-- 语音按钮 -->
			<view class="icon-btn voice-btn" @tap="toggleVoiceInput">
				<text class="btn-text">{{ isVoiceInput ? '键盘' : '语音' }}</text>
			</view>

			<!-- 输入框 -->
			<view class="input-box" v-if="!isVoiceInput">
				<input class="input" placeholder="请输入内容..." v-model="chatMsg" @input="adjustInputHeight" />
			</view>

			<!-- 发送按钮 -->
			<view class="icon-btn send-btn" @tap="sendMessage" v-if="!isVoiceInput && chatMsg.trim() !== ''">
				<text class="btn-text">发送</text>
			</view>

			<!-- 录音按钮 -->
			<view class="voice-input-box" v-if="isVoiceInput" @touchstart="startRecording" @touchend="stopRecording">
				<text class="voice-text">{{ isRecording ? '松开结束' : '按住说话' }}</text>
			</view>

			<!-- 麦克风和录音时间 -->
			<view class="recording-indicator" v-if="isRecording">
				<image src="/static/micro-white.png" class="microphone-icon" />
				<view class="recording-time">{{ recordingTime }}s</view>
			</view>
		</view>

		<!-- 隐藏的 audio 标签 -->
		<audio id="audio" :src="audio" ref="audio" @ended="onAudioEnded" style="display: none;"></audio>
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
				var width = window.innerWidth; // threeView 的宽度
				var height = window.innerHeight * 0.9; // threeView 的高度
				var fov = 62; // 视野范围
				camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 10000);
				camera.position.set(0, 0, 65); // 调整相机位置，向后移动并适当提高高度
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
				light.position.set(-10, -1, 60);
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
						fbx.scale.set(0.2, 0.2, 0.2); // 调整模型缩放比例
						// fbx.position.set(150, 0, 0); // 将模型向左移动，使其紧贴左下角
						fbx.position.set(-1, 4, 0); // 将模型向左移动，使其紧贴左下角

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
<script>
	import {
		handleOX,
		capture,
		handleLED
	} from '@/request/equip';
	import {
		getChatInfo,
		updateChatMessage,
		updateFarmerChatMessage,
		getFarmerChatList
	} from '@/request/chat.js';
	import {
		textToAudio
	} from '@/request/audio.js'
	export default {
		data() {
			return {
				audioDialogVisible: false, // 新增变量来控制悬浮窗显示
				audio: '',
				audioPath: "",
				isVoiceInput: false,
				isRecording: false,
				recordingTime: 0,
				recorderManager: null,
				recordingInterval: null,
				chatInfo: [],
				scrollToView: '',
				windowHeight: 0,
				chatMsg: "",
				baseInputHeight: 40,
				maxInputHeight: 120,
				globalData: ''
			};
		},
		computed: {
			totalInputHeight() {
				return this.bottomHeight + this.keyboardHeight + this.baseInputHeight;
			},
		},
		methods: {
			toggleVoiceInput() {
				this.isVoiceInput = !this.isVoiceInput;
				if (!this.isVoiceInput && this.isRecording) {
					this.stopRecording(); // 关闭语音输入时，如果正在录音则停止录音
				}
			},
			closeAudioDialog() {
				this.audioDialogVisible = false; // 隐藏对话框
			},

			startRecording() {
				if (!this.checkAudioPermission())
					return; // 先检查权限
				this.recorderManager = uni.getRecorderManager();
				// 设置录音配置
				this.recorderManager.start({
					format: 'm4a', // 设置为m4a格式
					sampleRate: 16000, // 设置采样率，通常使用16000Hz
					numberOfChannels: 1, // 设置单声道
					encodeBitRate: 96000, // 设置编码比特率
					audioSource: 'mic', // 设置音频来源为麦克风
				});
				this.isRecording = true;
				this.recordingTime = 0; // 重新开始计时
				this.recordingInterval = setInterval(() => {
					this.recordingTime++;
				}, 1000); // 每秒更新录音时间
			},
			playAudio() {
				if (this.audio) {
					const audioContext = uni.createInnerAudioContext('audio');
					if (audioContext) {
						audioContext.src = this.audio;
						audioContext.autoplay = true;
					} else {
						console.error('无法获取音频上下文');
					}
				} else {
					console.log('没有音频文件可播放');
				}

				// 显示悬浮窗

			},
			onAudioEnded() {
				console.log("音频播放完毕");

				// 关闭音频提示的悬浮窗
				this.audio = ''; // 清空音频路径
				this.audioDialogVisible = false; // 控制悬浮窗的显示
			},
			stopRecording() {
				this.recorderManager.stop(); // 停止录音
				this.isRecording = false;
				clearInterval(this.recordingInterval); // 停止计时
				this.recordingTime = 0; // 重置时间
				this.recorderManager.onStop((res) => {
					console.log("文件", res);
					this.audioPath = res.tempFilePath; // 获取录音文件路径
					uni.showToast({
						title: "录音完成",
						icon: "success",
					});
					console.log("录音文件路径:", this.audioPath);
					// 准备要上传的文件
					let formData = {
						userId: this.globalData.userId,
					};
					uni.hideToast();
					uni.showLoading({
						title: '文字转换中',
					});
					// 使用 uni.uploadFile 上传文件
					uni.uploadFile({
						url: 'http://124.221.52.73:80/recognize', // 后端接收文件的接口地址
						filePath: this.audioPath, // 录音文件路径
						name: 'audio_file', // 这里是你后端接收文件时的字段名，后端根据这个字段名来接收
						formData: formData, // 可以传递其他需要的字段数据
						success: (uploadRes) => {
							console.log('上传成功:', uploadRes);
							let result = JSON.parse(uploadRes.data).result;
							console.log("transform", result)
							// 在这里可以根据后端返回的结果进行处理
							// setTimeout(() => {
							// 	uni.hideLoading();
							// 	uni.showLoading({
							// 		title: '绿宝接收中',
							// 		duration: 3000
							// 	});
							// }, 1000);
							let obj
							if(result){
								obj = {
									plantId: this.globalData.plantId,
									userId: this.globalData.userId,
									chatMessage: [{
										cmFlag: 0,
										cmContent: result,
									}],
								};
							}
							else{
								uni.hideLoading()
								uni.showToast({
									icon:'error',
									title: "未识别到文字"
								})
								setTimeout(() => {
									uni.hideToast();
								}, 1000);
							}
							//
							const navigationMap = {
								'时光剪影': '/pages/clip/clip', // 跳转到时光剪影页面
								'数据图表': '/pages/video/video', // 跳转到数据图表页面
								'开心农场': '/pages/farming/farming' // 跳转到开心农场页面
							};
							const _navigationMap = {
								'个人中心': '/pages/my/my', // 跳转到个人中心页面
								'实验中心': '/pages/edu-main/edu-main', // 跳转到实验中心页面
								'种植主页': '/pages/index/index', // 跳转到种植主页页面
							}
							var flag = 0
							// 遍历 navigationMap，查找匹配的字符串并跳转
							for (const [keyword, targetPage] of Object.entries(navigationMap)) {
								if (result.includes(keyword)) {
									flag = 1;
									console.log(targetPage)
									uni.hideLoading()
									uni.navigateTo({
										url: targetPage
									});
									break; // 找到匹配的词后跳转，停止继续查找
								}
							}
							for (const [keyword, targetPage] of Object.entries(_navigationMap)) {
								if (result.includes(keyword)) {
									flag = 1;
									console.log(targetPage)
									uni.hideLoading()
									uni.switchTab({
										url: targetPage
									});
									break; // 找到匹配的词后跳转，停止继续查找
								}
							}
							if (!flag&&result) {
								updateFarmerChatMessage(obj)
									.then(res => {
										if (res.data) {
											console.log("更新记录", res)
											uni.hideLoading()
											this.chatInfo = res.data[0];
											uni.hideLoading();
											uni.showToast({
												icon: 'success',
												title: '接收成功',
												duration: 1000
											});
											setTimeout(() => {
												this.$nextTick(() => {
													this.scrollToView =
														`msg${this.chatInfo.chatMessage.length - 1}`;
												});
												let data = {
													text: this.chatInfo.chatMessage[
														this
														.chatInfo.chatMessage
														.length -
														1].cmContent
												}
												// console.log(this.chatInfo.chatMessage[this.chatInfo.chatMessage.length - 1])
												textToAudio(data)
													.then(res => {
														console.log("语音", res)
														let str = res.audioPath
														this.audio =
															"http://124.221.52.73:80" +
															str
															.substring(str.indexOf(
																"/audio"))
														this.audioDialogVisible =
															true; // 显示提示对话框
														// this.audio = "_doc/uniapp_temp_1738861020562/recorder/1738861024154.m4a"
													})
											}, 2000);

										}
									})
							}

						},
						fail: (err) => {
							console.log('上传失败:', err);
							uni.showToast({
								title: '上传失败',
								icon: 'none',
							});
						}
					});
				});
			},
			checkAudioPermission() {
				return new Promise((resolve, reject) => {
					uni.getSetting({
						success: (res) => {
							if (res.authSetting['scope.record']) {
								// 已授权
								resolve(true);
							} else {
								// 未授权
								uni.authorize({
									scope: 'scope.record',
									success: () => {
										console.log("成功授权")
										resolve(true);
									},
									fail: () => {
										uni.showToast({
											title: '请授权录音权限',
											icon: 'none',
										});
										reject(false);
									}
								});
							}
						}
					});
				});
			},
			sendMessage() {
				console.log(this.chatInfo)
				if (this.chatMsg.trim() !== "") {
					let chat = {
						cmFlag: 0,
						cmContent: this.chatMsg,
					};
					console.log(chat)
					this.chatInfo.chatMessage.push(chat);
					this.$nextTick(() => {
						this.scrollToView = `msg${this.chatInfo.chatMessage.length - 1}`;
					});
					uni.showToast({
						icon: 'success',
						title: '发送成功',
						duration: 1000,
					});
					setTimeout(() => {
						uni.hideToast();
						uni.showLoading({
							title: '您的植物正在接收消息',
						});
					}, 1000);
					let obj = {
						plantId: this.globalData.plantId,
						userId: this.globalData.userId,
						chatMessage: [{
							cmFlag: 0,
							cmContent: this.chatMsg,
						}],
					};
					updateFarmerChatMessage(obj).then((res) => {
						if (res.data) {
							uni.hideLoading()
							this.chatInfo = res.data[0];
							this.$nextTick(() => {
								this.scrollToView = `msg${this.chatInfo.chatMessage.length - 1}`;
							});
						}
					});
					this.chatMsg = '';
				} else {
					uni.showToast({
						icon: 'error',
						title: "消息不得为空白",
					});
				}
				this.scrollToView = '';
			},
			adjustInputHeight(event) {
				const inputValue = event.detail.value;
				let newHeight = Math.min(this.maxInputHeight, 40 + Math.floor(inputValue.length / 20 * 40));
				this.baseInputHeight = newHeight;
			},
			sendHeight() {
				setTimeout(() => {
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect();
					query.exec((res) => {
						this.bottomHeight = this.rpxTopx(res[0].height);
					});
				}, 10);
			},
			rpxTopx(px) {
				let deviceWidth = uni.getSystemInfoSync().windowWidth;
				let rpx = (750 / deviceWidth) * Number(px);
				return Math.floor(rpx);
			},
			onLoad(e) {
				var app = getApp();
				console.log(app.globalData);
				this.globalData = app.globalData;
				this.windowHeight = this.getHeightData();
				uni.setNavigationBarTitle({
					title: `绿宝`,
				});
				getFarmerChatList(this.globalData.userId).then((res) => {
					console.log(res.data[0])
					this.chatInfo = res.data[0];
					console.log(this.chatInfo.chatMessage.length)
					this.$nextTick(() => {
						if (this.chatInfo)
							this.scrollToView = `msg${this.chatInfo.chatMessage.length - 1}`;
					});
				});
			},
			getHeightData() {
				var result = 0;
				uni.getSystemInfo({
					success: function(res) {
						result = res.windowHeight + 470;
						result = 1204
					},
				});
				console.log(result)
				return result;
			},
		},
	};
</script>
<style>
	/* 背景图片 */
	/* 	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: brightness(0.8);
	} */

	#threeView {
		position: absolute;
		top: 0;
		/* 距离底部10px */
		left: 10rpx;
		/* width: 30%; */
		/* 宽度为屏幕宽度的30% */
		/* height: 30%; */
		/* 高度为屏幕高度的30% */
	}

	.container {
		position: relative;
		width: 100%;
		height: 100vh;
	}

	.box {
		margin: 22rpx;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 33rpx;
	}

	.message {
		background-color: white;
		padding: 15rpx;
		margin-top: 10rpx;
		border-radius: 10px;
		word-break: break-all;
		word-wrap: break-word;
	}

	/* 输入区域容器 */
	.input-container {
		position: fixed;
		bottom: 18rpx;
		left: 20rpx;
		right: 20rpx;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 16px;
		padding: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	/* 输入框样式 */
	.input-box {
		flex: 1;
		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 10px;
		padding: 0px 16px;
		height: 40px;
		margin-right: 10px;
		margin-left: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* 输入框字体样式 */
	.input {
		width: 100%;
		font-size: 16px;
		line-height: 20px;
		height: 40px;
		border: none;
		background: transparent;
		color: #333;
		outline: none;
	}

	/* 按钮样式 */
	.icon-btn {
		width: 60px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #007aff;
		border-radius: 12px;
		color: #fff;
		font-size: 14px;
		transition: background-color 0.3s ease;
		cursor: pointer;
	}

	/* 按钮的点击效果 */
	.icon-btn:active {
		background-color: #005bb5;
	}

	/* 按钮内部文本样式 */
	.btn-text {
		font-size: 12px;
		font-weight: bold;
	}

	/* 消息用户和植物的样式区分 */
	.user {
		display: flex;
		margin-bottom: 15rpx;
		align-items: start;
		justify-content: flex-end;
	}

	.userContent {
		max-width: 70%;
		padding: 0rpx 8rpx 8rpx 8rpx;
		background-color: #e0f7fa;
		border-radius: 8px;
		margin-left: 10rpx;
	}

	.user .message {
		background-color: #e0f7fa;
		color: #007aff;
	}

	.plant {
		display: flex;
		margin-bottom: 15rpx;
		align-items: start;
		justify-content: flex-start;
	}

	.plant .content {
		max-width: 70%;
		padding: 0rpx 8rpx 8rpx 8rpx;
		background-color: #f1f8e9;
		border-radius: 8px;
		margin-left: 10rpx;
	}

	.plant .message {
		background-color: #f1f8e9;
		color: #43a047;
	}

	.img {
		max-width: 100%;
		border-radius: 8px;
	}

	.avatar {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}

	/* 调整用户和植物消息框的对齐方式 */
	.user .avatar {
		margin-left: 11px;
	}

	.plant .avatar {
		margin-right: 11px;
	}

	/* 悬浮窗的样式 */
	.audio-dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 200px;
		transform: translate(-50%, -50%);
		background: linear-gradient(135deg, #4CAF50, #388E3C);
		/* 渐变背景 */
		padding: 40rpx;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 999;
		/* animation: dynamicGradient 3s infinite; */
		/* 动态渐变 */
	}

	/* 调整悬浮窗的内容区域 */
	.audio-dialog-content {
		display: flex;
		flex-direction: column;
		/* 设置为竖直排列 */
		justify-content: center;
		/* 垂直居中对齐 */
		align-items: center;
		/* 水平居中对齐 */
		text-align: center;
		/* 确保文本居中显示 */
		gap: 20rpx;
		/* 设置两个子元素之间的间距 */
	}

	/* 语音文字样式 */
	.audio-text {
		font-size: 18px;
		color: white;
		margin-bottom: 10rpx;
		/* 给文字下方留些空间 */
	}

	/* 播放按钮样式 */
	.audio-btn {
		background-color: #4CAF50;
		color: white;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		cursor: pointer;
		font-size: 16px;
		transition: background-color 0.3s;
	}

	.audio-btn:hover {
		background-color: #388E3C;
	}


	/* 语音输入框 */
	.voice-input-box {
		flex: 1;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 10px;
		margin-left: 10px;
		margin-right: 10px;
		border: 1px solid #007aff;
	}

	.voice-text {
		font-size: 16px;
		color: #007aff;
	}

	/* 录音时麦克风和计时显示 */
	.recording-indicator {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 20rpx;
		border-radius: 10px;
	}

	.microphone-icon {
		width: 60px;
		height: 60px;
		margin: 0rpx 40rpx;
	}

	.recording-time {
		color: #fff;
		font-size: 18px;
		margin-top: 10rpx;
	}


	/* 关闭按钮样式 */
	.close-btn {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		font-size: 24px;
		color: white;
		cursor: pointer;
		z-index: 1000;
	}
</style>