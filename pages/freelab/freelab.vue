<template>
	<view class="content">
		<!-- 自由实验区简介 -->
		<view class="section head">
			<view class="title-box">
				<text class="title">🌱 自由实验区简介</text>
			</view>
			<text class="content">
				在自由实验区中，您可以自由调整光照、氧气浓度、通氧间隔以及查询土壤中的氮、磷、钾含量。通过调整这些参数，您可以观察植物在不同条件下的生长情况，并优化植物的生长环境。自由实验区为您提供了一个全面的实验平台，帮助您更好地理解植物生长的各种影响因素。
			</text>
		</view>

		<!-- 实验区 -->
		<view class="section experiment-area">
			<view class="title-box">
				<text class="title">🔬 自由实验区</text>
			</view>

			<!-- 光照时长 -->
			<view class="input-group">
				<text class="label">🌞 光照时长（小时）：</text>
				<slider v-model="lightDuration" min="0" max="24" step="1" show-value activeColor="#10B078" />
			</view>

			<!-- 光照间隔 -->
			<view class="input-group">
				<text class="label">⏳ 光照间隔（分钟）：</text>
				<slider v-model="lightInterval" min="0" max="120" step="10" show-value activeColor="#10B078" />
			</view>

			<!-- 氧气浓度 -->
			<view class="input-group">
				<text class="label">🌬️ 氧气浓度（%）：</text>
				<slider v-model="oxygenConcentration" min="0" max="100" step="1" show-value activeColor="#10B078" />
			</view>

			<!-- 通氧间隔 -->
			<view class="input-group">
				<text class="label">⏳ 通氧间隔（分钟）：</text>
				<slider v-model="oxygenInterval" min="0" max="120" step="10" show-value activeColor="#10B078" />
			</view>

			<!-- 查询时间 -->
			<view class="input-group">
				<text class="label">📅 查询时间：</text>
				<picker mode="date" :value="queryDate" :start="startDate" :end="endDate" @change="onDateChange">
					<view class="picker">{{ queryDate }}</view>
				</picker>
			</view>

			<!-- 提交按钮 -->
			<button @click="submitParameters" class="submit-button">🚀 提交</button>

			<!-- 查询土壤数据按钮 -->
			<button @click="fetchSoilData" class="submit-button">🔍 查询土壤数据</button>

			<!-- 反馈结果 -->
			<view v-if="feedback" class="feedback">
				<view class="title-box">
					<text class="title">📊 系统反馈</text>
				</view>
				<view class="feedback-score">⭐ 总评分：{{ feedback.total_score }}</view>
				<view class="feedback-score">🌞 光照时长评分：{{ feedback.scores.lightDuration }}</view>
				<view class="feedback-score">⏳ 光照间隔评分：{{ feedback.scores.lightInterval }}</view>
				<view class="feedback-score">🌬️ 通氧时长评分：{{ feedback.scores.oxygenDuration }}</view>
				<view class="feedback-score">⏳ 通氧间隔评分：{{ feedback.scores.oxygenInterval }}</view>
				<view class="feedback-suggestion">💡 建议：{{ feedback.feedback }}</view>
			</view>

			<!-- 查询结果 -->
			<view v-if="soilData" class="feedback">
				<view class="title-box">
					<text class="title">📊 土壤微量元素含量</text>
				</view>
				<text class="feedback-score">🌿 氮含量：{{ soilData.nitrogen }} mg/kg</text>
				<text class="feedback-score">🌿 磷含量：{{ soilData.phosphorus }} mg/kg</text>
				<text class="feedback-score">🌿 钾含量：{{ soilData.potassi }} mg/kg</text>
			</view>
		</view>

		<!-- 跳转到视频直播板块 -->
		<view class="section">
			<button @click="navigateToVideo" class="video-button item">📺 进入视频直播</button>
		</view>

		<!-- 评论区 -->
		<view class="section">
			<view class="title-box">
				<text class="title">💬 评论区</text>
			</view>
			<view v-if="comments.length > 0">
				<view v-for="(comment, index) in comments" :key="index" class="comment-item">
					<text class="comment-content">{{ comment.content }}</text>
					<text class="comment-info">
						评论人：{{ comment.user_name }} | 时间：{{ comment.created_time }}
					</text>
				</view>
			</view>
			<view v-else class="no-comments">
				<text>暂无评论，快来发表你的看法吧！</text>
			</view>

			<!-- 发表评论 -->
			<view class="comment-input">
				<textarea v-model="newCommentContent" placeholder="请输入评论内容" class="textarea" />
				<button @click="submitComment" class="submit-button">💬 发表评论</button>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/request/respberry.js';
	export default {
		data() {
			return {
				lightDuration: 12, // 光照时长，默认12小时
				lightInterval: 60, // 光照间隔，默认60分钟
				oxygenConcentration: 21, // 氧气浓度，默认21%
				oxygenInterval: 60, // 通氧间隔，默认60分钟
				queryDate: this.getCurrentDate(), // 默认查询时间为当前日期
				startDate: "2023-01-01", // 查询时间范围起始日期
				endDate: this.getCurrentDate(), // 查询时间范围结束日期
				feedback: null, // 系统反馈
				soilData: null, // 土壤微量元素数据
				comments: [], // 评论列表
				newCommentContent: "", // 新评论内容
			};
		},
		created() {
			this.fetchComments(); // 页面加载时获取评论列表
		},
		methods: {
			// 获取当前日期
			getCurrentDate() {
				const date = new Date();
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			},

			// 日期选择器变化事件
			onDateChange(e) {
				this.queryDate = e.detail.value;
			},

			// 提交参数
			// 提交参数
			async submitParameters() {
				const params = {
					url: "/plantGrowth/adjustParameters",
					method: "POST",
					data: {
						userid: 1, // 用户ID（可根据实际需求修改）
						plantid: 1, // 植物ID（可根据实际需求修改）
						parameters: {
							lightDuration: this.lightDuration,
							lightInterval: this.lightInterval,
							oxygenDuration: this.oxygenConcentration,
							oxygenInterval: this.oxygenInterval,
						},
					},
					header: {
						"Content-Type": "application/json",
					},
				};

				try {
					// 调用封装的请求函数
					const res = await request(params);
					console.log('后端返回的数据：', res); // 添加日志输出

					// 处理接口返回的数据
					if (res.evaluation_result) {
						this.feedback = res.evaluation_result;
						uni.showToast({
							title: "提交成功",
							icon: "success",
						});
					} else {
						uni.showToast({
							title: "提交失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("接口调用失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},


			// 查询土壤微量元素数据
			async fetchSoilData() {
				const params = {
					timestamp: `${this.queryDate} 00:00:00`, // 格式化为 yyyy-MM-dd HH:mm:ss
				};

				try {
					const res = await uni.request({
						url: "/system/soilElements",
						method: "GET",
						data: params,
						header: {
							"Content-Type": "application/json",
						},
					});

					if (res.data.code === 1) {
						this.soilData = res.data.data;
						uni.showToast({
							title: "查询成功",
							icon: "success",
						});
					} else {
						uni.showToast({
							title: "查询失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("查询失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},

			// 跳转到视频直播板块
			navigateToVideo() {
				uni.navigateTo({
					url: "/pages/video/video",
				});
			},

			// 获取评论列表
			async fetchComments() {
				try {
					const res = await uni.request({
						url: "/system/getExperimentComments",
						method: "GET",
						header: {
							"Content-Type": "application/json",
						},
					});

					if (res.data.code === 1) {
						this.comments = res.data.data;
					} else {
						uni.showToast({
							title: "获取评论失败",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("获取评论失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},

			// 发表评论
			async submitComment() {
				if (!this.newCommentContent) {
					uni.showToast({
						title: "评论内容不能为空",
						icon: "none",
					});
					return;
				}

				const params = {
					user_id: 1, // 用户ID（可根据实际需求修改）
					content: this.newCommentContent,
				};

				try {
					const res = await uni.request({
						url: "/system/makeExperimentComments",
						method: "POST",
						data: params,
						header: {
							"Content-Type": "application/json",
						},
					});

					if (res.data.code === 1) {
						uni.showToast({
							title: "评论成功",
							icon: "success",
						});
						this.newCommentContent = "";
						this.fetchComments(); // 刷新评论列表
					} else {
						uni.showToast({
							title: "评论失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("发表评论失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},
		},
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
		padding: 10rpx;
		min-height: 100vh;
		line-height: 1.5;
	}

	.section {
		margin-bottom: 40rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10rpx);
		padding: 20rpx;
	}

	.title-box {
		background-color: #10B078;
		padding: 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
		line-height: 1.8;
	}

	.content-text {
		font-size: 18px;
		color: #555;
		line-height: 1.8;
		padding: 20px;
	}

	.experiment-area {
		background-color: rgba(255, 255, 255, 0.8);
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.input-group {
		margin-bottom: 30rpx;
	}

	.label {
		font-size: 28rpx;
		color: #10B078;
		margin-bottom: 10rpx;
		line-height: 1.6;
	}

	.submit-button {
		background-color: #10B078;
		color: #fff;
		font-size: 28rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		text-align: center;
		margin: 20rpx 0;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		line-height: 1.5;
	}

	.submit-button:hover {
		transform: translateY(-5rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.feedback {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.feedback-score,
	.feedback-suggestion {
		font-size: 28rpx;
		color: #555;
		margin-bottom: 10rpx;
		line-height: 1.6;
	}

	.comment-item {
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.comment-content {
		font-size: 28rpx;
		color: #555;
		margin-bottom: 10rpx;
		line-height: 1.6;
	}

	.comment-info {
		font-size: 24rpx;
		color: #888;
		line-height: 1.6;
	}

	.no-comments {
		text-align: center;
		padding: 20rpx;
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
	}

	.comment-input {
		margin-top: 20rpx;
	}

	.textarea {
		width: 100%;
		padding: 20rpx;
		border: 1rpx solid #ddd;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		height: 200rpx;
		line-height: 1.6;
	}

	.video-button {
		background-color: #FFA500;
		color: #fff;
		font-size: 28rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		text-align: center;
		margin: 20rpx 0;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		line-height: 1.5;
	}

	.video-button:hover {
		transform: translateY(-5rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}
</style>