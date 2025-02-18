<template>
	<view class="container" @tap="handleTap">
		<!-- 背景视频 -->
		<video ref="video" src="../../static/video/green/back.mp4" autoplay muted loop playsinline preload="auto"
			class="video"></video>

		<!-- 加载动画 -->
		<view class="loading-overlay" v-if="isLoading">
			<view class="loading-spinner"></view>
		</view>

		<!-- 问候弹窗 -->
		<view class="greeting-popup" v-if="showGreeting" :style="{ opacity: popupOpacity }">
			<text class="greeting-text">{{ currentTime }}</text>
			<text class="greeting-text">我是绿宝，欢迎来到智趣农坊</text>
		</view>

		<!-- 选择弹窗 -->
		<view class="choice-popup" v-if="showChoice" :style="{ opacity: choiceOpacity }">
			<text class="choice-text">前往种植还是实验呢</text>
			<view class="choice-buttons">
				<button class="choice-button" @tap="goToIndex">种植</button>
				<button class="choice-button" @tap="goToMy">实验</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoading: true, // 是否显示加载动画
				showGreeting: true, // 是否显示问候弹窗
				showChoice: false, // 是否显示选择弹窗
				popupOpacity: 1, // 问候弹窗不透明度
				choiceOpacity: 0, // 选择弹窗不透明度
				currentTime: "", // 当前时间
			};
		},
		methods: {
			// 获取当前时间
			getCurrentTime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1).toString().padStart(2, '0');
				const day = now.getDate().toString().padStart(2, '0');
				const hours = now.getHours().toString().padStart(2, '0');
				const minutes = now.getMinutes().toString().padStart(2, '0');
				this.currentTime = `${year}-${month}-${day} ${hours}:${minutes}`;
			},
			// 隐藏问候弹窗
			hideGreetingPopup() {
				setTimeout(() => {
					this.popupOpacity = 0;
					setTimeout(() => {
						this.showGreeting = false;
					}, 500); // 弹窗消失动画时间
				}, 3000); // 弹窗显示3秒后消失
			},
			// 处理页面点击事件
			handleTap() {
				if (!this.showGreeting && !this.showChoice) {
					this.showChoice = true;
					this.choiceOpacity = 1;
				}
			},
			// 前往种植页面
			goToIndex() {
				uni.switchTab({
					url: '/pages/index/index' // 跳转到 tabBar 页面
				});
			},
			// 前往实验页面
			goToMy() {
				uni.switchTab({
					url: '/pages/my/my' // 跳转到 tabBar 页面
				});
			},
		},
		mounted() {
			// 0.3 秒后隐藏加载动画
			setTimeout(() => {
				this.isLoading = false;
			}, 300);

			// 获取当前时间
			this.getCurrentTime();

			// 隐藏问候弹窗
			this.hideGreetingPopup();
		},
	};
</script>

<style>
	/* 容器样式 */
	.container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	/* 视频背景样式 */
	.video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		/* 将视频置于最底层 */
		filter: brightness(0.8);
		/* 降低视频亮度，实现透明度效果 */
	}

	/* 加载动画遮罩 */
	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		/* 纯黑色背景 */
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
		/* 置于最上层 */
	}

	/* 加载动画 */
	.loading-spinner {
		width: 50px;
		height: 50px;
		border: 4px solid #fff;
		border-top: 4px solid transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* 问候弹窗样式 */
	.greeting-popup {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(135deg, rgba(109, 213, 237, 0.85), rgba(33, 147, 176, 0.85));
		padding: 30px 40px;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		transition: opacity 0.5s ease;
		width: 70%;
		/* 弹窗宽度调整为70% */
		max-width: 350px;
		/* 最大宽度限制 */
	}

	.greeting-text {
		display: block;
		font-size: 20px;
		color: #fff;
		margin-bottom: 10px;
		font-weight: bold;
		font-family: 'PingFang SC', 'Helvetica Neue', sans-serif;
		/* 使用更美观的字体 */
	}

	/* 选择弹窗样式 */
	.choice-popup {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(135deg, rgba(109, 213, 237, 0.85), rgba(33, 147, 176, 0.85));
		padding: 30px 40px;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		transition: opacity 0.5s ease;
		width: 70%;
		/* 弹窗宽度调整为70% */
		max-width: 350px;
		/* 最大宽度限制 */
	}

	.choice-text {
		display: block;
		font-size: 20px;
		color: #fff;
		margin-bottom: 20px;
		font-weight: bold;
		font-family: 'PingFang SC', 'Helvetica Neue', sans-serif;
		/* 使用更美观的字体 */
	}

	.choice-buttons {
		display: flex;
		justify-content: space-around;
	}

	.choice-button {
		background: linear-gradient(135deg, #6dd5ed, #2193b0);
		color: #fff;
		border: none;
		padding: 12px 24px;
		border-radius: 25px;
		font-size: 16px;
		font-weight: bold;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
		font-family: 'PingFang SC', 'Helvetica Neue', sans-serif;
		/* 使用更美观的字体 */
	}

	.choice-button:active {
		transform: scale(0.95);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.choice-button:hover {
		background: linear-gradient(135deg, #2193b0, #6dd5ed);
	}
</style>