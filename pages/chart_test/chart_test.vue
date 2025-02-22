<template>
	<view class="container">
		<text class="counter">计数器：{{ counter }}</text>
		<view class="drag-area" :style="{ backgroundColor: isDropped ? 'lightgreen' : 'lightgray' }"
			@touchstart="onDragStart" @touchmove="onDragMove" @touchend="onDragEnd">
			<text>将图片拖拽到这里！</text>
			<image ref="image" v-if="!isDropped" src="/static/sow/back.png" class="drag-item" :style="imageStyle"
				@touchstart="onImageTouchStart" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				counter: 0,
				isDropped: false,
				dragging: false,
				startX: 0,
				startY: 0,
				currentX: 0,
				currentY: 0,
				baseX: 0,
				baseY: 0,
				end: false
			};
		},
		computed: {
			imageStyle() {
				return {
					position: 'absolute' ,
					left: `${this.currentX}px`,
					top: `${this.currentY}px`,
				};
			},
		},
		methods: {
			onReady(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.drag-item').boundingClientRect((rect) => {
					if (rect) {
						this.baseX = rect.left;
						this.baseY = rect.top;
						this.currentX = this.baseX;
						this.currentY = this.baseY;
						console.log(this.startX, this.startY)
					}
				}).exec();
			},
			onImageTouchStart(e) {
				// 记录拖拽起始位置
				const touch = e.touches[0];
				this.startX = touch.pageX;
				this.startY = touch.pageY;
				this.dragging = true;
			},
			onDragStart() {
				// 禁用默认事件，防止页面滚动
				return false;
			},
			onDragMove(e) {
				if (this.dragging && !this.end) {
					const touch = e.touches[0];
					// console.log(touch.pageX)
					// console.log(touch.pageY)
					// 计算当前触摸点位置
					this.currentX = this.baseX + touch.pageX - this.startX;
					this.currentY = this.baseY + touch.pageY - this.startY;
				}
			},
			onDragEnd(e) {
				this.end = true
				this.dragging = false;
				const touch = e.changedTouches[0];
				let targetRect = {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
				// 判断是否拖拽到目标区域
				const query = uni.createSelectorQuery().in(this);
				query.select('.drag-area').boundingClientRect((rect) => {
					if (rect) {
						targetRect.left = rect.left; // 图片的左边位置
						targetRect.top = rect.top; // 图片的顶部位置
						targetRect.right = rect.right; // 图片的左边位置
						targetRect.bottom = rect.bottom; // 图片的顶部位置
						
						this.currentX = touch.pageX;
						this.currentY = touch.pageY;
						
						// console.log(this.startX, this.startY)
						console.log(touch.pageX, touch.pageY)
						
						// console.log(this.baseX, this.baseY)
						// console.log(this.currentX, this.currentY)
						// 计算目标区域是否包含当前拖拽的图片
						if (
							this.currentX >= targetRect.left &&
							this.currentX <= targetRect.right &&
							this.currentY >= targetRect.top &&
							this.currentY <= targetRect.bottom
						) {
							
							this.counter++;
						}
					}
				}).exec();

			},
		},
	};
</script>

<style scoped>
	.container {
		text-align: center;
		margin-top: 50px;
	}

	.counter {
		font-size: 24px;
		margin-bottom: 20px;
	}

	.drag-area {
		width: 300px;
		height: 300px;
		margin: 0 auto;
		border: 2px dashed #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.drag-item {
		width: 100px;
		height: 100px;
		cursor: move;
	}
</style>