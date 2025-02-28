<template>
	<view class="content">
		<view class="head" @click="goVirtual">
			<swiper class="swiper" circular indicator-dots="true" autoplay interval="2500" duration="1000">
				<swiper-item>
					<view class="swiper-item">
						<img src="static/farm/Ticon.png" class="img">
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<img src="static/farm/Picon.png" class="img">
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="function">
			<view class="item" @click="goVideo">
				<img src="static/farm/chart.png" class="itemImg">
				<view>数据图表</view>
			</view>
			<view class="item" @click="goFarming">
				<img src="static/farm/farming.png" class="itemImg">
				<view>开心农场</view>
			</view>
			<view class="item" @click="goClip">
				<img src="static/farm/movie.png" class="itemImg">
				<view>时光剪影</view>
			</view>
		</view>
		<view class="brightness-control">
			<view class="ITEM">种植进度：77%</view>
			<view class="slider-container">
				<view class="slider-background"></view>
			</view>
		</view>
		<view class="medal-wall">
			<view class="title">勋章墙</view>
			<view class="medal-container">
				<view class="medal-item" v-for="(medal, index) in medals" :key="index">
					<image :src="medal.image" class="medal-image" />
					<view class="medal-name">{{ medal.name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				medals: [{
						image: '/static/farm/medal01.png',
						name: "护理达人"
					},
					{
						image: "/static/farm/medal02.png",
						name: "种植能手"
					},
					{
						image: "/static/farm/medal03.png",
						name: "科学培植"
					},
					{
						image: "/static/farm/medal04.png",
						name: "农学专家"
					},
				],
			};
		},
		methods: {
			goVideo() {
				uni.navigateTo({
					url: "/pages/video/video"
				});
			},
			goFarming() {
				uni.navigateTo({
					url: "/pages/farming/farming"
				});
			},
			goVirtual() {
				uni.navigateTo({
					url: "/pages/virtual/virtual"
				});
			},
			goClip() {
				uni.navigateTo({
					url: "/pages/clip/clip"
				});
			}
		}
	};
</script>

<style>
	/* 蓝绿色渐变背景动画 */
	@keyframes gradientBackground {
		0% {
			background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
		}

		25% {
			background: linear-gradient(135deg, #80deea, #4dd0e1);
		}

		50% {
			background: linear-gradient(135deg, #26c6da, #00bcd4);
		}

		75% {
			background: linear-gradient(135deg, #80deea, #4dd0e1);
		}

		100% {
			background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
		}
	}

	.content {
		animation: gradientBackground 15s ease infinite;
		/* 背景色动态变化 */
		padding: 20rpx;
		min-height: 100vh;
	}

	.head {
		margin-bottom: 30rpx;
	}

	.swiper {
		height: 400rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.img {
		width: 100%;
		height: 100%;
		object-fit: fill;
		/* 确保图片完全覆盖 */
	}

	.function {
		display: flex;
		justify-content: space-around;
		padding: 30rpx;
		background-color: rgba(255, 255, 255, 0.8);
		/* 半透明背景 */
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		margin-bottom: 30rpx;
		backdrop-filter: blur(10rpx);
		/* 毛玻璃效果 */
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 15rpx;
		padding: 10rpx 25rpx;
		color: #10B078;
		font-size: 30rpx;
		font-weight: bold;
		background-color: rgba(255, 255, 255, 0.8);
		/* 半透明背景 */
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.item:hover {
		transform: translateY(-10rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.itemImg {
		height: 120rpx;
		width: 120rpx;
		margin-bottom: 20rpx;
	}

	.brightness-control {
		padding: 20rpx 50rpx;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.8);
		/* 半透明背景 */
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		margin-bottom: 30rpx;
		backdrop-filter: blur(10rpx);
		/* 毛玻璃效果 */
	}

	.slider-container {
		flex: 1;
		background-color: transparent;
		height: 30rpx;
		border-radius: 15rpx;
		margin-left: 20rpx;
		position: relative;
		border: 2rpx solid #e0e0e0;
	}

	.slider-background {
		background-color: #10B078;
		height: 100%;
		width: 70%;
		border-radius: 15rpx;
	}

	.ITEM {
		color: #10B078;
		font-size: 30rpx;
		font-weight: bold;
	}

	.medal-wall {
		padding: 40rpx;
		background-color: rgba(255, 255, 255, 0.8);
		/* 半透明背景 */
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10rpx);
		/* 毛玻璃效果 */
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: #10B078;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.medal-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.medal-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20rpx;
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 0.8);
		/* 半透明背景 */
		border-radius: 20rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.medal-item:hover {
		transform: translateY(-10rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.medal-image {
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 20rpx;
		border-radius: 50%;
		border: 4rpx solid #10B078;
		padding: 10rpx;
		background-color: #ffffff;
		transition: transform 0.3s ease;
	}

	.medal-image:hover {
		transform: scale(1.1);
		/* 悬停时放大 */
	}

	.medal-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #10B078;
		text-align: center;
	}
</style>