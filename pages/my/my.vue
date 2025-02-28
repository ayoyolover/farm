<template>
	<view class="login-container">
		<view class="form-card">
			<!-- 标题 -->
			<view class="form-header">
				<text class="form-title">欢迎来到个人主页</text>
			</view>

			<!-- 表单 -->
			<form @submit.prevent="handleSubmit">
				<view class="form-group">
					<input type="text" v-model="username" placeholder="请输入用户名" class="form-input" />
				</view>
				<view class="form-group">
					<input type="password" v-model="password" placeholder="请输入密码" class="form-input" />
				</view>

				<!-- 如果是注册页面，添加确认密码输入框 -->
				<view v-if="!isLogin" class="form-group">
					<input type="password" v-model="confirmPassword" placeholder="确认密码" class="form-input" />
				</view>

				<!-- 按钮 -->
				<view class="form-buttons">
					<button class="form-button submit-btn"
						:style="{ backgroundColor: isLogin ? '#4CAF50' : '#2196F3' }">
						{{ isLogin ? '登录' : '注册' }}
					</button>
				</view>
			</form>

			<!-- 切换登录注册状态 -->
			<view class="toggle-auth">
				<text @click="toggleAuth" class="toggle-text">
					{{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: true, // 登录模式，默认为登录
				username: '',
				password: '',
				confirmPassword: '', // 仅用于注册时
			};
		},
		methods: {
			// 提交表单
			handleSubmit() {
				if (this.isLogin) {
					// 登录逻辑
					console.log('登录:', this.username, this.password);
				} else {
					// 注册逻辑
					if (this.password !== this.confirmPassword) {
						console.log('密码不一致');
					} else {
						console.log('注册:', this.username, this.password);
					}
				}
			},
			// 切换登录和注册状态
			toggleAuth() {
				this.isLogin = !this.isLogin;
				this.username = '';
				this.password = '';
				this.confirmPassword = '';
			}
		}
	};
</script>

<style scoped>
	/* 页面背景 */
	.login-container {
		width: 100%;
		height: 100vh;
		background: linear-gradient(135deg, #6a11cb, #2575fc);
		/* 渐变背景 */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 表单卡片 */
	.form-card {
		background: white;
		padding: 40px;
		border-radius: 15px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		width: 90%;
		max-width: 400px;
		text-align: center;
		margin-left: 50rpx;
		margin-right: 50rpx;
	}

	/* 表单头部 */
	.form-header {
		margin-bottom: 20px;
	}

	.form-title {
		font-size: 20px;
		font-weight: bold;
		color: #333;
	}

	.form-subtitle {
		font-size: 16px;
		color: #777;
	}

	/* 输入框 */
	.form-group {
		margin-bottom: 20px;
	}

	.form-input {
		width: 100%;
		padding: 10px;
		font-size: 16px;
		border: 1px solid #ddd;
		border-radius: 10px;
		outline: none;
		transition: all 0.3s ease;
	}

	.form-input:focus {
		border-color: #2575fc;
		box-shadow: 0 0 5px rgba(37, 117, 252, 0.6);
	}

	/* 按钮 */
	.form-buttons {
		margin-top: 20px;
	}

	.form-button {
		width: 100%;
		padding: 12px;
		font-size: 16px;
		color: white;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.form-button:hover {
		opacity: 0.8;
	}

	/* 切换文本 */
	.toggle-auth {
		margin-top: 15px;
	}

	.toggle-text {
		font-size: 14px;
		color: #2196F3;
		cursor: pointer;
	}

	.toggle-text:hover {
		text-decoration: underline;
	}
</style>