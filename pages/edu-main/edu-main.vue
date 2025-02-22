<template>
  <view class="container">
    <view class="upper-section">
      <view class="button-container">
        <view class="button-group">
          <view class="circle-button" ref="button1" @click="navLeft">
            <img src="static/lab.png" alt="" class="itemImg">
            <text ref="text1">教学实验</text>	
          </view>
          <view class="circle-button" ref="button2" @click="navRight">
            <img src="static/talk.png" alt="" class="itemImg">
            <text ref="text2">知识宝库</text>
          </view>
        </view>
      </view>
    </view>
    <view class="lower-section">
      <view class="button-container">
        <view class="button-group">
          <view class="circle-button" ref="button3" @click="goFreeLab">
            <img src="static/freelab.png" alt="" class="itemImg">
            <text ref="text3">自由实验</text>
          </view>
          <view class="circle-button" ref="button4" @click="goKnowledge">
            <img src="static/knowledge.png" alt="" class="itemImg">
            <text ref="text4">互动问答</text>
          </view>
        </view>
      </view>
    </view>
    <img src="static/tree.png" alt="Tree Image" class="tree-image" /> <!-- 添加图像 -->
    <view class="background-animation"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      windowWidth: 0,
      windowHeight: 0,
    };
  },
  mounted() {
    const systemInfo = uni.getSystemInfoSync();
    this.windowWidth = systemInfo.windowWidth;
    this.windowHeight = systemInfo.windowHeight;
    this.animateText();
  },
  methods: {
    navLeft() {
      uni.navigateTo({ url: '/pages/lab/lab' });
    },
    navRight() {
      uni.navigateTo({ url: '/pages/store/store' });
    },
    goKnowledge() {
      uni.navigateTo({ url: '/pages/knowledge/knowledge' });
    },
    goFreeLab() {
      uni.navigateTo({ url: '/pages/freelab/freelab' });
    },
    animateText() {
      let offset = 0;
      setInterval(() => {
        offset = (offset + 1) % 100; // Adjust range as needed
        const query = uni.createSelectorQuery().in(this);
        const texts = ['text1', 'text2', 'text3', 'text4'];
        texts.forEach(textRef => {
          query.select(`[ref="${textRef}"]`).fields({ node: true, size: true }, (res) => {
            if (res && res.node) {
              const textNode = res.node;
              textNode.style.textShadow = `0 0 ${5 + offset}px yellow, 0 0 10px white`;
            }
          }).exec();
        });
      }, 50); // Adjust speed as needed
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100vh;
  position: relative;
}

.upper-section {
  flex: 1;
  background: linear-gradient(180deg, rgba(102, 187, 106, 0.9), rgba(27, 94, 32, 0.9), rgba(255, 152, 0, 0.1));
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.lower-section {
  flex: 1;
  background: linear-gradient(180deg, rgba(255, 152, 0, 0.9), rgba(255, 236, 179, 0.9), rgba(102, 187, 106, 0.1));
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  z-index: 2;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20rpx;
  width: 60%;
}

.circle-button {
  position: relative;
  width: 220rpx;
  height: 220rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30rpx 0;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #10B078;
  font-size: 36rpx;
  font-weight: bold;
  z-index: 3;
  animation: button-appear 1s ease;
}

.circle-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.3);
}

.circle-button text {
  text-align: center;
  margin-left: 10rpx;
  font-size: 36rpx;
}

.itemImg {
  width: 50rpx;
  height: 50rpx;
}

.tree-image {
  position: absolute; /* 设置为绝对定位 */
  top: 50%; /* 设定在适当的位置，调整为所需的百分比以放置在交界处 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 精确居中 */
  width: 50%; /* 根据需要调整大小 */
  height: auto; /* 保持比例 */
  z-index: 4; /* 确保在背景之上 */
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, rgba(102, 187, 106, 0.2), rgba(27, 94, 32, 0.2), rgba(255, 152, 0, 0.2));
  animation: gradient-animation 10s ease-in-out infinite;
}

@keyframes button-appear {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes gradient-animation {
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
</style>