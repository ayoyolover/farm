<template>
  <view class="content">
    <!-- 实验简介 -->
    <view class="section head" @click="goVirtual">
      <view class="title-box">
        <text class="title">🌱 实验简介</text>
      </view>
      <text class="content">
        植物的呼吸作用需要氧气。在呼吸作用中，植物细胞利用氧气分解有机物，释放能量用于生命活动。 
		 如果氧气供应不足 ，植物的细胞呼吸作用就会受到抑制，能量供应减少，从而影响植物的生长发育。 
		 严重缺氧的情况下，植物会进行无氧呼吸，产生酒精或乳酸等代谢产物，这些产物会对植物细胞造成毒害，最终导致植物死亡。
		  然而，若氧气浓度过高，也会对植物产生一定的负面影响。
      </text>
    </view>

    <!-- 实验基本步骤 -->
    <view class="section function">
      <view class="title-box">
        <text class="title">📝 实验基本步骤</text>
      </view>
      <text class="content">
        首先设置氧气浓度和通氧间隔，然后点击“提交”按钮，获取系统的反馈，接下来根据反馈调整参数，观察植物生长情况。
      </text>
    </view>

    <!-- 实验区 -->
    <view class="section experiment-area brightness-control">
      <view class="title-box">
        <text class="title">🔬 实验区</text>
      </view>

      <!-- 氧气浓度 -->
      <view class="input-group">
        <text class="label">🌬️ 氧气浓度（%）：</text>
        <slider
          v-model="oxygenConcentration"
          min="0"
          max="100"
          step="1"
          show-value
          activeColor="#10B078"
        />
      </view>

      <!-- 通氧间隔 -->
      <view class="input-group">
        <text class="label">⏳ 通氧间隔（分钟）：</text>
        <slider
          v-model="oxygenInterval"
          min="0"
          max="120"
          step="10"
          show-value
          activeColor="#10B078"
        />
      </view>

      <!-- 提交按钮 -->
      <button @click="submitParameters" class="submit-button">🚀 提交</button>

      <!-- 反馈结果 -->
      <view v-if="feedback" class="feedback medal-wall">
        <view class="title-box">
          <text class="title">📊 系统反馈</text>
        </view>
        <text class="feedback-score">⭐ 打分：{{ feedback.score }}</text>
        <text class="feedback-suggestion">💡 建议：{{ feedback.suggestions }}</text>
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
          class="comment-item medal-item"
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
      oxygenConcentration: 21, // 氧气浓度，默认21%
      oxygenInterval: 60, // 通氧间隔，默认60分钟
      feedback: null, // 系统反馈
      comments: [], // 评论列表
      newCommentContent: "", // 新评论内容
    };
  },
  created() {
    this.fetchComments(); // 页面加载时获取评论列表
  },
  methods: {
    // 提交参数
    async submitParameters() {
      const params = {
        userid: 1, // 用户ID（可根据实际需求修改）
        plantid: 1, // 植物ID（可根据实际需求修改）
        parameters: {
          lightDuration: 0, // 光照时长（本实验未涉及）
          lightInterval: 0, // 光照间隔（本实验未涉及）
          oxygenDuration: this.oxygenConcentration, // 氧气浓度
          oxygenInterval: this.oxygenInterval, // 通氧间隔
        },
      };

      try {
        // 调用接口
        const res = await uni.request({
          url: "/system/plantGrowth/adjustParameters", // 添加 system 前缀
          method: "POST",
          data: params,
          header: {
            "Content-Type": "application/json",
          },
        });

        // 处理接口返回的数据
        if (res.data.code === 1) {
          this.feedback = res.data.data.feedback;
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
          url: "/system/getExperimentComments", // 添加 system 前缀
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
          url: "/system/makeExperimentComments", // 添加 system 前缀
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
    goVirtual() {
      uni.navigateTo({
        url: "/pages/virtual/virtual"
      });
    }
  },
};
</script>

<style scoped>
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
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  border-radius: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10rpx); /* 毛玻璃效果 */
  padding: 20rpx;
}

.title-box {
  background-color: #10B078; /* 标题背景颜色 */
  padding: 20rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  line-height: 1.8; /* 放大标题行间距 */
}

.content-text {
  font-size: 18px; /* 加大正文字号 */
  color: #555;
  line-height: 1.8; /* 增加行高 */
  padding: 20px; /* 增加内容内边距 */
}

.experiment-area {
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
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
  line-height: 1.6; /* 放大标签行间距 */
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
  line-height: 1.5; /* 放大按钮文本行间距 */
}

.submit-button:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
}

.feedback {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  border-radius: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
}

.feedback-score,
.feedback-suggestion {
  font-size: 28rpx;
  color: #555;
  margin-bottom: 10rpx;
  line-height: 1.6; /* 放大反馈信息行间距 */
}

.comment-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.comment-content {
  font-size: 28rpx;
  color: #555;
  margin-bottom: 10rpx;
  line-height: 1.6; /* 放大评论内容行间距 */
}

.comment-info {
  font-size: 24rpx;
  color: #888;
  line-height: 1.6; /* 放大评论信息行间距 */
}

.no-comments {
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6; /* 放大无评论提示行间距 */
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
}

.video-button {
  background-color: #10B078;
  color: #fff;
  font-size: 28rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  text-align: center;
  margin: 20rpx 0;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  line-height: 1.5; /* 放大按钮文本行间距 */
}

.video-button:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
}
</style>