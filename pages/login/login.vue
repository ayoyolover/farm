<template>
	<view>
		<view v-if="isLogin">
			<view class="header">
				<view class="info">账号:<input class="input" type="text" v-model="userAc" placeholder="请输入账号"></view>
				<view class="info">密码:<input class="input" type="password" v-model="userPw" placeholder="请输入密码">
				</view>
				<button type="primary" size="mini" @click="handleLogin">登陆</button>
			</view>
			<view style="text-align: center;font-size: 10px;margin-top: 5rpx;" @click="goRegister">暂未注册？</view>
		</view>
		<view v-else>
			<view class="header">
				<view class="info"><input class="input" type="text" v-model="userAc" placeholder="请输入账号"></view>
				<view class="info"><input class="input" type="text" v-model="userNick" placeholder="请输入昵称"></view>
				<view class="info"><input class="input" type="text" v-model="userEm" placeholder="请输入邮箱"></view>
				<view class="uni-form-item uni-column">
					<radio-group v-model="userSex" @change="radioChange">
						<label>性别：</label>
						<label>
							<radio value="MALE" /><text>男</text>
							<radio value="FEMALE" /><text>女</text>
						</label>
					</radio-group>
				</view>
				<view class="info"><input class="input" type="password" v-model="userPw" placeholder="请输入密码">
				</view>
				<view class="info"><input class="input" type="password" v-model="userPw_again" placeholder="请再次输入密码">
				</view>
				<button type="primary" size="mini" @click="handleRegister">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userAc: '',
				userPw: '',
				userNick: '',
				userPw_again: '',
				userEm: '',
				userSex: '',
				isLogin: 1
			}
		},
		methods: {
			reset() {
				this.userAc = ''
				this.userPw = ''
				this.userNick = ''
				this.userPw_again = ''
				this.userEm = ''
				this.userSex = ''
			},
			handleLogin() {
				if (!this.userAc) {
					uni.showToast({
						icon: 'error',
						title: "账号不得为空！",
						duration: 1000
					})
				} else if (!this.userPw) {
					uni.showToast({
						icon: 'error',
						title: "密码不得为空！",
						duration: 1000
					})
				} else {
					let loginInfo = {
						userAc: this.userAc,
						userPw: this.userPw
					}
					console.log("用户",loginInfo)
					uni.request({
						header: {
							'content-type': 'application/json;charset=UTF-8'
						},
						url: 'http://124.221.52.73:8080/system/login',
						method: "POST",
						data: loginInfo,
						success: (res) => {
							var obj = JSON.parse(JSON.stringify(res))
							console.log("success", obj)
							if (obj.data.code == 3) {
								uni.showToast({
									icon: 'error',
									title: "密码错误",
									duration: 2000
								})
							} else if (obj.data.code == 2 ) {
								uni.showToast({
									icon: 'error',
									title: "用户不存在",
									duration: 2000
								})
							} else {
								uni.showToast({
									icon: 'success',
									title: "登陆成功",
									duration: 2000
								})
								this.reset()
								try {
									console.log("success")
									uni.setStorageSync("userInfo", obj.data.data)
								} catch (e) {
									console.log("error", e)
								}
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1000);

							}
						},
						fail: (res) => {
							console.log("error", res)
						}
					})
				}

			},
			goRegister() {
				this.isLogin = 0;
				this.reset()
			},
			handleRegister() {
				if (!this.userAc) {
					uni.showToast({
						icon: 'error',
						title: "账号不得为空！",
						duration: 1000
					})
				} else if (!this.userNick) {
					uni.showToast({
						icon: 'error',
						title: "昵称不得为空！",
						duration: 1000
					})
				} else if (this.userPw != this.userPw_again) {
					uni.showToast({
						icon: 'error',
						title: "两次密码不一致",
						duration: 1000
					})
				} else if (!this.userPw || !this.userPw_again) {
					uni.showToast({
						icon: 'error',
						title: "密码不得为空",
						duration: 1000
					})
				} else if (!this.userSex) {
					uni.showToast({
						icon: 'error',
						title: "请选择性别",
						duration: 1000
					})
				} else {
					let registerInfo = {
						userAc: this.userAc,
						userPw: this.userPw,
						userEm: this.userEm,
						userNick: this.userNick,
						userSex: this.userSex
					}
					uni.request({
						header: {
							'content-type': 'application/json;charset=UTF-8'
						},
						url: 'http://124.221.52.73:8080/system/register',
						method: "POST",
						data: registerInfo,
						success: (_res) => {
							var res = JSON.parse(JSON.stringify(_res))
							console.log("success", res)
							if (res.data.code != 2) {
								uni.showToast({
									icon: 'success',
									title: "注册成功",
									duration: 1000
								})
								this.isLogin = 1;
								this.reset();
							} else {
								uni.showToast({
									icon: 'error',
									title: "用户名已存在",
									duration: 1500
								})
							}
						},
						fail: (res) => {
							console.log("error", res)
						}
					})
				}
			},
			radioChange(e) {
				console.log(e)
				this.userSex = e.detail.value
			}
		}
	}
</script>

<style>
	.header {
		display: flex;
		flex-direction: column;
		justify-content: end;
		align-items: center;
	}

	.input {
		border: 1px solid grey;
		border-radius: 10px;
		margin-left: 20rpx;
		padding-left: 20rpx;
	}

	.info {
		display: flex;
		margin: 16rpx;
	}
</style>