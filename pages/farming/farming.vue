<template>
	<view class="farm-container">
		<!-- 农场背景 -->
		<image src="/static/sow/back.png" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;"></image>

		<!-- 可折叠工具栏 -->
		<view class="collapsible-toolbar" v-bind:style="{ height: isToolbarOpen ? '180rpx' : '50rpx' }">
			<view class="toolbar-header" @click="toggleToolbar">
				<image src="/static/icons/arrow-down.png" class="toggle-icon" v-if="!isToolbarOpen" />
				<image src="/static/icons/arrow-up.png" class="toggle-icon" v-if="isToolbarOpen" />
			</view>

			<!-- 显示按钮的区域 -->
			<view class="change" v-show="isToolbarOpen">
				<view class="changeItem" @click="handleLED" @touchstart="onDragStart" @touchmove="onDragMove"
					@touchend="onDragEnd">
					<image :src="isLed ? '/static/monitor/light-off.png' : '/static/monitor/light-on.png'"
						class="icon drag-item" :style="dragging ? imageStyle : {}" @touchstart="onImageTouchStart" />
					<view class="text">灯光</view>
				</view>
				<view class="changeItem" @click="handleOx" @touchstart="onDragStart" @touchmove="onDragMove"
					@touchend="onDragEnd">
					<image :src="isOx ? '/static/monitor/Oxygen-off.png' : '/static/monitor/Oxygen-on.png'"
						class="icon drag-item" :style="dragging ? imageStyle : {}" @touchstart="onImageTouchStart" />
					<view class="text">供氧</view>
				</view>
			</view>
		</view>
		<!-- 单个植物 -->
		<view class="plant target" @click="handlePlantClick"
			style="position: absolute; top: 76%; left: 56%; transform: translate(-50%, -50%); text-align: center; cursor: pointer; transition: transform 0.3s ease; z-index: 2;">
			<image :src="currentPlant.image" style="width: 150rpx; height: 150rpx;" />
		</view>

		<!-- 交互提示 -->
		<view class="interaction-hint" v-if="showHint">
			点击查看生长状态！
		</view>

		<!-- 弹出对话框 -->
		<view class="popup-mask" v-if="showPopup" @click="closePopup">
			<view class="popup-container" @click.stop>
				<view class="popup-header">
					<text class="popup-title">植物生长状态</text>
				</view>
				<view class="popup-content">
					<view class="status-item">
						<text class="status-label">生命值：</text>
						<text class="status-value">{{ status.lifeValue }}</text>
					</view>
					<view class="status-item">
						<text class="status-label">活力值：</text>
						<text class="status-value">{{ status.vitality }}</text>
					</view>
					<view class="status-item">
						<text class="status-label">心情：</text>
						<text class="status-value">{{ status.mood }}</text>
					</view>
					<view class="status-item">
						<text class="status-label">当前阶段：</text>
						<text class="status-value">{{ status.growthStage }}</text>
					</view>
					<view class="status-item">
						<text class="status-label">植物心声：</text>
						<text class="status-value">{{ status.growthDesc }}</text>
					</view>
				</view>
				<view class="popup-footer">
					<button class="popup-close" @click="closePopup">关闭</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getStatus
	} from '@/request/farming.js';
	export default {
		data() {
			return {
				touch: 0,
				counter: 0,
				isDropped: false,
				dragging: false,
				startX: 0,
				startY: 0,
				currentX: 0,
				currentY: 0,
				baseX: 0,
				baseY: 0,
				currentPlantIndex: 0, // 当前显示的植物索引
				showHint: true,
				daysToNextStage: 0, // 距离下一个阶段的天数
				nextStageName: "", // 下一个阶段的名称
				showPopup: false, // 是否显示弹出框
				status: {},
				isLed: false,
				isOx: false,
				isToolbarOpen: false,
				oxygenTimes: 0,
				lightTimes: 0,
				plants: [{
						name: "番茄",
						image: "/static/sow/sprout.png",
						status: "出苗",
						scale: "scale(1)",
						daysToNext: 3, // 距离下一个阶段的天数
					},
					{
						name: "番茄",
						image: "/static/sow/flower.png",
						status: "开花",
						scale: "scale(1)",
						daysToNext: 5,
					},
					{
						name: "番茄",
						image: "/static/sow/little-tomato.png",
						status: "成熟",
						scale: "scale(1)",
						daysToNext: 7,
					},
					{
						name: "番茄",
						image: "/static/sow/large-tomato.png",
						status: "结果",
						scale: "scale(1)",
						daysToNext: 0, // 最后一个阶段，没有下一个阶段
					},
				],
			};
		},
		computed: {
			// 当前显示的植物
			currentPlant() {
				return this.plants[this.currentPlantIndex];
			},
			imageStyle() {
				return {
					position: 'absolute',
					left: `${this.currentX}px`,
					top: `${this.currentY}px`,
				};
			},
		},
		methods: {
			onImageTouchStart(e) {
				// 记录拖拽起始位置
				const touch = e.touches[0];
				this.startX = touch.pageX;
				this.startY = touch.pageY;
				this.dragging = true;
				if(this.startX <= 180)
					this.touch = 1
				else if(this.startX > 180)
					this.touch = 2
				this.baseX = this.startX;
				this.baseY = this.startY;
				this.currentX = this.baseX;
				this.currentY = this.baseY;
				console.log(this.startX, this.startY)
			},
			onDragStart() {
				// 禁用默认事件，防止页面滚动
				return false;
			},
			onDragMove(e) {
				if (this.dragging) {
					const touch = e.touches[0];
					// console.log(touch.pageX)
					// console.log(touch.pageY)
					// 计算当前触摸点位置
					this.currentX = this.baseX + touch.pageX - this.startX;
					this.currentY = this.baseY + touch.pageY - this.startY;
				}
			},
			onDragEnd(e) {
				console.log("jinrulr")
				this.dragging = false;
				const touch = e.changedTouches[0];
				let targetRect = {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
				// 判断是否拖拽到目标区域
				const query = uni.createSelectorQuery().in(this);
				query.select('.target').boundingClientRect((rect) => {
					if (rect) {
						targetRect.left = rect.left; // 图片的左边位置
						targetRect.top = rect.top; // 图片的顶部位置
						targetRect.right = rect.right; // 图片的左边位置
						targetRect.bottom = rect.bottom; // 图片的顶部位置

						this.currentX = touch.pageX;
						this.currentY = touch.pageY;

						// console.log(this.startX, this.startY)
						console.log(touch.pageX, touch.pageY)

						// console.log(this.baseX, this.baseY)
						// console.log(this.currentX, this.currentY)
						// 计算目标区域是否包含当前拖拽的图片
						if (
							this.currentX >= targetRect.left &&
							this.currentX <= targetRect.right &&
							this.currentY >= targetRect.top &&
							this.currentY <= targetRect.bottom
						) {
							console.log(this.touch)
							if(this.touch == 1)
								this.handleLED()
							else if(this.touch == 2)
								this.handleOx()
							this.touch = 0
						}
					}
				}).exec();
			},
			// 点击植物
			handlePlantClick() {
				// 计算距离下一个阶段的天数
				this.calculateNextStage();
				// 显示弹出框
				this.showPopup = true;
				// 隐藏提示
				this.showHint = false;
			},
			// 计算距离下一个阶段的天数
			calculateNextStage() {
				const currentPlant = this.currentPlant;
				const nextIndex = (this.currentPlantIndex + 1) % this.plants.length;
				const nextPlant = this.plants[nextIndex];
				this.daysToNextStage = currentPlant.daysToNext;
				this.nextStageName = nextPlant.status;
			},
			// 关闭弹出框
			closePopup() {
				this.showPopup = false;
			},
			onLoad() {
				var app = getApp();
				console.log(app.globalData);
				getStatus(app.globalData.userId, app.globalData.plantId)
					.then((res) => {
						console.log("res", res);
						this.status = res.data;
					});
			},
			toggleToolbar() {
				this.isToolbarOpen = !this.isToolbarOpen;
			},
			handleLED() {
				let action = !this.isLed ? 'start' : 'end';
				this.isLed = !this.isLed;
				this.lightTimes += 1
				uni.request({
					url: `http://192.168.1.109:5000/handleLED?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({
							title: '请求失败，请检查网络或链接',
							icon: 'none',
						});
					},
				});
			},
			handleOx() {
				let action = !this.isOx ? 'start' : 'end';
				this.isOx = !this.isOx;
				this.oxygenTimes += 1
				uni.request({
					url: `http://192.168.1.109:5000/handleOX?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({
							title: '请求失败，请检查网络或链接',
							icon: 'none',
						});
					},
				});
			},
		},
	};
