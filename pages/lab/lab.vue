<template>
	<view class="content">
		<view class="experiment-list">
			<view v-for="(experiment, index) in experiments" :key="index" class="experiment-item"
				@click="navigateToExperiment(experiment.id)">
				<!-- 图片 -->
				<image :src="experiment.image" class="experiment-image"></image>
				<!-- 实验名称 -->
				<text class="experiment-name">{{ experiment.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				experiments: [{
						id: 1,
						name: '实验一：探究光照对植物生长的影响',
						image: '/static/lab1.jpg',
					},
					{
						id: 2,
						name: '实验二：探究氧气浓度对植物生长的影响',
						image: '/static/lab2.jpg',
					},
					{
						id: 3,
						name: '实验三：探究植物生长过程中土壤微量元素的变化',
						image: '/static/lab3.jpg',
					},
					{
						id: 4,
						name: '实验四：观察植物的组成结构',
						image: '/static/lab4.jpg',
					},
					{
						id: 5,
						name: '实验五：探究植物生长的向光性',
						image: '/static/lab5.jpg',
					}
				]
			};
		},
		methods: {
			navigateToExperiment(experimentId) {
				const pagePath = `/pages/labs/lab${experimentId}/lab${experimentId}`;
				uni.navigateTo({
					url: pagePath
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
		padding: 20rpx;
		min-height: 100vh;
	}

	.experiment-list {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
	}

	.experiment-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 0.8);
		/* 半透明背景 */
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10rpx);
		/* 毛玻璃效果 */
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.experiment-item:hover {
		transform: translateY(-10rpx);
		box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.3);
	}

	.experiment-image {
		width: 100%;
		height: 300rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		object-fit: cover;
	}

	.experiment-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #10B078;
		text-align: center;
	}
</style>