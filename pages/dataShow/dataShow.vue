<template>
	<view>
		<view class="dataShow" >
			<view class="dataItem" v-for="item in data">
				<img :src="item.src" class="dataImg">
				<view>{{item.str}}</view>
				<view>{{item.data}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: [{
						src: "static/temp.png",
						str: "环境温度",
						data: "24.5摄氏度"
					},
					{
						src: "static/mid.png",
						str: "环境湿度",
						data: "56.2%"
					},
					{
						src: "static/water.png",
						str: "水体温度",
						data: "17.3摄氏度"
					},
					{
						src: "static/health.png",
						str: "水体营养状态",
						data: "元素含量正常"
					},
					{
						src: "static/gas.png",
						str: "CO2浓度",
						data: "965.3ppm"
					},
					{
						src: "static/shine.png",
						str: "光照强度",
						data: "47.1"
					}
				]
			}
		},
		methods: {

		}
	}
</script>

<style>
	.dataShow {
		margin-top: 50rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: wrap;
	}
	.dataItem{
		color: #10B078;
		width: 350rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.dataImg{
		width: 100rpx;
		height: 100rpx;
	}
	.changeImg1 {
		height: 100rpx;
		width: 100rpx;
		margin: 10rpx;
	}
	
	.changeImg2 {
		height: 110rpx;
		width: 110rpx;
	}
	
	.changeItem {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.change {
		display: flex;
		color: #10B078;
		height: 200rpx;
		justify-content: space-around;
	}
</style>