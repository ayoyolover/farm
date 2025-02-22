<template>
	<view class="container">
		<!-- 按日期分组展示照片 -->
		<view v-for="(group, date) in groupedPhotos" :key="date" class="date-group">
			<text class="date-label">{{ date }}</text> <!-- 直接使用 yyyy-mm-dd 格式 -->
			<view class="grid">
				<view v-for="(item, index) in group" :key="index" class="grid-item">
					<image :src="item.url" class="grid-image" mode="aspectFill" @click="toggleSelect(item)"
						:class="{ 'selected-opacity': item.selected }" />
					<view v-if="item.selected" class="selected-icon">
						<text class="iconfont icon-checkmark" style="color: white;">√</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 一键生成视频按钮 -->
		<view class="button-container">
			<button type="primary" size="mini" @click="handleMovie" :disabled="selectedCount < 3 || selectedCount > 5">
				一键生成视频
			</button>
			<!-- 提示信息 -->
			<text v-if="selectedCount < 3" class="hint-text">请至少选择三张照片</text>
			<text v-if="selectedCount > 5" class="hint-text">最多只能选择五张照片</text>
		</view>

		<!-- 视频播放区域 -->
		<video v-if="movieLink" :src="movieLink" controls class="video"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				array: [{
						url: "/static/farm/chart.png",
						date: "2025-02-15T10:00:00",
						selected: false
					},
					{
						url: "/static/farm/farming.png",
						date: "2025-02-15T12:30:00",
						selected: false
					},
					{
						url: "/static/farm/film-on.png",
						date: "2025-02-16T08:00:00",
						selected: false
					},
					{
						url: "/static/farm/film-off.png",
						date: "2025-02-16T09:00:00",
						selected: false
					},
					{
						url: "/static/farm/movie.png",
						date: "2025-02-17T14:00:00",
						selected: false
					},
					{
						url: "/static/farm/Picon.png",
						date: "2025-02-17T14:00:00",
						selected: false
					},
				],
				movieLink: "", // 视频链接
			};
		},
		computed: {
			// 按日期分组的照片
			groupedPhotos() {
				const groups = {};
				this.array.forEach(item => {
					// 提取 yyyy-mm-dd 格式的日期
					const date = new Date(item.date).toISOString().split("T")[0];
					if (!groups[date]) {
						groups[date] = [];
					}
					groups[date].push(item);
				});
				return groups;
			},
			selectedCount() {
				// 计算已选择的照片数量
				return this.array.filter(item => item.selected).length;
			},
		},
		methods: {
			toggleSelect(item) {
				// 切换照片选中状态
				if (this.selectedCount >= 5 && !item.selected) {
					uni.showToast({
						title: "最多只能选择5张照片",
						icon: "none",
					});
					return;
				}
				item.selected = !item.selected;
			},
			handleMovie() {
				// 生成视频
				if (this.selectedCount < 3) {
					uni.showToast({
						title: "至少需要选择3张照片",
						icon: "none",
					});
					return;
				}
				uni.showLoading({
					title: "视频生成中",
				});
				// 提取选中的照片URL
				const selectedUrls = this.array
					.filter(item => item.selected)
					.map(item => item.url)
					.join(",");

				uni.request({
					url: "http://124.221.52.73:80/get_video_url",
					method: "GET",
					data: {
						photos: selectedUrls,
					},
					success: (res) => {
						uni.hideLoading();
						this.movieLink = res.data;
						console.log(this.movieLink);
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: "视频生成失败",
							icon: "none",
						});
					},
				});
			},
		},
	};
</script>

<style>
	/* 动态渐变背景 */
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
		}
	}

	.container {
		padding: 10px;
		background: linear-gradient(270deg, #33ffff, #3333f3, #3bf333);
		background-size: 600% 600%;
		animation: gradient 15s ease infinite;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.date-group {
		margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		width: 95%;
		background: rgba(255, 255, 255, 0.9);
		/* 添加白色背景 */
		padding: 10px;
		border-radius: 12px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		/* 添加悬浮效果 */
	}

	.date-label {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
		color: #333;
		text-align: center;
		font-family: "Arial", sans-serif;
		/* 添加好看的字体 */
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: start;
		width: 100%;
	}

	.grid-item {
		width: 30%;
		position: relative;
		margin: 10px;
		border: 2px solid rgba(255, 255, 255, 0.8);
		/* 添加边框 */
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		/* 添加悬浮效果 */
		background: rgba(255, 255, 255, 0.9);
		/* 添加白色背景 */
	}

	.grid-image {
		width: 100%;
		height: 100px;
		border-radius: 8px;
		transition: opacity 0.3s ease;
	}

	.grid-image.selected-opacity {
		opacity: 0.5;
	}

	.selected-icon {
		position: absolute;
		top: 0;
		right: 0;
		background-color: rgba(0, 123, 255, 0.7);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		width: 100%;
	}

	.button-container button {
		margin-bottom: 10px;
		background: linear-gradient(135deg, #ff69b4 0%, #ffcc00 100%);
		color: white;
		font-weight: bold;
		border-radius: 20px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}

	.hint-text {
		color: red;
		font-size: 14px;
		text-align: center;
		width: 100%;
	}

	.video {
		width: 100%;
		margin-top: 20px;
		border-radius: 12px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
</style>