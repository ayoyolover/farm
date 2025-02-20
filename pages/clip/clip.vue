<template>
	<view>
		<view class="container">
			<view class="grid">
				<view v-for="(item, index) in groupedPhotos" :key="index" class="date-group">
					<text class="date-title">{{ item.date }}</text>
					<view class="grid-items">
						<view v-for="(photo, photoIndex) in item.photos" :key="photoIndex" class="grid-item">
							<image :src="photo.url" class="grid-image" mode="aspectFill" />
							<checkbox :value="photo.url" :checked="selectedPhotos.includes(photo.url)"
								@change="toggleSelection(photo.url)" class="checkbox"
								:disabled="selectedPhotos.length >= 5 && !selectedPhotos.includes(photo.url)" />
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 显示选择限制提示 -->
		<view v-if="isButtonClicked" class="error-message">
			<text v-if="selectedPhotos.length < 3">请至少选择 3 张照片</text>
			<text v-if="selectedPhotos.length > 5">最多只能选择 5 张照片</text>
		</view>

		<view class="button-container">
			<!-- <image :src="isVideoGenerating ? '/static/farm/film-on.png' : '/static/farm/film-off.png'"
        class="film-icon" /> -->
			<view>
				<button type="primary" size="mini" @click="handleMovie" class="generate-button">
					{{ isVideoGenerating ? '正在生成...' : '一键生成视频' }}
				</button>
			</view>
			<view class="message"><text>请选择3-5张照片</text></view>

		</view>

		<video :src="movieLink" v-if="movieLink" class="video"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				array: [{
						url: "/static/farm/chart.png",
						date: "2025-02-15T10:00:00"
					},
					{
						url: "/static/farm/farming.png",
						date: "2025-02-15T12:30:00"
					},
					{
						url: "/static/farm/film-on.png",
						date: "2025-02-16T08:00:00"
					},
					{
						url: "/static/farm/film-off.png",
						date: "2025-02-16T09:00:00"
					},
					{
						url: "/static/farm/movie.png",
						date: "2025-02-17T14:00:00"
					},
					{
						url: "/static/farm/Picon.png",
						date: "2025-02-17T14:00:00"
					}
				],
				movieLink: "", // 视频链接
				selectedPhotos: [], // 存储选中的照片URL
				isVideoGenerating: false, // 控制视频生成状态
				isButtonClicked: false, // 控制按钮点击状态
			};
		},
		computed: {
			groupedPhotos() {
				const grouped = [];
				this.array.forEach((photo) => {
					const date = new Date(photo.date).toLocaleDateString(); // 根据日期分组
					const group = grouped.find(g => g.date === date);
					if (group) {
						group.photos.push(photo);
					} else {
						grouped.push({
							date,
							photos: [photo]
						});
					}
				});
				return grouped;
			},
		},
		methods: {
			onLoad() {
				// uni.request({
				//   url: "http://124.221.52.73:8080/system/getPhotosList?userId=27&plantId=3",
				//   method: 'GET',
				//   success: (res) => {
				//     this.array = res.data.data;
				//   },
				// });
			},
			toggleSelection(photoUrl) {
				// 选择或取消选择照片
				const index = this.selectedPhotos.indexOf(photoUrl);
				if (index > -1) {
					this.selectedPhotos.splice(index, 1); // 取消选择
				} else {
					if (this.selectedPhotos.length < 5) {
						this.selectedPhotos.push(photoUrl); // 选择照片
						console.log(this.selectedPhotos.length)
					}
				}
				this.isButtonClicked = false; // 取消选择时，不显示提示
			},
			handleMovie() {
				this.isButtonClicked = true; // 点击按钮后显示提示
				
				if (this.selectedPhotos.length < 3 || this.selectedPhotos.length > 5) {
					return; // 如果选择的照片少于 3 张或大于 5 张，提示用户并不生成视频
				} else {
					this.isVideoGenerating = true;
					uni.showLoading({
						title: "视频生成中"
					});
					uni.request({
						url: "http://124.221.52.73:80/get_video_url",
						method: 'POST',
						data: {
							photos: this.selectedPhotos
						},
						success: (res) => {
							setTimeout(() => {
								uni.hideLoading();
								this.movieLink = res.data;
								this.isVideoGenerating = false;
							}, 5000);
						},
					});
				}
			},
		},
	};
</script>

<style scoped>
	.container {
		padding: 20px;
	}

	.grid {
		display: flex;
		flex-direction: column;
	}

	.date-group {
		margin-bottom: 20px;
	}

	.date-title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
		color: #333;
	}

	.grid-items {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.grid-item {
		width: 48%;
		margin-bottom: 15px;
		position: relative;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.grid-image {
		width: 100%;
		height: 100px;
		object-fit: cover;
		border-radius: 8px;
	}

	.checkbox {
		position: absolute;
		top: 8px;
		right: 8px;
		background-color: transparent;
	}

	.button-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		margin-top: 30rpx;
	}

	.film-icon {
		width: 50px;
		height: 50px;
		object-fit: cover;
	}

	.generate-button {
		background-color: #4CAF50;
		color: white;
		padding: 10px 20px;
		border-radius: 25px;
		font-size: 16px;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.generate-button[disabled] {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.generate-button:hover {
		background-color: #45a049;
	}

	.error-message {
		color: #f44336;
		font-size: 14px;
		text-align: center;
		margin-top: 10px;
	}

	.message {
		color: lawngreen;
		font-size: 10px;
		text-align: center;
		margin-top: 10px;
	}

	.video {
		width: 100%;
		margin-top: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
</style>