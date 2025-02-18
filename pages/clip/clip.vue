<template>

	<view>
		<view class="container">
			<view class="grid">
				<view v-for="(item, index) in array" :key="index" class="grid-item">
					<image :src="item" class="grid-image" mode="aspectFill" />
					<text class="grid-label">{{ index + 1 }}</text>
				</view>
			</view>
		</view>
		<view class="button-container">
			<button type="primary" size="mini" @click="handleMovie">一键生成视频</button>
		</view>
		<video :src="movieLink" v-if="movieLink"></video>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				array: [],
				movieLink: ""
			}
		},
		methods: {
			onLoad() {
				uni.request({
					url: "http://124.221.52.73:8080/system/getPhotosList?userId=27&plantId=3",
					method: 'GET',
					success: (res) => {
						console.log(res)
						this.array = res.data.data
						console.log(this.array)
					}
				})
			},
			handleMovie() {
				uni.showLoading({
					title: "视频生成中",
				})
				uni.request({
					url: "http://124.221.52.73:80/get_video_url",
					method: 'GET',
					success: (res) => {

						setTimeout(() => {
							uni.hideLoading()
							this.movieLink = res.data
							console.log(this.movieLink)
						}, 5000)

					}
				})
			}
		}
	}
</script>

<style>
	video {
		width: 100%;
	}

	.button-container {
		display: flex;
		justify-content: center;
		margin-bottom: 30rpx;
		/* 水平居中 */
	}

	.container {
		padding: 10px;
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.grid-item {
		width: 30%;
		/* 四列布局 */
		margin-bottom: 10px;
		position: relative;
	}

	.grid-image {
		width: 100%;
		height: 100px;
		/* 设置图片高度 */
		border-radius: 8px;
		/* 圆角 */
	}

	.grid-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		text-align: center;
		padding: 5px 0;
		border-radius: 0 0 8px 8px;
		/* 圆角 */
	}
</style>