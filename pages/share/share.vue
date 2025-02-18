<template>
	<view>
		<!-- 页面内容 -->
		<view class="container">
			<view class="box">
				<view class="chat">
					<view class="chat-items">
						<image src="/static/introduction.jpg" class="img"
							style="margin-left: 10rpx;border-radius: 50%;border: 3px solid #FAF490;" />
					</view>
					<view class="chat-items">
						<view class="name">专业客服</view>
						<view class="text">置顶</view>
					</view>
					<view class="chat-items">
						<img src="/static/top.png" style="height: 50rpx;width: 50rpx;">
					</view>
				</view>
			</view>
			<view class="content">
				感谢大家使用我们的产品，如遇问题，可以点击我的头像与我私聊哦！<br>
				愿大家收获满满！
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {
			// 页面加载时立即跳转到 virtual 页面
			uni.redirectTo({
				url: "/pages/virtual/virtual", // 跳转到 virtual 页面
			});
		},
		methods: {},
	};
</script>

<style>
	.box {
		margin: 20rpx;
	}

	.container {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #DDE3E9;
	}

	.chat {
		display: flex;
		height: 100rpx;
		width: 100%;
		padding-bottom: 8rpx;
		margin-top: 8rpx;
		justify-content: space-between;
		flex-direction: row;
	}

	.chat-items:nth-child(2) {
		flex: 1;
		align-items: flex-start;
	}

	.img {
		height: 80rpx;
		width: 80rpx;
	}

	.name {
		margin-left: 12rpx;
		font-size: 15px;
		font-weight: 600;
	}

	.text {
		margin-left: 15rpx;
		margin-top: 10rpx;
		font-size: 12px;
		color: #B6B6B6;
	}

	.button {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-around;
	}

	.buttonItem {
		height: 50rpx;
		width: 50rpx;
	}

	.content {
		margin-left: 25rpx;
		margin-right: 25rpx;
	}
</style>