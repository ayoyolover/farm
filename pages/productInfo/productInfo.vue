<template>
	<view>
		<view class="example">
			<view class="width">
			</view>
			<view class="infoItem">
				<view class="uni-list-cell-left">
					植物选择
				</view>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange" :value="index" :range="plantList" range-key="plantName">
						<view class="uni-input">{{plantList[index].plantName}}</view>
					</picker>
				</view>
			</view>
		</view>
		<button type="primary" size="mini" @click="handleSubmit" style="position: absolute;right: 40%;">确定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productInfo: "",
				getproductInfo: 0,
				getseedInfo: 0,
				index: 0,
				plantList: [],
				plantChoose: {},
				userInfo: {}
			}
		},
		methods: {
			onLoad(e) {
				uni.request({
					url: `http://124.221.52.73:8080/system/getPlantList`,
					method: "GET",
					success: (res) => {
						console.log(res)
						this.plantList = res.data.data
						console.log(this.plantList)
					}
				})
				try {
					const userInfo = uni.getStorageSync("userInfo")
					if (userInfo) {
						console.log("success", userInfo)
						this.userInfo = userInfo
					}
				} catch (e) {
					console.log("error", e)
				}
			},
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},
			handleSubmit() {
				uni.showLoading({
					mask: true,
					title: '请稍后'
				})
				let obj = {
					plantId: this.plantList[this.index].plantId,
					userId: this.userInfo.userId,
					chatMessage: []
				}
				uni.request({
					url: `http://124.221.52.73:8080/system/seedPeek`,
					method: 'POST',
					data: obj,
					success: (res) => {
						console.log("success", res)
						if (res.data.code == 200) {
							uni.hideLoading();
							uni.showToast({
								icon: 'success',
								title: `成功选择${this.plantList[this.index].plantName}`
							})
							setTimeout(function() {
								uni.hideToast();
							}, 1000);
						}

					},
					fail: (res) => {
						console.log("error", res)
					}
				})
				//uni.setStorageSync("产品资料", obj)
			},
		}
	}
</script>

