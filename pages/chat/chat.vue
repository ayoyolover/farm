<template>
	<view class="container">
		<!-- 背景图片 -->
		<image src="/static/sow/back.png" class="background-image"></image>

		<!-- 聊天内容区域 -->
		<scroll-view :scroll-into-view="scrollToView" scroll-y="true" :style="{ height: windowHeight + 'rpx' }"
			scroll-with-animation enable-flex="true">
			<view v-for="(item, index) in chatInfo.chatMessage" class="box" :id="`msg${index}`">
				<view v-if="item.cmFlag && item.cmContent[0] !== 'h'" class="plant">
					<img :src="`/static/${plantName}.png`" class="avatar" />
					<view class="content">
						<view style="font-size: 15px; color: #999;">{{ plantName }}</view>
						<view class="message">{{ item.cmContent }}</view>
					</view>
				</view>
				<view v-else-if="item.cmFlag && item.cmContent[0] === 'h'" class="plant">
					<img :src="`/static/${plantName}.png`" class="avatar" />
					<view class="content">
						<view style="font-size: 15px; color: #999;">{{ plantName }}</view>
						<img :src="item.cmContent" class="img" />
					</view>
				</view>
				<view v-else class="user">
					<img src="/static/avatar.jpg" class="avatar" />
					<view class="userContent">
						<view style="font-size: 15px; color: #999;">用户</view>
						<view class="message">{{ item.cmContent }}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 聊天输入区域 -->
		<view class="input-container">
			<!-- 语音按钮 -->
			<view class="icon-btn voice-btn" @tap="toggleVoiceInput">
				<text class="btn-text">{{ isVoiceInput ? '键盘' : '语音' }}</text>
			</view>

			<!-- 输入框 -->
			<view class="input-box" v-if="!isVoiceInput">
				<input class="input" placeholder="请输入内容..." v-model="inputText" @input="adjustInputHeight" />
			</view>

			<!-- 发送按钮 -->
			<view class="icon-btn send-btn" @tap="sendMessage" v-if="!isVoiceInput && inputText.trim() !== ''">
				<text class="btn-text">发送</text>
			</view>

			<!-- 录音按钮 -->
			<view class="voice-input-box" v-if="isVoiceInput" @touchstart="startRecording" @touchend="stopRecording">
				<text class="voice-text">{{ isRecording ? '松开结束' : '按住说话' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		handleOX,
		capture,
		handleLED
	} from '@/request/equip';
	import {
		getChatInfo,
		updateChatMessage
	} from '@/request/chat.js';

	export default {
		data() {
			return {
				chatMsg: "",
				keyboardHeight: 0,
				bottomHeight: 0,
				chatInfo: [],
				plantName: '',
				plantId: -1,
				scrollToView: '',
				windowHeight: 0,
				userInfo: {},
				isVoiceInput: false,
				isRecording: false,
				recorderManager: null,
				audioPath: "",
				inputText: "",
				baseInputHeight: 40,
				maxInputHeight: 120, // 设置输入框最大高度
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
			},
			startRecording() {
				if (!this.checkAudioPermission()) return;

				this.recorderManager = uni.getRecorderManager();
				this.recorderManager.start();
				this.isRecording = true;
			},
			stopRecording() {
				this.recorderManager.stop();
				this.isRecording = false;
				this.recorderManager.onStop((res) => {
					this.audioPath = res.tempFilePath;
					uni.showToast({
						title: "录音完成",
						icon: "success",
					});
					console.log("录音文件路径:", this.audioPath);
				});
			},
			checkAudioPermission() {
				uni.authorize({
					scope: 'scope.record',
					success: () => {
						return true;
					},
					fail: () => {
						uni.showToast({
							title: '请授权录音权限',
							icon: 'none',
						});
						return false;
					}
				});
			},
			sendMessage() {
				if (this.chatMsg.trim() !== "") {
					let chat = {
						cmFlag: 0,
						cmContent: this.chatMsg,
					};
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
						plantId: this.plantId,
						userId: this.userInfo.userId,
						chatMessage: [{
							cmFlag: 0,
							cmContent: this.chatMsg,
						}],
					};
					updateChatMessage(obj).then((res) => {
						if (res.data) {
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
				this.windowHeight = this.getHeightData();
				if (e) {
					this.plantName = e.plantName;
					this.plantId = e.plantId;
					uni.setNavigationBarTitle({
						title: `绿宝`,
					});
				} else {
					uni.setNavigationBarTitle({
						title: '网络有误',
					});
				}
				try {
					const userInfo = uni.getStorageSync("userInfo");
					if (userInfo) {
						this.userInfo = userInfo;
					}
				} catch (e) {
					console.log("error", e);
				}
				getChatInfo(this.userInfo.userId, e.plantId).then((res) => {
					this.chatInfo = res.data[0];
					this.$nextTick(() => {
						this.scrollToView = `msg${this.chatInfo.chatMessage.length - 1}`;
					});
				});
			},
			getHeightData() {
				var result = 0;
				uni.getSystemInfo({
					success: function(res) {
						result = res.windowHeight + 570;
					},
				});
				return result;
			},
		},
	};
</script>

<style>
	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: brightness(0.8);
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
		bottom: 80px;
		left: 20px;
		right: 20px;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.9);
		/* 增加透明度，防止按钮看起来过于突兀 */
		border-radius: 25px;
		padding: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	/* 输入框样式 */
	.input-box {
		flex: 1;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20px;
		height: 40px;
		margin-right: 10px;
		margin-left: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		/* 让输入框有一点阴影效果 */
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
		/* 输入文本颜色 */
		outline: none;
		/* 移除聚焦时的边框 */
	}

	/* 按钮样式 */
	.icon-btn {
		width: 60px;
		height: 40px;
		display: flex;
		align-items: center;
		margin-right: 10px;
		justify-content: center;
		background-color: #007aff;
		/* 修改为蓝色 */
		border-radius: 50px;
		color: #fff;
		font-size: 14px;
		transition: background-color 0.3s ease;
		/* 按钮点击时的平滑过渡效果 */
		cursor: pointer;
		/* 提示用户可以点击 */
	}

	/* 按钮的点击效果 */
	.icon-btn:active {
		background-color: #005bb5;
		/* 更深的蓝色 */
	}

	/* 按钮内部文本样式 */
	.btn-text {
		font-size: 12px;
		font-weight: bold;
	}

	/* 语音输入框样式 */
	.voice-input-box {
		flex: 1;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 20px;
		border: 1px solid #007aff;
		/* 给语音框加边框 */
	}

	.voice-text {
		font-size: 16px;
		color: #007aff;
	}

	/* 消息用户和植物的样式区分 */
	.user {
		display: flex;
		margin-bottom: 15rpx;
		align-items: center;
	}

	.userContent {
		max-width: 70%;
		padding: 12rpx;
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
		align-items: center;
	}

	.plant .content {
		max-width: 70%;
		padding: 12rpx;
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
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
</style>