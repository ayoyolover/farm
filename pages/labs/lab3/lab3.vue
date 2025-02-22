<template>
  <view class="content">
    <!-- 实验简介 -->
    <view class="section head">
      <view class="title-box">
        <text class="title">🌱 实验简介</text>
      </view>
      <text class="content">
        实验旨在探究植物生长过程中，土壤中三种主要营养元素——氮（N）、磷（P）、钾（K）——含量的变化。氮、磷、钾是植物生长必需的大量元素，虽然它们在土壤中的含量相对较少（与碳、氢、氧相比），但它们对植物的生长发育至关重要。缺少其中任何一种，都会导致植物生长不良，甚至死亡。土壤中的氮、磷、钾等微量元素对植物生长至关重要。氮元素促进叶片生长，磷元素有助于根系发育和开花结果，钾元素则增强植物的抗病能力。通过监测土壤中这些元素的含量变化，可以更好地了解植物生长的营养需求，并优化施肥策略。
      </text>
    </view>

			<!-- 查询结果 -->
		<view>
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
        <view
          v-for="(comment, index) in comments"
          :key="index"
          class="comment-item"
        >
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
        <textarea
          v-model="newCommentContent"
          placeholder="请输入评论内容"
          class="textarea"
        />
        <button @click="submitComment" class="submit-button">💬 发表评论</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      queryDate: this.getCurrentDate(), // 默认查询时间为当前日期
      startDate: "2023-01-01", // 查询时间范围起始日期
      endDate: this.getCurrentDate(), // 查询时间范围结束日期
      soilData: null, // 土壤微量元素数据
      comments: [], // 评论列表
      newCommentContent: "", // 新评论内容
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
    mounted() {
      this.fetchSoilData(); // 自动调用获取土壤数据
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

.feedback-score {
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