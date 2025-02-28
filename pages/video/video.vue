<template>
	<view class="container">
		<!-- 图表区域 -->
		<view class="chart-container">
			<view class="charts-box">
				<qiun-data-charts type="line" :opts="ddlOPT" :chartData="ddlData" :ontouch="true" />
			</view>
			<view class="charts-box">
				<qiun-data-charts type="line" :opts="pHOPT" :chartData="pHData" :ontouch="true" />
			</view>
			<view class="charts-box">
				<qiun-data-charts type="line" :opts="midOPT" :chartData="midData" :ontouch="true" />
			</view>
			<view class="charts-box">
				<qiun-data-charts type="line" :opts="tempOPT" :chartData="tempData" :ontouch="true" />
			</view>
			<view class="charts-box">
				<qiun-data-charts type="bar" :opts="elementOPT" :chartData="elementData" :ontouch="true" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPAC,
		getNPK
	} from '@/request/enData.js';

	export default {
		data() {
			return {
				isLed: false,
				isOx: false,
				ddlOPT: {
					color: ['#32CD32'], // 深浅绿色
					padding: [15, 15, 15, 15], // 调整内边距使图表更美观
					enableScroll: true, // 启用滚动
					legend: {
						position: 'top', // 图例放在顶部
						fontSize: 11, // 设置字体大小
						color: '#333' // 设置图例字体颜色
					},
					xAxis: {
						type: 'category', // 横坐标类型为分类
						data: [], // 横坐标数据，后续通过动态更新填充
						disableGrid: false, // 启用网格
						scrollShow: true, // 启用x轴滚动
						itemCount: 5, // x轴最多显示5个数据点
						fontSize: 12, // 设置x轴标签字体大小
						lineColor: '#ccc', // x轴线条颜色
						gridColor: '#f0f0f0', // 网格颜色
					},
					yAxis: { // 第一个 y 轴
						gridType: 'solid', // 使用实线网格
						dashLength: 4, // 调整虚线长度
						fontSize: 12, // 设置y轴字体大小
						lineColor: '#ccc', // y轴线条颜色
						axisLabel: { // 设置y轴标签
							color: '#32CD32', // 第一条折线的 y 轴标签颜色
						},
						name: '电导率 (μs/cm)', // 第一条折线对应的 y 轴名称
					},
					extra: {
						line: {
							type: 'curve', // 设置折线为曲线
							width: 2, // 增加线宽
							activeType: 'hollow', // 设置激活点为空心
							smooth: true // 启用平滑曲线
						}
					}
				},
				ddlData: {
					categories: [], // 横坐标数据
					series: [] // 数据系列
				},
				pHOPT: {
					color: ['#32CDE2'], // 深浅绿色
					padding: [15, 15, 15, 15], // 调整内边距使图表更美观
					enableScroll: true, // 启用滚动
					legend: {
						position: 'top', // 图例放在顶部
						fontSize: 11, // 设置字体大小
						color: '#333' // 设置图例字体颜色
					},
					xAxis: {
						type: 'category', // 横坐标类型为分类
						data: [], // 横坐标数据，后续通过动态更新填充
						disableGrid: false, // 启用网格
						scrollShow: true, // 启用x轴滚动
						itemCount: 5, // x轴最多显示5个数据点
						fontSize: 12, // 设置x轴标签字体大小
						lineColor: '#ccc', // x轴线条颜色
						gridColor: '#f0f0f0', // 网格颜色
					},
					yAxis: { // 第一个 y 轴
						gridType: 'solid', // 使用实线网格
						dashLength: 4, // 调整虚线长度
						fontSize: 12, // 设置y轴字体大小
						lineColor: '#ccc', // y轴线条颜色
						axisLabel: { // 设置y轴标签
							color: '#32CDE2', // 第一条折线的 y 轴标签颜色
						},
						name: 'pH', // 第一条折线对应的 y 轴名称
						min: 6,
						max: 8,
						tofix: 2
					},
					extra: {
						line: {
							type: 'curve', // 设置折线为曲线
							width: 2, // 增加线宽
							activeType: 'hollow', // 设置激活点为空心
							smooth: true // 启用平滑曲线
						}
					}
				},
				pHData: {
					categories: [],
					series: []
				},
				midOPT: {
					color: ['#329DE2'], // 深浅绿色
					padding: [15, 15, 15, 15], // 调整内边距使图表更美观
					enableScroll: true, // 启用滚动
					legend: {
						position: 'top', // 图例放在顶部
						fontSize: 11, // 设置字体大小
						color: '#333' // 设置图例字体颜色
					},
					xAxis: {
						type: 'category', // 横坐标类型为分类
						data: [], // 横坐标数据，后续通过动态更新填充
						disableGrid: false, // 启用网格
						scrollShow: true, // 启用x轴滚动
						itemCount: 5, // x轴最多显示5个数据点
						fontSize: 12, // 设置x轴标签字体大小
						lineColor: '#ccc', // x轴线条颜色
						gridColor: '#f0f0f0', // 网格颜色
					},
					yAxis: { // 第一个 y 轴
						gridType: 'solid', // 使用实线网格
						dashLength: 4, // 调整虚线长度
						fontSize: 12, // 设置y轴字体大小
						lineColor: '#ccc', // y轴线条颜色
						axisLabel: { // 设置y轴标签
							color: '#32CDE2', // 第一条折线的 y 轴标签颜色
						},
						name: 'mid', // 第一条折线对应的 y 轴名称
						min: 30,
						max: 35,
						tofix: 2
					},
					extra: {
						line: {
							type: 'curve', // 设置折线为曲线
							width: 2, // 增加线宽
							activeType: 'hollow', // 设置激活点为空心
							smooth: true // 启用平滑曲线
						}
					}
				},
				midData: {
					categories: [],
					series: []
				},
				tempOPT: {
					color: ['#32CD82'], // 深浅绿色
					padding: [15, 15, 15, 15], // 调整内边距使图表更美观
					enableScroll: true, // 启用滚动
					legend: {
						position: 'top', // 图例放在顶部
						fontSize: 11, // 设置字体大小
						color: '#333' // 设置图例字体颜色
					},
					xAxis: {
						type: 'category', // 横坐标类型为分类
						data: [], // 横坐标数据，后续通过动态更新填充
						disableGrid: false, // 启用网格
						scrollShow: true, // 启用x轴滚动
						itemCount: 5, // x轴最多显示5个数据点
						fontSize: 12, // 设置x轴标签字体大小
						lineColor: '#ccc', // x轴线条颜色
						gridColor: '#f0f0f0', // 网格颜色
					},
					yAxis: { // 第一个 y 轴
						gridType: 'solid', // 使用实线网格
						dashLength: 4, // 调整虚线长度
						fontSize: 12, // 设置y轴字体大小
						lineColor: '#ccc', // y轴线条颜色
						axisLabel: { // 设置y轴标签
							color: '#32CDE2', // 第一条折线的 y 轴标签颜色
						},
						name: 'temp', // 第一条折线对应的 y 轴名称
						min: 15,
						max: 22,
						tofix: 2
					},
					extra: {
						line: {
							type: 'curve', // 设置折线为曲线
							width: 2, // 增加线宽
							activeType: 'hollow', // 设置激活点为空心
							smooth: true // 启用平滑曲线
						}
					}
				},
				tempData: {
					categories: [],
					series: []
				},
				elementOPT: {
					color: ['#FFE967', '#32CD32', '#1E90FF'], // 设置柱子的颜色（氮、磷、钾）
					legend: {
						position: 'top', // 图例位置
						fontSize: 14, // 图例字体大小
						color: '#333' // 图例字体颜色
					},
					xAxis: {
						type: 'category', // x轴为类目轴
						data: [], // 显示的日期会在x轴上显示
						fontSize: 12,
						lineColor: '#ccc',
						gridColor: '#f0f0f0',
					},
					yAxis: {
						// 这里是数值轴，显示含量数值
						type: 'value', // y轴显示数值
						fontSize: 12,
						lineColor: '#ccc',
						gridColor: '#f0f0f0',
					},
					extra: {
						bar: {
							width: 8, // 设置柱子的宽度
							borderRadius: 50 // 设置柱子的圆角
						}
					}
				},
				elementData: {
					categories: [],
					series: []
				},
			};
		},
		onReady() {
			this.fetchData();
		},
		methods: {
			fetchData() {
				const now = new Date();
				const year = now.getFullYear();
				const month = ('0' + (now.getMonth() + 1)).slice(-2);
				const day = ('0' + now.getDate()).slice(-2);
				const hours = ('0' + now.getHours()).slice(-2);
				this.time = year + ':' + month + ':' + day + ':' + hours;
				let date = [];
				const today = new Date();

				// 获取过去7天的日期
				for (let i = 6; i >= 0; i--) {
					let tempDate = new Date(today);
					tempDate.setDate(today.getDate() - i); // 获取当前日期的前 i 天
					let month = tempDate.getMonth() + 1; // 获取月份，注意月份是从0开始的
					let day = tempDate.getDate(); // 获取日期

					// 格式化日期为 "月-日" 格式
					date.push(`${month}-${day}`);
				}

				console.log(date); // 输出日期数组
				getPAC(this.time)
					.then((res) => {
						const pH = [];
						const ddl = [];
						res.data.reverse().forEach(item => {
							if (item.staValue && item.staTime) {
								pH.push(item.staValue['酸碱度']);
								ddl.push(item.staValue['电导率']);
								// date.push(Number(item.staTime.slice(5, 7)) + '.' + Number(item.staTime
								// 	.slice(8,
								// 		10)));
							}
						});
						// 更新lineData
						this.ddlData.categories = date; // 将日期作为横坐标
						this.ddlData.series = [{
							name: '电导率 (μs/cm)',
							data: ddl,
						}];
						this.pHOPT.yAxis.max = Math.max(...pH) + 0.05
						this.pHOPT.yAxis.min = Math.min(...pH) - 0.05
						this.pHData.categories = date; // 将日期作为横坐标
						this.pHData.series = [{
							name: 'pH',
							data: pH,
						}];
					});

				getNPK(this.time)
					.then((res) => {
						console.log(res)
						// const date = [];
						const temp = [];
						const mid = [];
						const N = [];
						const P = [];
						const K = [];
						res.data.reverse().forEach(item => {
							if (item.staValue && item.staTime) {
								N.push(item.staValue['土壤氮']);
								P.push(item.staValue['土壤磷']);
								K.push(item.staValue['土壤钾']);
								temp.push(item.staValue['温度']);
								mid.push(item.staValue['湿度']);
								// date.push(Number(item.staTime.slice(5, 7)) + '.' + Number(item.staTime
								// 	.slice(8,
								// 		10)));
							}
						});

						//温度数据处理
						this.tempData.categories = date;
						this.tempData.series = [{
							name: '环境温度(℃)',
							data: temp
						}]
						this.tempOPT.yAxis.max = Math.max(...temp) + 1
						this.tempOPT.yAxis.min = Math.min(...temp) - 1

						//湿度数据处理
						this.midData.categories = date;
						this.midData.series = [{
							name: '环境湿度',
							data: mid
						}]
						this.midOPT.yAxis.max = Math.max(...mid) + 1
						this.midOPT.yAxis.min = Math.min(...mid) - 1

						//氮磷钾元素处理
						this.elementData.categories = date
						this.elementData.series = [{
							name: '氮元素',
							data: N
						}, {
							name: '磷元素',
							data: P,

						}, {
							name: '钾元素',
							data: K
						}]
					})
			},

			handleLED() {
				let action = !this.isLed ? 'start' : 'end';
				this.isLed = !this.isLed;
				uni.request({
					url: `http://192.168.1.109:5000/handleLED?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({
							title: '请求失败，请检查网络或链接',
							icon: 'none'
						});
					}
				});
			},
			handleOx() {
				let action = !this.isOx ? 'start' : 'end';
				this.isOx = !this.isOx;
				uni.request({
					url: `http://192.168.1.109:5000/handleOX?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({
							title: '请求失败，请检查网络或链接',
							icon: 'none'
						});
					}
				});
			}
		}
	};
</script>

<style>
	/* 页面背景渐变动画 */
	@keyframes gradientBackground {
		0% {
			background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
		}

		50% {
			background: linear-gradient(135deg, #b2ebf2, #80deea);
		}

		100% {
			background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
		}
	}

	.container {
		animation: gradientBackground 20s ease infinite;
		/* 背景色动态变化，速度变慢 */
		min-height: 100vh;
		padding: 20rpx;
	}

	.change {
		display: flex;
		justify-content: space-around;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}

	.changeItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 40rpx;
		background-color: rgba(255, 255, 255, 0.8);
		/* 半透明背景 */
		border-radius: 20rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.changeItem:hover {
		transform: translateY(-10rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 20rpx;
	}

	.text {
		font-size: 28rpx;
		font-weight: bold;
		color: #10B078;
		text-align: center;
	}

	.chart-container {
		margin-top: 40rpx;
	}

	.charts-box {
		margin-bottom: 20rpx;
		width: 100%;
		height: 300px;
		/* 适当调整高度 */
		background-color: #f9f9f9;
		/* 背景颜色使图表更清晰 */
		border-radius: 10px;
		/* 圆角 */
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
		/* 添加阴影，使图表更立体 */
	}
</style>