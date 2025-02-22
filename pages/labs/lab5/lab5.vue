<template>
  <view class="content">
    <!-- 实验简介 -->
    <view class="section head" @click="goVirtual">
      <view class="title-box">
        <text class="title">🌱 实验简介</text>
      </view>
      <text class="content">
        植物的向光性生长是植物对光照反应的一种表现，植物体内生长素的不均匀分布是导致向光性生长的关键因素。光照会影响植物体内生长素的分布，背光侧生长素浓度较高，促进细胞伸长，从而导致植物弯向光源生长。
      </text>
    </view>

    <!-- 实验基本步骤 -->
    <view class="section function">
      <view class="title-box">
        <text class="title">📝 实验基本步骤</text>
      </view>
      <text class="content">
        步骤:
        1.准备幼苗: 选择一株生长状况良好，且已经有明显茎叶的幼苗。
        2.设置光源: 将光源放在纸盒或纸箱的一侧。
        3.放置幼苗: 将幼苗放在纸盒中央，确保它可以自由生长。
        4.遮光: 用纸盒或纸箱遮挡住幼苗，只留光源照射的一侧有光线进入。
        5.观察: 每天观察幼苗的生长情况，记录幼苗弯曲生长的情况以及弯曲方向。持续观察几天。
        6.结果: 你会发现幼苗会向光源方向弯曲生长。
      </text>
    </view>

    <!-- 给视频添加一个相似的框 -->
    <view class="section">
      <view class="title-box">
        <text class="title">📺 教学视频</text>
      </view>
      <view class="container">
        <!-- 视频组件 -->
        <video
          :src="videoUrl"
          controls
          class="video-player"
          v-if="videoUrl"
        ></video>
        <text v-else class="loading-text">加载视频中...</text>
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
import request from '@/request/124flask.js'; // 确保请求方法的引入

export default {
  data() {
    return {
      lightDuration: 12, // 光照时长，默认12小时
      lightInterval: 60, // 光照间隔，默认60分钟
      feedback: null, // 系统反馈
      comments: [], // 评论列表
      newCommentContent: "", // 新评论内容
      videoUrl: "", // 视频 URL
    };
  },
  created() {
    // 页面加载时获取评论列表
    this.fetchComments();
    this.getvideo(); // Call the function to get the video URL on component creation
    console.log("组件创建");
  },

  methods: {
    // 获取视频的url
    async getvideo() {
      const params = {
        url: "/teach_video", // 完整的接口URL
        method: "POST",
        data: {
          video_id: "1" // 传递视频ID，如果不需要可以去掉
        },
        header: {
          "Content-Type": "application/json",
        },
      };
    
      try {
        // 调用接口
        const res = await request(params);
        console.log('后端返回的数据：', res);
        
        // 确保这里的字段名为 videoUrl
        if (res && res.videoUrl) {
          this.videoUrl = res.videoUrl; // 使用 videoUrl
          console.log('视频URL:', this.videoUrl); // 确认视频 URL
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
          this.newCommentContent = ""; // 清空评论内容
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
  font-size: 28rpx;
  height: 200rpx;
  line-height: 1.6; /* 放大文本输入框行间距 */
}

.video-button {
  background-color: #FFA500; /* 橙色背景 */
  color: #fff;
  font-size: 28rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  text-align: center;
  margin: 20rpx 0;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  line-height: 1.5; /* 放大视频按钮文本行间距 */
}

.video-button:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
}

/* 视频播放器样式 */
.video-player {
  width: 100%; /* 宽度占满父容器 */
  height: 400rpx; /* 设置一个合适的高度 */
  border-radius: 20rpx; /* 圆角 */
  overflow: hidden; /* 隐藏超出部分 */
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2); /* 阴影效果 */
}
</style>