<style>
	.product {
		display: flex;
	}

	.example {
		display: flex;
		margin-bottom: 30rpx;
	}

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

	.down_arrow {
		border: solid #B3B3B3;
		border-width: 0 1.5px 1.5px 0;
		padding: 3px;
		position: absolute;
		right: 15px;
		/* margin-left: 66%; */
		transform: rotate(-45deg);
		-webkit-transform: rotate(45deg);
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

	.listItem {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		background-color: #EDF2FA;
		align-items: center;
		border-bottom: #E7E7E7 1px solid;
	}
</style>

<!-- <view v-if="(!getproductInfo)">
			<view style="margin-top: 20rpx;margin-left: 5rpx;">请输入产品编号:</view>
			<input type="text" style="border-bottom: 0.5px solid #9FB2BF;height: 50rpx;margin-bottom: 20rpx;"
				v-model="productId">
			<button type="primary" size="mini" style="position: absolute;right: 40%;" @click="handleActive">激活</button>
		</view>
		<view v-else>
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem">
					<text>产品型号</text>
					<view>{{productInfo.productId}}</view>
				</view>
			</view>
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem">
					<text>产品名称</text>
					<view>{{productInfo.productName}}</view>
				</view>
			</view>
		</view>
		<view v-if="(!getseedInfo)&&getproductInfo">
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem">
					<view class="uni-list-cell-left">
						种子选择
					</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index" :range="seedList">
							<view class="uni-input">{{seedList[index]}}</view>
						</picker>
					</view>
					<view class='right_arrow' />
				</view>
			</view>
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem" @click="handleSeedShow">
					<text>已选种子</text>
					<view class='down_arrow' />
				</view>
			</view>
			<view v-for="item in seedInfo.seedList" class="seedList">
				<view class="listItem">
					<view style="padding-left: 30rpx;">{{item.seedName}}</view>
					<view style="padding-right: 30rpx;">{{item.number}}</view>
				</view>
			</view>
			<button type="primary" size="mini" style="position: absolute;right: 40%; margin-top: 30rpx;"
				@click="handleSubmit">确定</button>
		</view>
		<view v-else-if="getseedInfo&&getproductInfo">
			<view class="example">
				<view class="width">
				</view>
				<view class="infoItem" @click="handleSeedShow">
					<text>已选种子</text>
					<view :class="[seedShow?'down_arrow':'right_arrow']" />
				</view>
			</view>
			<view v-if="seedShow" v-for="item in seedInfo.seedList" class="seedList">
				<view class="listItem">
					<view style="padding-left: 30rpx;">{{item.seedName}}</view>
					<view style="padding-right: 30rpx;">{{item.number}}</view>
				</view>
			</view>
		</view> -->

<!-- 
		onShow() {
			/*进入页面直接发请求，请求产品信息*/
			uni.request({
				url: 'http://124.221.52.73:8080/getProductInfo/',
				method: 'GET',
				data: {
					userAc: this.userAc
				},
				success: (res) => {
					console.log(res)
					this.seedInfo = res.seedInfo
					this.productInfo = res.productInfo
				}
			})
			/*读取缓存 若缓存没有则发请求获得产品信息*/
			try {
				const storage = uni.getStorageSync("产品资料")
				if (storage) {
					console.log("success", storage)
					this.seedInfo = storage.seedInfo
					this.productInfo = storage.productInfo
					if (this.productInfo)
						this.getproductInfo = 1;
					if (this.seedInfo)
						this.getseedInfo = 1;
				} else {
					uni.request({
						url: 'http://124.221.52.73:8080/getProductInfo/',
						method: 'GET',
						data: {
							userAc: this.userAc
						},
						success: (res) => {
							console.log(res)
							this.seedInfo = res.seedInfo
							this.productInfo = res.productInfo
							if (this.productInfo)
								this.getproductInfo = 1;
							if (this.seedInfo)
								this.getseedInfo = 1;
						}
					})
				}
			} catch (e) {
				console.log("error", e)
			}
		}, -->

<!-- 	
		// handleSeedShow() {
			// 	this.seedShow = !this.seedShow;
			// },
			// handleActive() {
			// 	console.log("success", this.productId)
			// 	uni.showLoading({
			// 		mask: true,
			// 		title: '激活中'
			// 	})
			// 	/*将用户输入的产品编号发送至后端 验证通过后继续完善信息*/
			// 	uni.request({
			// 		header: {
			// 			'content-type': 'application/x-www-form-urlencoded'
			// 		},
			// 		url: 'http://124.221.52.73:8080/activeProductId',
			// 		method: 'GET',
			// 		data: this.productId,
			// 		success: (res) => {
			// 			console.log("success", res)
			// 			uni.hideLoading();
			// 			try {
			// 				uni.showToast({
			// 					icon: 'success',
			// 					title: "激活成功"
			// 				})
			// 				this.productInfo = res.data
			// 				uni.setStorageSync("产品资料", this.productInfo)
			// 				setTimeout(function() {
			// 					uni.hideToast();
			// 				}, 1000);
			// 				this.getproductInfo = 1;
			// 			} catch (e) {
			// 				console.log("error", e)
			// 			}
			// 		},
			// 		fail: (res) => {
			// 			console.log("error", res)
			// 		}
			// 	})
			// },
			handleSubmit() {
				const obj = {
					productInfo: this.productInfo,
					seedInfo: this.seedInfo
				}
				console.log(obj)
				uni.showLoading({
					mask: true,
					title: '请稍后'
				})
				uni.request({
					url: `http://124.221.52.73:8080/system/seedPeek?plantId=${}&userId=${}`,
					method: 'GET',
					success: (res) => {
						console.log("success", res)
						uni.hideLoading();
						uni.showToast({
							icon: 'success',
							title: "选择成功"
						})
						//this.seedInfo = res.data
						setTimeout(function() {
							uni.hideToast();
						}, 1000);
						//this.getseedInfo = 1;
					},
					fail: (res) => {
						console.log("error", res)
					}
				})
				uni.setStorageSync("产品资料", obj)
			},
		} -->