<template>
	<view>
		<view class="box">
			<view class="chat" v-for="item in chatList" @click="goChat(item)">
				<view class="chat-items">
					<image :src="`/static/${handleName(item.plantId)}.png`" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">
						您的小{{handleName(item.plantId)}}
					</view>
					<view class="text">
						{{handleContent(item.chatMessage)}}
					</view>
				</view>
				<view class="chat-items">
					<view class="time" >
						{{handleTime(item.chatMessage)}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				plantInfo: [{}],
				chatList: [{}],
				userInfo: {}
			}
		},
		methods: {
			onLoad() {
				try {
					const user = uni.getStorageSync("userInfo")
					if (user) {
						console.log("success", user)
						this.userInfo = user
					}
				} catch (e) {
					console.log("error", e)
				}
				uni.request({
					url: `http://124.221.52.73:8080/system/getChatList?userId=${this.userInfo.userId}`,
					method: "GET",
					success: (res) => {
						console.log(res)
						this.chatList = res.data.data
						console.log(this.chatList)
					}
				})
				// uni.request({
				// 	url: `http://124.221.52.73:8080/system/getChatList?userId=13`,
				// 	method: "GET",
				// 	success: (res) => {
				// 		console.log(res)
				// 		this.chatList = res.data.data
				// 		console.log(this.chatList)
				// 	}
				// })
				uni.request({
					url: `http://124.221.52.73:8080/system/getPlantList`,
					method: "GET",
					success: (res) => {
						console.log(res)
						this.plantInfo = res.data.data
						console.log(this.plantInfo)
					}
				})
			},
			// goChat(e) {
			// 	console.log(e)
			// 	const plant = this.plantInfo.find(item => item.plantId == e.plantId);
			// 	console.log("植物名称", plant.plantName);
			// 	uni.navigateTo({
			// 		url: `/pages/chat/chat?plantName=${plant.plantName}&plantId=${plant.plantId}&userId=${this.userInfo.userId}`
			// 	})
			// }
			goChat(e) {
				console.log(e)
				const plant = this.plantInfo.find(item => item.plantId == e.plantId);
				console.log("植物名称", plant.plantName);
				uni.navigateTo({
					url: `/pages/chat/chat?plantName=${plant.plantName}&plantId=${plant.plantId}&userId=13`
				})
			}
		},
		computed: {
			handleName() {
				return (e) => {
					console.log(e)
					const plant = this.plantInfo.find(item => item.plantId == e);
					console.log("植物名称", plant.plantName);
					return plant ? plant.plantName : '';
				};
			},
			handleContent(e) {
				return (e) => {
					console.log(e)
					return e[e.length - 1].cmContent;
				};
			},
			handleTime(e) {
				return (e) => {
					console.log(e)
					return e[e.length - 1].cmTime.substring(11);
				};
			}
		}
	}
</script>

<style>
	.box {
		margin: 10rpx;
	}

	.chat {
		display: flex;
		height: 120rpx;
		width: 100%;
		padding-bottom: 18rpx;
		margin-top: 18rpx;
		border-bottom: 1px solid #e8e8e8;
		justify-content: space-between;
		flex-direction: row;
	}

	.chat-items:nth-child(2) {
		flex: 1;
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin-left: 20rpx;
	}

	.img {
		height: 100%;
		width: 120rpx;
	}

	.name {
		font-size: 20px;
		font-weight: 600;
	}

	.text {
		font-size: 15px;
		color: #B6B6B6;
		max-width: 300rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.time {
		font-size: 13px;
		margin-top: 10rpx;
		color: #807979;
		width: 120rpx;
	}
</style>
<!-- 			<view class="chat">
				<view class="chat-items">
					<image src="/static/韭菜.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的小韭菜</view>
					<view class="text">主人，我又长高了4厘米哦！</view>
				</view>
				<view class="chat-items">
					<view class="time">8月13日上午9:23</view>
				</view>
			</view>
			<view class="chat">
				<view class="chat-items">
					<image src="/static/西兰花.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的西兰花</view>
					<view class="text">主人，我发芽啦！</view>
				</view>
				<view class="chat-items">
					<view class="time">8月10日下午3:11</view>
				</view>
			</view>
			<view class="chat">
				<view class="chat-items">
					<image src="/static/西红柿.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的西红柿</view>
					<view class="text">主人，我已经开花啦！</view>
				</view>
				<view class="chat-items">
					<view class="time">8月9日中午12:58</view>
				</view>
			</view>
			<view class="chat">
				<view class="chat-items">
					<image src="/static/卷心菜.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的卷心菜</view>
					<view class="text">主人，我长高了2厘米呢</view>
				</view>
				<view class="chat-items">
					<view class="time">8月6日早晨6:44</view>
				</view>
			</view>

			<view class="chat">
				<view class="chat-items">
					<image src="/static/油菜.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的小油菜</view>
					<view class="text">主人，我开花啦！</view>
				</view>
				<view class="chat-items">
					<view class="time">8月3日下午5:18</view>
				</view>
			</view>
			<view class="chat">
				<view class="chat-items">
					<image src="/static/生菜.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的小生菜</view>
					<view class="text">主人，我发芽啦！</view>
				</view>
				<view class="chat-items">
					<view class="time">8月1日上午10:33</view>
				</view>
			</view>
			<view class="chat">
				<view class="chat-items">
					<image src="/static/黄瓜.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的小黄瓜</view>
					<view class="text">主人，我开花啦！</view>
				</view>
				<view class="chat-items">
					<view class="time">7月28日下午3:48</view>
				</view>
			</view>
			<view class="chat">
				<view class="chat-items">
					<image src="/static/菠菜.png" class="img" style="margin-left: 10rpx;" />
				</view>
				<view class="chat-items">
					<view class="name">您的小菠菜</view>
					<view class="text">主人，我又长高了4厘米</view>
				</view>
				<view class="chat-items">
					<view class="time">7月26日上午9:08</view>
				</view>
			</view> -->

<!-- 				chatList: [{
					plantId: "2",
					userId: "002",
					chatMessage: [{
						cmTime: "2024.9.17",
						cmContent: "NIvdffbfbfrbfbdfbfbdfbdfnngnvnngfngfnbrHAO",
						cmFlag: 1
					}]
				}],
				plantInfo: [{
					plantId: '1',
					plantName: "韭菜"
				}, {
					plantId: '2',
					plantName: "番茄"
				}], -->