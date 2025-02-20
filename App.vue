<script>
	import {
		autoGreet
	} from '@/request/auto.js'
	export default {
		globalData: {
			userId: 666666, // 用户ID
			plantId: 666666 // 植物ID
		},
		onLaunch() {
			console.log('🚀 App 启动');
			// 进行应用初始化
			
			console.log("🛠️ 正在初始化应用...");
			let obj = {
				userId: this.globalData.userId
			}
			autoGreet(obj)
				.then(res => {
					console.log("自动问候成功", res)
				})
			// uni.navigateTo({
			// 	url:'/pages/chart_test/chart_test'
			// })
		},

		onShow() {
			console.log('📱 App 显示');
		},

		onHide() {
			console.log('🔕 App 进入后台');
		},
	};
</script>

<style>
	/* 全局样式 */
	page {
		background-color: #f4f4f4;
		font-family: Arial, sans-serif;
	}
</style>