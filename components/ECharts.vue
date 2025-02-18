<template>
	<view class="chart-container">
		<canvas ref="chartCanvas" class="chart-canvas"></canvas>
	</view>
</template>

<script>
	import * as echarts from 'echarts';

	export default {
		props: {
			options: Object // 接收图表配置
		},
		data() {
			return {
				chart: null
			};
		},
		mounted() {
			this.initChart();
		},
		methods: {
			initChart() {
				this.$nextTick(() => {
					if (!this.chart) {
						const canvas = this.$refs.chartCanvas;
						this.chart = echarts.init(canvas, null, {
							width: canvas.clientWidth,
							height: canvas.clientHeight
						});
					}
					if (this.options) {
						this.chart.setOption(this.options);
					}
				});
			},
			updateChart(newOptions) {
				if (this.chart) {
					this.chart.setOption(newOptions);
				}
			}
		},
		watch: {
			options: {
				deep: true,
				handler(newVal) {
					this.updateChart(newVal);
				}
			}
		}
	};
</script>

<style>
	.chart-container {
		width: 100%;
		height: 300px;
	}

	.chart-canvas {
		width: 100%;
		height: 100%;
	}
</style>