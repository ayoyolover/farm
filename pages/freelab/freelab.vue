<template>
  <view class="content">
    <!-- 自由实验区简介 -->
    <view class="section head">
      <view class="title-box">
        <div class="icon-text-container">
          <img src="static/fplant.png" alt="" class="itemImg">
          <text class="title"> 
            自由实验区简介
          </text>
        </div>
      </view>
      <text >
        在自由实验区中，您可以自由调整光照、氧气浓度、通氧间隔以及查询土壤中的氮、磷、钾含量。通过调整这些参数，您可以观察植物在不同条件下的生长情况，并优化植物的生长环境。自由实验区为您提供了一个全面的实验平台，帮助您更好地理解植物生长的各种影响因素。
      </text>
    </view>

    <!-- 实验区 -->
    <view class="section experiment-area">
      <view class="title-box">
        <text class="title">🔬 自由实验区</text>
      </view>
      <view class="parameter-group">
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
          <text class="label">🌬️ 通氧时长（小时）：</text>
          <slider v-model="oxygenConcentration" min="0" max="24" step="1" show-value activeColor="#10B078" />
        </view>

        <!-- 通氧间隔 -->
        <view class="input-group">
          <text class="label">⏳ 通氧间隔（分钟）：</text>
          <slider v-model="oxygenInterval" min="0" max="120" step="10" show-value activeColor="#10B078" />
        </view>
      </view>

      <!-- 提交按钮 -->
      <button @click="submitParameters" class="submit-button">🚀 提交</button>

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

    </view>

    <!-- 查询结果 -->
    <view v-if="soilData" class="feedback">
      <view class="title-box">
        <text class="title">📊 土壤微量元素含量</text>
      </view>
      <!-- 氮磷钾元素三色折线图 -->
      <view class="chart-container">
        <view class="charts-box">
          <qiun-data-charts type="line" :opts="elementOPT" :chartData="elementData" :ontouch="true" />
        </view>
      </view>
      <!-- 查询土壤数据相关操作框 -->
      <view class="parameter-group">
        <!-- 查询时间 -->
        <view class="input-group">
          <text class="label">📅 查询时间：</text>
          <picker mode="date" :value="queryDate" :start="startDate" :end="endDate" @change="onDateChange">
            <view class="picker">{{ queryDate }}</view>
          </picker>
        </view>

        <!-- 查询土壤数据按钮 -->
        <button @click="fetchSoilData" class="submit-button">🔍 查询土壤数据</button>
      </view>
    </view>
	<br>

    <view class="section photo-box">
      <view class="title-box">
        <text class="title">📷 植物生长记录</text>
      </view>

      <!-- 开启定期拍照按钮 -->
      <button @click="capturePhoto" class="submit-button">📸 开启定期拍照</button>

      <!-- 图片展示区 -->
      <view v-if="capturedPhotoUrl" class="photo-display">
        <image :src="capturedPhotoUrl" mode="aspectFit" class="photo" />
      </view>

      <!-- 开启植培点滴按钮 -->
      <button @click="generatePhotos" class="submit-button">🌱 开启植培点滴</button>

      <!-- 植培点滴图片展示区 -->
      <view v-if="generatedPhotoUrls.length > 0" class="photo-display">
        <view class="photo-grid">
          <image
            v-for="(url, index) in generatedPhotoUrls"
            :key="index"
            :src="url"
            mode="aspectFit"
            class="photo"
          />
        </view>
      </view>
    </view>

    <!-- 跳转到视频直播板块 -->
    <view class="section">
      <view class="title-box">
        <text class="title">📺 视频直播</text>
      </view>
      <button @click="navigateToVideo" class="video-button item">📺 快来看看你的植物长势如何</button>
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
				chart: null,
				comments: [], // 评论列表
				newCommentContent: "", // 新评论内容
				capturedPhotoUrl: "", // 定期拍照的图片 URL
				generatedPhotoUrls: [], // 植培点滴的图片 URL 列表
				selectedPhotoIndex: null, // 当前选中的图片索引
				 elementOPT: {
				                color: ['#FFE967', '#32CD32', '#1E90FF'], // 设置折线的颜色（氮、磷、钾）
				                padding: [15, 15, 15, 15], // 调整内边距使图表更美观
				                enableScroll: true, // 启用滚动
				                legend: {
				                    position: 'top', // 图例放在顶部
				                    fontSize: 11, // 设置字体大小
				                    color: '#333' // 设置图例字体颜色
				                },
				                xAxis: {
				                    type: 'category', // 横坐标类型为分类
				                    data: [], // 横坐标数据，后续通过动态更新填充
				                    disableGrid: false, // 启用网格
				                    scrollShow: true, // 启用x轴滚动
				                    itemCount: 5, // x轴最多显示5个数据点
				                    fontSize: 12, // 设置x轴标签字体大小
				                    lineColor: '#ccc', // x轴线条颜色
				                    gridColor: '#f0f0f0' // 网格颜色
				                },
				                yAxis: { // 第一个 y 轴
				                    gridType: 'solid', // 使用实线网格
				                    dashLength: 4, // 调整虚线长度
				                    fontSize: 12, // 设置y轴字体大小
				                    lineColor: '#ccc', // y轴线条颜色
				                    axisLabel: { // 设置y轴标签
				                        color: '#333' // y 轴标签颜色
				                    },
				                    name: '含量 (mg/kg)', // y 轴名称
				                },
				                extra: {
				                    line: {
				                        type: 'curve', // 设置折线为曲线
				                        width: 2, // 增加线宽
				                        activeType: 'hollow', // 设置激活点为空心
				                        smooth: true // 启用平滑曲线
				                    }
				                }
				            },
				elementData: {
				                categories: [], // 横坐标数据
				                series: [] // 数据系列
				            }
			};
		},
		created() {
			this.fetchComments(); // 页面加载时获取评论列表
		},
		onReady() {
		    this.fetchSoilData();
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
			
			async capturePhoto() {
			  const user_id = 666666; // 用户 ID
			  try {
			    const res = await uni.request({
			      url: `http://192.168.1.109:5000/capture/user?user_id=${user_id}`,
			      method: "GET",
			    });
			
			    // 打印请求返回的结果
			    console.log('请求返回的结果:', res);
			
			    if (res.data && res.data.image_url) {
			      this.capturedPhotoUrl = res.data.image_url; // 更新图片 URL
			      uni.showToast({
			        title: "拍照成功",
			        icon: "success",
			      });
			    } else {
			      uni.showToast({
			        title: "拍照失败，请重试",
			        icon: "none",
			      });
			    }
			  } catch (error) {
			    console.error("拍照失败：", error);
			    uni.showToast({
			      title: "网络错误，请重试",
			      icon: "none",
			    });
			  }
			},
			
			    // 开启植培点滴
			    async generatePhotos() {
			      const user_id = 666666; // 用户 ID
			      try {
			        const res = await uni.request({
			          url: `http://192.168.1.109:5000/generatePhotos?user_id=${user_id}`,
			          method: "GET",
			        });
					console.log(res);
			        if (res.data && res.data.photos && res.data.photos.length > 0) {
			          // 只保留奇数张图片
			          this.generatedPhotoUrls = res.data.photos.filter((url, index) => index % 2 === 0);
			          uni.showToast({
			            title: "获取图片成功",
			            icon: "success",
			          });
			        } else {
			          uni.showToast({
			            title: "获取图片失败，请重试",
			            icon: "none",
			          });
			        }
			      } catch (error) {
			        console.error("获取图片失败：", error);
			        uni.showToast({
			          title: "网络错误，请重试",
			          icon: "none",
			        });
			      }
			    },
			
			    // 选择图片
			    selectPhoto(index) {
			      this.selectedPhotoIndex = index;
			    },

			// 查询土壤微量元素数据
			// 查询土壤微量元素数据
			    async fetchSoilData() {
			                // 获取当前时间并格式化为 yyyy-MM-dd HH:mm:ss
			                const now = new Date();
			                const year = now.getFullYear();
			                const month = String(now.getMonth() + 1).padStart(2, '0');
			                const day = String(now.getDate()).padStart(2, '0');
			                const hours = String(now.getHours()).padStart(2, '0');
			                const minutes = String(now.getMinutes()).padStart(2, '0');
			                const seconds = String(now.getSeconds()).padStart(2, '0');
			                const timestamp = `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
			                console.log(timestamp);
			                const currentTime = {
			                    currentTime: timestamp // 格式化为 yyyy-MM-dd HH:mm:ss
			                };
			    
			                try {
			                    const res = await uni.request({
			                        url: "http://124.221.52.73:8080/system/soilElements",
			                        method: "GET",
			                        data: currentTime,
			                        header: {
			                            "Content-Type": "application/json"
			                        }
			                    });
			    
			                    if (res.data && res.data.data && res.data.data.length > 0) {
			                        this.soilData = res.data.data;
			                        this.renderChart();
			                    }
			                } catch (error) {
			                    console.error('获取土壤数据失败:', error);
			                }
			            },
			            renderChart() {
			                const nitrogenData = [];
			                const phosphorusData = [];
			                const potassiumData = [];
			                const times = [];
			    
			                this.soilData.forEach(item => {
			                    nitrogenData.push(parseFloat(item.staValue['土壤氮']));
			                    phosphorusData.push(parseFloat(item.staValue['土壤磷']));
			                    potassiumData.push(parseFloat(item.staValue['土壤钾']));
								times.push(Number(item.staTime.slice(5, 7)) + '.' + Number(item.staTime
									.slice(8,
										10)));
			                });
			    
			                this.elementOPT.xAxis.data = times;
			                this.elementData.categories = times;
			                this.elementData.series = [
			                    {
			                        name: '氮含量',
			                        data: nitrogenData
			                    },
			                    {
			                        name: '磷含量',
			                        data: phosphorusData
			                    },
			                    {
			                        name: '钾含量',
			                        data: potassiumData
			                    }
			                ];
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
		   mounted() {
		          this.fetchSoilData();
		      }
	};
</script>

<style>
 .content {
   padding: 10rpx;
   min-height: 100vh;
   line-height: 1.5;
   background-image: url('../../static/fback.jpg'); /* 仅保留背景图片 */
   background-size: cover;
   background-repeat: no-repeat;
 }
 
 .icon-text-container {
   display: flex;
   align-items: center;
 }
 
 .itemImg {
   width: 50rpx;
   height: 50rpx;
 }
 
 .section {
   margin-bottom: 60rpx;
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
   text-align: left;
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
   background-color: #81D4FA;
   color: #000;
   font-size: 28rpx;
   padding: 20rpx;
   border-radius: 20rpx;
   text-align: center;
   margin: 20rpx auto;
   box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   line-height: 1.5;
   display: block;
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
 
 .chart-container {
   width: 100%;
   height: 400px;
 }
 
 .charts-box {
   width: 100%;
   height: 100%;
 }
 
 .photo-box {
   margin-bottom: 40rpx;
   background-color: rgba(255, 255, 255, 0.8);
   border-radius: 20rpx;
   box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
   padding: 20rpx;
 }
 
 .photo-display {
   margin-top: 20rpx;
 }
 
 .photo {
   width: 100%;
   height: 300rpx;
   border-radius: 10rpx;
   margin-bottom: 10rpx;
 }
 
 .photo-grid {
   display: flex;
   flex-wrap: wrap;
   gap: 10rpx;
 }
 
 .photo-grid.photo {
   width: calc(50% - 5rpx);
   height: 200rpx;
 }
 
 .photo-grid.photo.selected {
   border: 4rpx solid #10B078;
 }
 
 .video-button {
   background-color: #81D4FA;
   color: #000;
   font-size: 28rpx;
   padding: 20rpx;
   border-radius: 20rpx;
   text-align: center;
   margin: 20rpx auto;
   box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   line-height: 1.5;
   display: block;
 }
 
 .video-button:hover {
   transform: translateY(-5rpx);
   box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
 }
 
 .parameter-group {
   background-color: #f4f4f4;
   padding: 20rpx;
   border-radius: 10rpx;
 }
</style>