</script>

<style>
	.drag-area {}

	.drag-item {}

	/* 页面容器 */
	.farm-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	/* 可折叠工具栏样式 */
	.collapsible-toolbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background: rgba(255, 255, 255, 0.5);
		/* 白色背景，带透明度 */
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		/* 添加较强的阴影 */
		z-index: 1000;
		transition: height 0.3s ease;
		backdrop-filter: blur(10px);
		/* 添加背景模糊效果 */
	}

	.toolbar-header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 20rpx;
		/* 顶部区域的高度 */
		cursor: pointer;
		transition: background-color 0.3s ease;
		/* 背景颜色过渡 */
	}

	.toolbar-header:hover {
		background-color: rgba(255, 255, 255, 0.3);
		/* 鼠标悬浮时略微改变背景透明度 */
	}

	.toggle-icon {
		width: 40rpx;
		height: 40rpx;
		transition: transform 0.3s ease;
	}

	.change {
		display: flex;
		justify-content: space-around;
		padding: 10rpx;
		flex-wrap: wrap;
	}

	.changeItem {
		text-align: center;
		cursor: pointer;
	}

	.icon {
		width: 80rpx;
		height: 80rpx;
		transition: transform 0.3s ease;
	}

	.text {
		font-size: 28rpx;
		color: #333;
		margin-top: 5rpx;
		transition: color 0.3s ease;
	}

	.changeItem:hover .text {
		color: #56ab2f;
		/* 鼠标悬浮时文字颜色变化 */
	}

	.changeItem:hover .icon {
		transform: scale(1.1);
		/* 鼠标悬浮时图标放大 */
	}


	/* 农场背景 */
	.farm-background {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	/* 植物 */
	.plant {
		position: absolute;
		top: 75%;
		left: 55%;
		transform: translate(-50%, -50%);
		text-align: center;
		cursor: pointer;
		transition: transform 0.3s ease;
		z-index: 2;
	}

	.plant-image {
		width: 150rpx;
		height: 150rpx;
		transition: transform 0.3s ease;
	}

	/* 交互提示 */
	.interaction-hint {
		position: absolute;
		bottom: 7%;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 20rpx 40rpx;
		border-radius: 50rpx;
		font-size: 28rpx;
		z-index: 3;
		animation: hintFade 2s infinite;
	}

	/* 提示动画 */
	@keyframes hintFade {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 0.5;
		}

		100% {
			opacity: 1;
		}
	}

	/* 弹出框遮罩 */
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	/* 弹出框容器 */
	.popup-container {
		background: linear-gradient(135deg, #a8e063, #56ab2f);
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
		text-align: center;
		width: 80%;
		max-width: 500rpx;
	}

	.popup-header {
		margin-bottom: 30rpx;
	}

	.popup-title {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
	}

	.popup-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.status-item {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 15rpx;
	}

	.status-label {
		font-size: 32rpx;
		color: #fff;
	}

	.status-value {
		font-size: 32rpx;
		color: #fff;
		display: inline-block;
		width: 6em;
		/* 根据需要设置合适的宽度，可以根据字体和需求调整 */
		white-space: nowrap;
		/* 不换行 */
		overflow: hidden;
		/* 隐藏超出部分 */
		text-overflow: ellipsis;
		/* 超出部分显示省略号 */
	}

	.popup-footer {
		margin-top: 30rpx;
	}

	.popup-close {
		background: #fff;
		color: #56ab2f;
		border: none;
		border-radius: 50rpx;
		padding: 10rpx 40rpx;
		font-size: 28rpx;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.popup-close:hover {
		background: #f0f0f0;
	}
</style>