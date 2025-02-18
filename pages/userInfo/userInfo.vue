<template>
	<view style="height: 1524rpx;background-color: #EDEDED;">
		<view class="userInfo">
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem" @click="handleUpdate('昵称')">
					<text>昵称</text>
					<view>{{userInfo.userNick}}</view>
					<view class='right_arrow' />
				</view>
			</view>
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem" @click="handleUpdate('账号')">
					<text>账号</text>
					<view>{{userInfo.userAc}}</view>
					<view class='right_arrow' />
				</view>
			</view>
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem" @click="handleUpdate('性别')">
					<text>性别</text>
					<view>{{userInfo.userSex}}</view>
					<view class='right_arrow' />
				</view>
			</view>
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem" @click="handleUpdate('邮箱')">
					<text>邮箱</text>
					<view>{{userInfo.userEm}}</view>
					<view class='right_arrow' />
				</view>
			</view>
		</view>
		<view class="userPw">
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem" @click="handleUpdate('密码')">
					<text>修改密码</text>
					<view class='right_arrow' />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: [],
				isRefresh:false
			}
		},
		methods: {
			onLoad(e) {
				this.userInfo = JSON.parse(e.userInfo)[0]
				console.log("userInfo", this.userInfo)
			},
			onShow() {
				this.userInfo = uni.getStorageSync("userInfo")
				console.log(this.userInfo)
				uni.hideLoading()
			},
			setData(){
				
			},
			handleUpdate(e) {
				console.log(e)
				let name = ""
				if (e == '密码')
					name = "userPw"
				else if (e == '账号')
					name = "userAc"
				else if (e == '邮箱')
					name = "userEm"
				else if (e == '性别')
					name = "userSex"
				else if (e == '昵称')
					name = "userNick"
				console.log(this.userInfo[name])
				uni.navigateTo({
					url: `/pages/updateUserInfo/updateUserInfo?title=${e}&content=${this.userInfo[name]}`
				})
			}
		}
	}
</script>

<style>
	.right_arrow {
		border: solid #B3B3B3;
		border-width: 0 1.5px 1.5px 0;
		padding: 3px;
		position: absolute;
		right: 15px;
		/* margin-left: 66%; */
		transform: rotate(-45deg);
		-webkit-transform: rotate(-45deg);
	}

	.infoItem {
		background-color: #FFFFFF;
		padding-right: 50rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 110rpx;
		border-bottom: 0.5px solid #E7E7E7;
		width: 91%;
	}

	.width {
		width: 30rpx;
		background-color: white;
	}

	.example {
		display: flex;
	}

	.userInfo {
		margin-bottom: 20rpx;
	}

	.userPw {
		background-color: #FFFFFF;
	}

	text {
		font-weight: 500;
	}
</style>