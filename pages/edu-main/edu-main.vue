<template>
  <view class="container">
    <view class="button-container">
      <view class="circle-button" @click="navLeft">
        <img src="static/lab.png" alt="" class="itemImg">
        <text>教学实验</text>
      </view>
      <view class="circle-button" @click="navRight">
		  <img src="static/talk.png" alt="" class="itemImg">
        <text>互动讨论</text>
      </view>
      <view class="circle-button" @click="goFreeLab">
		   <img src="static/freelab.png" alt="" class="itemImg">
        <text>自由实验</text>
      </view>
	  <view class="circle-button" @click="goKnowledge">
	  		   <img src="static/knowledge.png" alt="" class="itemImg">
	    <text>知识问答</text>
	  </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    navLeft() {
      uni.navigateTo({
        url: '/pages/lab/lab'
      });
    },
    navRight() {
      uni.navigateTo({
        url: '/pages/talk/talk'
      });
    },
	goKnowledge() {
	  uni.navigateTo({
	    url: '/pages/knowledge/knowledge'
	  });
	},
    goFreeLab() {
      uni.navigateTo({
        url: '/pages/freelab/freelab'
      });
    }
  }
}
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

.container {
   display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    width: 100%;
    height: 100vh;
    animation: gradientBackground 15s ease infinite;
}

.button-container {
  display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
    grid-gap: 20rpx; /* Adjust spacing as needed */
    width: 60%; /* Adjust width as needed for better centering */
}

.circle-button {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20rpx 0;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #10B078;
  font-size: 32rpx;
  font-weight: bold;
}

.circle-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.3);
}

.circle-button text {
  text-align: center;
  margin-left: 10rpx; /* Added margin to separate icon and text */
}

.itemImg {
  width: 40rpx; /* Adjust as needed */
  height: 40rpx; /* Adjust as needed */
}
</style>