<template>
	<view>
		<view>
			<view style="margin-top: 20rpx;margin-left: 5rpx;">请输入新的{{title}}:</view>
			<input :type="[content!=''?'text':'userPw']"
				style="height: 50rpx;margin-bottom: 20rpx;margin-top: 20rpx;width: 100%" v-model="newContent"
				:placeholder="content">
			<view style="margin-top: 20rpx;margin-left: 5rpx;" v-if="!content">请再次输入{{title}}:</view>
			<input :type="[content?'text':'userPw'] " v-if="!content"
				style="height: 50rpx;margin-bottom: 20rpx;margin-top: 20rpx;width: 100%" v-model="newContent_again"><br>
			<button type="primary" size="mini" style="position: absolute;right: 40%;" @click="handleActive">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				content: '',
				newContent: "",
				newContent_again: "",
				userInfo: ''
			}
		},
		methods: {
			onLoad(e) {
				console.log(e)
				this.title = e.title;
				this.content = e.content
				if (this.title == "密码")
					this.content = ''
				console.log(this.content)
			},
			onShow() {
				this.userInfo = uni.getStorageSync("userInfo")
			},
			handleActive() {
				if (this.title == "密码")
					if (this.newContent != this.newContent_again) {
						uni.showToast({
							icon: 'error',
							title: "两次密码不一致"
						})
					}
				let name = ""
				if (this.title == '密码')
					name = "userPw"
				else if (this.title == '账号')
					name = "userAc"
				else if (this.title == '邮箱')
					name = "userEm"
				else if (this.title == '性别')
					name = "userSex"
				else if (this.title == '昵称')
					name = "userNick"
				// uni.setStorageSync("userInfo", this.userInfo)
				// let pages = getCurrentPages();
				// let prevPage = pages[pages.length - 2]; //上一个页面
				// //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
				// prevPage.setData({
				// 	isRefresh: 1
				// })
				// 再根据需求，确定返回上一页面
				uni.showLoading({
					title: "更改中",
				})
				const updateUserInfo = {
					userId: this.userInfo.userId
				}
				updateUserInfo[name] = this.newContent
				console.log(updateUserInfo)
				uni.request({
					url: "http://124.221.52.73:8080/system/updateUserInfo",
					header: {
						'content-type': 'application/json;charset=UTF-8'
					},
					data: updateUserInfo,
					method: "POST",
					success: (res) => {
						console.log("success", res)
						//uni.setStorageSync("userInfo", this.userInfo)
						uni.hideLoading()
						if (res.data.data == 0&&name=="userAc") {
							uni.showToast({
								icon: 'error',
								title: "用户名已被占用",
								duration:2000
							})
						} else {
							uni.showToast({
								icon: 'success',
								title: "已更改"
							})
							uni.setStorageSync("userInfo", res.data.data)
							setTimeout(() => {
								uni.hideToast()
								uni.navigateBack({
									delta: 1
								})
							}, 1000)
						}


					},
					fail: (res) => {
						console.log("err", res)
					}
				})
			}
		}
	}
</script>

<style>

</style>