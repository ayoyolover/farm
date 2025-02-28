<template>
	<view class="content">
		<!-- 实验简介 -->
		<view class="section head">
			<view class="title-box">
				<text class="title">🌱 实验简介</text>
			</view>
			<text class="content">
				实验旨在探究植物生长过程中，土壤中三种主要营养元素——氮（N）、磷（P）、钾（K）——含量的变化。氮、磷、钾是植物生长必需的大量元素，虽然它们在土壤中的含量相对较少（与碳、氢、氧相比），但它们对植物的生长发育至关重要。缺少其中任何一种，都会导致植物生长不良，甚至死亡。土壤中的氮、磷、钾等微量元素对植物生长至关重要。氮元素促进叶片生长，磷元素有助于根系发育和开花结果，钾元素则增强植物的抗病能力。通过监测土壤中这些元素的含量变化，可以更好地了解植物生长的营养需求，并优化施肥策略。
			</text>
		</view>

		<!-- 查询结果 -->
		<view>
			<view v-if="soilData" class="feedback">
				<view class="title-box">
					<text class="title">📊 土壤微量元素含量</text>
				</view>
				<!-- 氮磷钾元素三色折线图 -->
				<view class="chart-container">
					<view class="charts-box">
						<qiun-data-charts type="line" :opts="elementOPT" :chartData="elementData" :ontouch="true" />
					</view>
				</view>
			</view>
		</view>
		<!--从后端获取视频-->
		<view class="section">
			<view class="title-box">
				<text class="title">📺 教学视频</text>
			</view>
			<view class="container">
				<!-- 视频组件 -->
				<video :src="videoUrl" controls class="video-player" v-if="videoUrl"></video>
				<text v-else class="loading-text">加载视频中...</text>
			</view>
		</view>


		<!-- 拍照功能 缝合缺素分析 -->
		<view class="section">
			<button @click="takePhoto" class="photo-button item">📸 慧眼识植</button>

			<!-- 用于显示识别出的缺素照片 -->
			<view class="photo-gallery">
				<view v-for="(image, index) in imageUrls" :key="index" class="photo-container">
					<image :src="image.url" class="photo" mode="aspectFit" />
					<text class="photo-description">{{ image.description }}</text>
				</view>
			</view>
		</view>

		<div class="question-container">
			<h3>🌱 题苑————学海无涯苦作舟</h3>
			<div v-if="randomQuestion" class="question-content">
				<p class="question-text">{{ randomQuestion.question_text }}</p>
				<div class="options">
					<button v-for="(option, index) in randomQuestion.options" :key="index"
						@click="checkAnswer(option.key)" class="option-button">
						{{ option.value }}
					</button>
				</div>
				<p v-if="answerResult" class="answer-result">{{ answerResult }}</p>
			</div>
			<p v-else class="loading-message">加载问题中...</p>
		</div>

		<!-- 加载指示器 -->
		<div v-if="loading" class="loading-overlay">
			<div class="loading-spinner">绿宝老师思考中...</div>
		</div>

		<!-- AI 响应模态框 -->
		<div v-if="showAIResponse" class="ai-response-modal">
			<div class="modal-content">
				<span class="close" @click="closeAIResponse">&times;</span>
				<h2>绿宝老师小课堂</h2>
				<p>{{ airesponse }}</p>
				<button @click="closeAIResponse">获取下一个问题</button>
			</div>
		</div>
		<!-- 勋章展示区域 -->
		<view class="section medal-display">
			<view class="title-box">
				<text class="title">🏅 勋章展示</text>
			</view>
			<view>
				<p v-if="medal">你的勋章: <span class="medal">{{ medal }}</span></p>
				<p v-else>你还没有获得勋章。</p>
				<img v-if="medalImage" :src="medalImage" class="medal-image" />
			</view>
		</view>

		<!-- 跳转到视频直播板块 -->
		<view class="section">
			<button @click="navigateToVideo" class="video-button item">📺 进入视频直播</button>
		</view>

		<!-- 主题讨论区域 -->
		<view class="discussion-box">
			<view class="title-box">
				<text class="title">📝 发表主题</text>
			</view>
			<view class="topic-input">
				<input v-model="newTopic.title" placeholder="输入主题标题..." class="topic-input-field" />
				<textarea v-model="newTopic.content" placeholder="输入主题内容..." class="topic-input-field"></textarea>

				<button @click="submitTopic" class="submit-topic-button">提交主题</button>
			</view>
		</view>


		<!-- 主题展示区域 -->
		<view class="display-box">
			<view class="title-box">
				<text class="title">📋 主题展示</text>
			</view>
			<view class="topic-list">
				<view v-for="(topic, index) in topics" :key="index" class="topic-item">
					<view class="topic-header">
						<text class="topic-title">{{ topic.title }}</text>
					</view>
					<view class="topic-meta">
						<text class="topic-user">用户ID: {{ topic.userId }}</text>
						<text class="topic-date">创建时间: {{ formatDate(topic.createdAt) }}</text>
					</view>
					<text class="topic-content">{{ topic.content }}</text>

					<!-- 条件展示照片 -->
					<view class="photo-display" v-if="topic.photoUrl">
						<img :src="topic.photoUrl" alt="主题图片" class="photo" mode="aspectFit" />
					</view>

					<view class="reply-list">
						<view v-for="(reply, rIndex) in topic.replies" :key="rIndex" class="reply-item">
							<text class="reply-user">用户ID: {{ reply.userId }}:</text>
							<text class="reply-content">{{ reply.content }}</text>
						</view>
					</view>
					<view class="reply-input">
						<input v-model="topic.newReply" placeholder="输入回复..." class="reply-input-field" />
						<button @click="submitReply(topic)" class="submit-reply-button">提交回复</button>
					</view>
				</view>
			</view>
		</view>


	</view>

</template>

<script>
	import flask from '@/request/124flask.js';
	import request from '@/request/respberry.js';
	import base_url from '@/request/index.js';
	export default {
		data() {
			return {
				queryDate: this.getCurrentDate(), // 默认查询时间为当前日期
				startDate: "2023-01-01", // 查询时间范围起始日期
				endDate: this.getCurrentDate(), // 查询时间范围结束日期
				soilData: null, // 土壤微量元素数据
				comments: [], // 评论列表
				newCommentContent: "", // 新评论内容
				medalImage: null, // 用于存储勋章图片路径
				imageUrls: [],
				videoUrl: "",
				newComment: '', // 确保此属性已定义
				//题库
				randomQuestion: null,
				answerResult: "",
				airesponse: "",
				loading: false, // 控制加载状态的变量
				medal:null,
				showAIResponse: false, // 控制 AI 响应模态框的显示
				// 新主题的内容
				newTopic: {
					title: '',
					content: '',
					photo: null
				},
				topics: [], // 存储主题列表



				elementOPT: {
					color: ['#FFE967', '#32CD32', '#1E90FF'], // 设置折线的颜色（氮、磷、钾）
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
						gridColor: '#f0f0f0' // 网格颜色
					},
					yAxis: { // 第一个 y 轴
						gridType: 'solid', // 使用实线网格
						dashLength: 4, // 调整虚线长度
						fontSize: 12, // 设置y轴字体大小
						lineColor: '#ccc', // y轴线条颜色
						axisLabel: { // 设置y轴标签
							color: '#333' // y 轴标签颜色
						},
						name: '含量 (mg/kg)', // y 轴名称
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
				elementData: {
					categories: [], // 横坐标数据
					series: [] // 数据系列
				}
			};
		},
		created() {
			this.fetchComments(); // 页面加载时获取评论列表
		},
		mounted() {
			this.fetchSoilData(); // 自动调用获取土壤数据
			this.fetchComments(); // 页面加载时获取评论列表
			this.getvideo(); // Call the function to get the video URL on component creation
			this.fetchRandomQuestion();
			this.fetchUserMedal();
			this.fetchTopicsByCategory(3);
		},
		methods: {
			//嵌入讨论区照片内容
			onFileChange(event) {
				const file = event.target.files[0];
				if (file) {
					this.newTopic.photo = file; // 记录文件以便上传
				}
			},
			// 获取当前日期
			getCurrentDate() {
				const date = new Date();
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			},

			// 日期选择器变化事件
			onDateChange(e) {
				this.queryDate = e.detail.value;
			},

			closeModal() {
				this.showImageModal = false; // 关闭模态框
			},
			// 关闭 AI 响应模态框
			closeAIResponse() {
				this.showAIResponse = false; // 隐藏模态框
				this.fetchRandomQuestion(); // 获取下一个问题
			},
			// 评论区上传照片
			// 确认对话框
			confirm(message) {
				return new Promise((resolve) => {
					uni.showModal({
						title: '提示',
						content: message,
						success: function(res) {
							resolve(res.confirm); // 如果用户点击确认，则返回 true
						}
					});
				});
			},
			getBase64FromFile(file) {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => {
						resolve(reader.result.split(',')[1]); // 返回 Base64 字符串部分
					};
					reader.onerror = error => reject(error);
					reader.readAsDataURL(file); // 读取文件为 Data URL
				});
			},

			async takePhoto1() {
				try {
					const res = await uni.chooseImage({
						count: 1, // 选择一张图片
						sourceType: ['camera'], // 从相机选择
					});

					if (res.tempFilePaths.length > 0) {
						const imagePath = res.tempFilePaths[0];
						this.newTopic.photo = imagePath; // 保存照片路径
						console.log("照片调用成功", imagePath);
					}
				} catch (error) {
					console.error("拍照失败:", error);
					uni.showToast({
						title: "拍照失败，请重试",
						icon: "none",
					});
				}
			},

			async submitTopic() {
				// 验证主题标题和内容是否为空
				if (!this.newTopic.title || !this.newTopic.content) {
					this.handleError("主题标题和内容不能为空");
					return;
				}

				const topicData = {
					userId: 11,
					title: this.newTopic.title,
					content: this.newTopic.content,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					category: 3,
				};

				// 提交主题数据
				try {
					const res = await base_url({
						url: `/system/insertTopic`,
						method: "POST",
						data: topicData,
						header: {
							"Content-Type": "application/json",
						},
					});

					if (res && res.code === 200) {
						const topicId = res.data.topicId; // 确保这里获取到 topicId
						uni.showToast({
							title: "主题提交成功",
							icon: "success"
						});
						this.resetNewTopic(); // 重置主题输入内容

						// 检查用户是否要上传照片
						const uploadPhoto = await this.confirm("是否要上传照片？");
						if (uploadPhoto) {
							await this.takePhoto1(); // 拍照并保存照片路径

							// 如果拍照成功，上传照片
							if (this.newTopic.photo) {
								const uploadRes = await this.uploadPhoto(topicData.userId);
								if (uploadRes && uploadRes.code === 200) {
									uni.showToast({
										title: "照片上传成功",
										icon: "success"
									});

									// 将照片 URL 存储到主题对象中
									const uploadedPhotoUrl = uploadRes.data;

									// 更新主题对象并推入主题列表
									this.topics.push({
										...topicData,
										topicId: topicId, // 添加主题 ID
										photoUrl: uploadedPhotoUrl // 存储照片 URL
									});
								} else {
									console.error("上传照片的响应:", uploadRes);
									this.handleError("照片上传失败");
								}
							} else {
								this.handleError("没有选择照片，无法上传");
							}
						} else {
							// 如果用户选择不上传照片，则直接将主题添加到列表
							this.topics.push({
								...topicData,
								topicId: topicId, // 添加主题 ID
								photoUrl: null // 没有照片 URL
							});
						}
					} else {
						this.handleError("主题提交失败，请重试");
					}
				} catch (error) {
					this.handleError("提交主题失败: " + error.message);
				}
			},



			async uploadPhoto(userId) {
				const filePath = this.newTopic.photo; // 使用已存储的照片路径
				if (!filePath) {
					this.handleError("没有选择照片，无法上传");
					return null; // 返回 null
				}

				// 使用 uni.uploadFile 上传照片
				try {
					const uploadRes = await uni.uploadFile({
						url: `http://124.221.52.73:8080/system/uploadPhoto`,
						filePath: filePath,
						name: 'photo', // 这个是后端接收文件的字段名
						formData: {
							userId: userId,
						},
						method: "POST",
					});

					// 确保将返回的数据进行解析
					const data = JSON.parse(uploadRes.data); // 解析返回的 JSON 数据

					return data; // 返回解析后的数据
				} catch (error) {
					console.error("上传照片失败:", error);
					this.handleError("上传照片失败: " + error.message);
					return null; // 返回 null
				}
			},



			async getBase64FromFile(imagePath) {
				return new Promise((resolve, reject) => {
					console.log("尝试读取文件路径:", imagePath); // Debug: 打印文件路径
					uni.getFileSystemManager().readFile({
						filePath: imagePath,
						encoding: 'base64',
						success: (res) => {
							resolve(res.data); // 直接返回 base64 数据
						},
						fail: (error) => {
							console.error("获取文件失败:", error); // Debug: 打印错误信息
							reject(error);
						},
					});
				});
			},

			handleError(message) {
				console.error(message);
				uni.showToast({
					title: message,
					icon: "none",
				});
			},

			resetNewTopic() {
				this.newTopic.title = '';
				this.newTopic.content = '';
				this.newTopic.photo = null;
			},


			// 获取特定类别的主题
			async fetchTopicsByCategory(category) {
				try {
					const res = await base_url({
						url: `/system/getTopicsByCategory?category=${category}`, // 使用base_url
						method: "GET",
					});

					if (res.code === 200) {
						// 确保每个主题都包含 topicId
						this.topics = res.data.map(topic => ({
							...topic,
							replies: [], // 初始化回复列表
							newReply: '', // 新回复内容
							photoUrl: topic.photoUrl || null // 确保从后端获取的主题数据中含有 photoUrl
						}));
						// 处理每个主题的回复
						this.topics.forEach(topic => {
							this.fetchRepliesByTopicId(topic.topicId);
						});
					} else {
						uni.showToast({
							title: "获取主题失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("获取主题失败:", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},



			// 获取特定主题的回复
			async fetchRepliesByTopicId(topicId) {
				try {
					const res = await base_url({
						url: `/system/replies/getRepliesByTopicId?topicId=${topicId}`, // 使用base_url
						method: "GET",
					});

					if (res.code === 200) {
						const topic = this.topics.find(t => t.topicId === topicId);
						if (topic) {
							topic.replies = res.data; // 更新对应的回复列表
						}
					} else {
						uni.showToast({
							title: "获取回复失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("获取回复失败:", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},

			// 提交回复
			async submitReply(topic) {
				if (!topic.newReply) {
					uni.showToast({
						title: "回复内容不能为空",
						icon: "none",
					});
					return;
				}

				const params = {
					topicId: topic.topicId,
					content: topic.newReply,
					userId: 11, // 用户ID（根据实际情况设置）
					createdAt: new Date().toISOString(),
				};

				try {
					const res = await base_url({
						url: `/system/replies/insertReply`, // 使用base_url
						method: "POST",
						data: params,
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (res.code === 200) {
						uni.showToast({
							title: "回复成功",
							icon: "success",
						});
						topic.newReply = ""; // 清空回复输入框
						this.fetchRepliesByTopicId(topic.topicId); // 刷新该主题的回复列表
					} else {
						uni.showToast({
							title: "回复失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("提交回复失败:", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},

			// 格式化日期
			formatDate(dateString) {
				return new Date(dateString).toLocaleString(); // 将日期格式化为可读的字符串
			},

			//题库的缝合
			async fetchRandomQuestion() {
				try {
					const response = await flask({
						url: "/random_question", // 获取随机问题的接口
						method: "GET",
					});

					// 打印整个响应对象以检查结构
					console.log("API 响应:", JSON.stringify(response, null, 2));

					// 确保响应是有效的
					if (!response) {
						throw new Error("未获取到有效数据");
					}

					// 检查 options 是否存在
					if (!response.options) {
						throw new Error("返回的数据没有选项");
					}

					// 将 options 对象转换为数组
					const optionsArray = Object.keys(response.options).map(key => ({
						key,
						value: response.options[key],
					}));

					this.randomQuestion = {
						...response,
						options: optionsArray, // 替换为数组
					};

				} catch (error) {
					console.error("获取随机问题失败:", error.message);
					console.error("详细错误:", error);
				}
			},


			// 检查答案并提交用户选择
			async checkAnswer(selectedOption) {
				const userId = "666666"; // 假设用户ID为 user123
				const questionId = this.randomQuestion.id; // 获取当前问题的 ID

				try {
					const response = await this.submitUserAnswer(userId, questionId, selectedOption);

					// 不再在这里设置 feedback 信息，因为已经在 submitUserAnswer 中处理了
				} catch (error) {
					console.error("检查答案失败:", error);
					this.answerResult = "检查答案失败，请重试。";
				}
			},


			// 提交用户答案的方法
			async submitUserAnswer(userId, questionId, selectedAnswer) {
				console.log("submit before try");
				this.loading = true; // 显示加载指示器
				this.answerResult = ""; // 清空之前的反馈信息
				try {
					const response = await flask({
						url: "/submit_answer", // 提交答案的接口
						method: "POST",
						data: {
							user_id: userId,
							question_id: questionId,
							user_answer: selectedAnswer,
						},
					});
					console.log("提交结果:", response); // 打印提交结果

					if (response.message === "答案提交成功") {
						// 直接在这里设置用户反馈信息
						this.answerResult = response.is_correct ? "回答正确！" : "回答错误！";
						this.answerResult += " 答案已成功提交！"; // 提示提交成功

						// 只有当回答正确时，才调用 AI 模型进行讲解
						if (response.is_correct) {
							this.airesponse = ""; // 清空之前的响应
							await this.aianalyze(this.randomQuestion.question_text);
							this.showAIResponse = true; // 显示 AI 响应模态框
						}
					} else {
						this.answerResult = "但答案提交失败。"; // 提示提交失败
					}
				} catch (error) {
					console.error("提交答案失败:", error);
					this.answerResult = "提交答案失败，请重试。";
				} finally {
					this.loading = false; // 隐藏加载指示器
				}
			},



			// 调用ai大模型，进行问题的讲解
			async aianalyze(question_text) {
				console.log("调用 AI 进行讲解，问题文本:", question_text);
				try {
					const response = await flask({
						url: "/submit_answer_analyze",
						method: "POST",
						data: {
							user_input: question_text,
						},
						headers: {
							"Content-Type": "application/json",
						},
					});
					this.airesponse = response.ai_response; // 假设返回的结构包含 ai_response
					console.log("AI 响应:", this.airesponse); // 打印 AI 响应以验证成功调用
				} catch (error) {
					console.error("调用 AI 进行讲解失败:", error);
					this.airesponse = "AI 响应失败，请重试。"; // 处理错误情况
				}
			},
			async closeAIResponse() {
				this.showAIResponse = false; // 隐藏模态框
				await this.fetchRandomQuestion(); // 获取下一个问题
				this.answerResult = ""; // 清空反馈信息
			},

// 勋章
async fetchUserMedal() {
    try {
        const response = await flask({
            url: "/answer_medal",
            method: "POST",
            data: JSON.stringify({
                user_id: 666666 // 确保数据的格式
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        // 获取勋章信息
		console.log(response);
        this.medal = response.medal; // 更新勋章信息

        // 获取徽章图片
        await this.fetchMedalImage(); // 调用获取勋章图片的方法

    } catch (error) {
        console.error('Error fetching user medal:', error);
    }
},

// 获取徽章图片
async fetchMedalImage() {
    try {
        const res = await flask({
            url: "/getLackPhotos",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
		console.log(res);
        // 根据勋章信息设置相应的图片路径
        if (this.medal === "金牌") {
            this.medalImage = res.imageUrls[2]; // 替换为实际金牌图片路径
        } else if (this.medal === "银牌") {
            this.medalImage = res.imageUrls[0]; // 替换为实际银牌图片路径
        } else if (this.medal === "铜牌") {
            this.medalImage = res.imageUrls[1]; // 替换为实际铜牌图片路径
        } else {
            this.medalImage = null; // 没有勋章，不显示图片
        }
        console.log(this.medalImage);

    } catch (error) {
        console.error('Error fetching medal image:', error);
    }
},
			//缺素分析的缝合
			async takePhoto() {
				try {
					const res = await uni.chooseImage({
						count: 1, // 选择一张图片
						sourceType: ['camera'], // 从相机选择
					});

					if (res.tempFilePaths.length > 0) {
						const imagePath = res.tempFilePaths[0];
						await this.uploadImage(imagePath); // 调用上传图片的方法并等待其完成
					}
				} catch (error) {
					console.error("拍照失败:", error);
					uni.showToast({
						title: "拍照失败，请重试",
						icon: "none",
					});
				}
			},

			// 上传图片并进行缺素分析
			async uploadImage(imagePath) {
				const params = {
					url: "/capture/analyze", // 后端分析接口的 URL
					method: "POST",
					filePath: imagePath, // 上传的图片路径
					name: "file", // 后台接收的文件名
				};

				console.log("获取到的图片路径:", imagePath);
				console.log("请求参数:", params);

				try {
					// 显示加载提示
					uni.showLoading({
						title: '上传中...',
						mask: true
					});

					const uploadRes = await request.uploadFile(params); // 调用自定义的请求模块
					console.log("上传响应:", uploadRes); // 打印上传的响应

					let data;
					if (typeof uploadRes === 'string') {
						try {
							data = JSON.parse(uploadRes); // 解析字符串
						} catch (err) {
							console.error("解析响应数据失败:", err);
							throw new Error("解析响应失败");
						}
					} else {
						data = uploadRes; // 如果已经是对象，直接使用
					}

					console.log("解析后的数据:", data); // 输出解析后的数据

					// 处理缺素信息
					if (data.lack_element && data.image_url) {
						let description = ''; // 初始化描述变量

						// 根据缺素类型生成描述
						switch (data.lack_element) {
							case 'N': // 缺氮症
								description = "缺氮症，叶发黄，底部先枯，顶上不好长。生长缓慢，个子矮，养分不足，活力差。";
								break;
							case 'K': // 缺钾症
								description = "缺钾症，病先显，叶边焦枯，渐渐干枯边。抗病能力，下降快，施肥补救，要别再坏。";
								break;
							case 'P': // 缺磷症
								description = "缺磷症，根系弱，开花少果，果实也不给力。叶子发暗，紫红翘，光合作用，没法好。";
								break;
							default:
								description = "未识别的缺素类型。";
								break;
						}

						// 显示模态框时的提示信息
						uni.showModal({
							title: '缺素信息',
							content: `分析结果：缺少元素 - ${data.lack_element}`,
							showCancel: false,
							confirmText: '查看图片',
							success: function(res) {
								if (res.confirm) {
									// 存储缺素照片和描述
									this.imageUrls.push({
										url: data.image_url,
										description: description
									});
								}
							}.bind(this)
						});
					} else {
						uni.showToast({
							title: "未检测到缺素区域，您的植物可能很健康",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("上传图片失败:", error);
					uni.showToast({
						title: `上传失败，请重试。错误信息：${error.message}`,
						icon: "none",
					});
				} finally {
					// 确保隐藏加载提示
					uni.hideLoading();
				}
			},




			async getvideo() {
				const params = {
					url: "/teach_video", // 完整的接口URL
					method: "POST",
					data: {
						video_id: "4" // 传递视频ID，如果不需要可以去掉
					},
					header: {
						"Content-Type": "application/json",
					},
				};

				try {
					// 调用接口
					const res = await flask(params);
					console.log('后端返回的数据：', res);

					// 确保这里的字段名为 videoUrl
					if (res && res.videoUrl) {
						this.videoUrl = res.videoUrl; // 使用 videoUrl
						console.log('视频URL:', this.videoUrl); // 确认视频 URL
					} else {
						uni.showToast({
							title: "提交失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("接口调用失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},

			// 查询土壤微量元素数据
			async fetchSoilData() {
				const params = {
					timestamp: `${this.queryDate} 00:00:00`, // 格式化为 yyyy-MM-dd HH:mm:ss
				};

				try {
					const res = await uni.request({
						url: "/system/soilElements",
						method: "GET",
						data: params,
						header: {
							"Content-Type": "application/json",
						},
					});

					if (res.data.code === 1) {
						this.soilData = res.data.data;
						uni.showToast({
							title: "查询成功",
							icon: "success",
						});
					} else {
						uni.showToast({
							title: "查询失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("查询失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},
			// 查询土壤微量元素数据
			// 查询土壤微量元素数据
			async fetchSoilData() {
				// 获取当前时间并格式化为 yyyy-MM-dd HH:mm:ss
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				const timestamp = `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
				console.log(timestamp);
				const currentTime = {
					currentTime: timestamp // 格式化为 yyyy-MM-dd HH:mm:ss
				};

				try {
					const res = await uni.request({
						url: "http://124.221.52.73:8080/system/soilElements",
						method: "GET",
						data: currentTime,
						header: {
							"Content-Type": "application/json"
						}
					});

					if (res.data && res.data.data && res.data.data.length > 0) {
						this.soilData = res.data.data;
						this.renderChart();
					}
				} catch (error) {
					console.error('获取土壤数据失败:', error);
				}
			},
			renderChart() {
				const nitrogenData = [];
				const phosphorusData = [];
				const potassiumData = [];
				const times = [];

				this.soilData.forEach(item => {
					nitrogenData.push(parseFloat(item.staValue['土壤氮']));
					phosphorusData.push(parseFloat(item.staValue['土壤磷']));
					potassiumData.push(parseFloat(item.staValue['土壤钾']));
					times.push(Number(item.staTime.slice(5, 7)) + '.' + Number(item.staTime
						.slice(8,
							10)));
				});

				this.elementOPT.xAxis.data = times;
				this.elementData.categories = times;
				this.elementData.series = [{
						name: '氮含量',
						data: nitrogenData
					},
					{
						name: '磷含量',
						data: phosphorusData
					},
					{
						name: '钾含量',
						data: potassiumData
					}
				];
			},
			// 跳转到视频直播板块
			navigateToVideo() {
				uni.navigateTo({
					url: "/pages/video/video",
				});
			},

			// 获取评论列表
			async fetchComments() {
				try {
					const res = await uni.request({
						url: "/system/getExperimentComments",
						method: "GET",
						header: {
							"Content-Type": "application/json",
						},
					});

					if (res.data.code === 1) {
						this.comments = res.data.data;
					} else {
						uni.showToast({
							title: "获取评论失败",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("获取评论失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},

			// 发表评论
			async submitComment() {
				if (!this.newCommentContent) {
					uni.showToast({
						title: "评论内容不能为空",
						icon: "none",
					});
					return;
				}

				const params = {
					user_id: 1, // 用户ID（可根据实际需求修改）
					content: this.newCommentContent,
				};

				try {
					const res = await uni.request({
						url: "/system/makeExperimentComments",
						method: "POST",
						data: params,
						header: {
							"Content-Type": "application/json",
						},
					});

					if (res.data.code === 1) {
						uni.showToast({
							title: "评论成功",
							icon: "success",
						});
						this.newCommentContent = "";
						this.fetchComments(); // 刷新评论列表
					} else {
						uni.showToast({
							title: "评论失败，请重试",
							icon: "none",
						});
					}
				} catch (error) {
					console.error("发表评论失败：", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none",
					});
				}
			},
		},
	};
</script>

<style>
	/* 蓝绿色渐变背景动画 */
	@keyframes gradientBackground {
		0% {
			background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
		}

		25% {
			background: linear-gradient(135deg, #80deea, #4dd0e1);
		}

		50% {
			background: linear-gradient(135deg, #26c6da, #00bcd4);
		}

		75% {
			background: linear-gradient(135deg, #80deea, #4dd0e1);
		}

		100% {
			background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
		}
	}

	.content {
		animation: gradientBackground 15s ease infinite;
		padding: 10rpx;
		min-height: 100vh;
		line-height: 1.5;
	}

	.section {
		margin-bottom: 40rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10rpx);
		padding: 20rpx;
	}

	.title-box {
		background-color: #10B078;
		padding: 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
		line-height: 1.8;
	}

	.content-text {
		font-size: 18px;
		color: #555;
		line-height: 1.8;
		padding: 20px;
	}

	.experiment-area {
		background-color: rgba(255, 255, 255, 0.8);
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.input-group {
		margin-bottom: 30rpx;
	}

	.label {
		font-size: 28rpx;
		color: #10B078;
		margin-bottom: 10rpx;
		line-height: 1.6;
	}

	.submit-button {
		background-color: #10B078;
		color: #fff;
		font-size: 28rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		text-align: center;
		margin: 20rpx 0;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		line-height: 1.5;
	}

	.submit-button:hover {
		transform: translateY(-5rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.feedback {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.feedback-score {
		font-size: 28rpx;
		color: #555;
		margin-bottom: 10rpx;
		line-height: 1.6;
	}

	.comment-item {
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.comment-content {
		font-size: 28rpx;
		color: #555;
		margin-bottom: 10rpx;
		line-height: 1.6;
	}

	.comment-info {
		font-size: 24rpx;
		color: #888;
		line-height: 1.6;
	}

	.no-comments {
		text-align: center;
		padding: 20rpx;
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
	}

	.comment-input {
		margin-top: 20rpx;
	}

	.textarea {
		width: 100%;
		padding: 20rpx;
		border: 1rpx solid #ddd;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		height: 200rpx;
		line-height: 1.6;
	}

	.video-button {
		background-color: #FFA500;
		color: #fff;
		font-size: 28rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		text-align: center;
		margin: 20rpx 0;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		line-height: 1.5;
	}

	.video-button:hover {
		transform: translateY(-5rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.title-box {
		background-color: #10B078;
		/* 标题背景颜色 */
		padding: 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	/* 视频播放器样式 */
	.video-player {
		width: 100%;
		/* 宽度占满父容器 */
		height: 400rpx;
		/* 设置一个合适的高度 */
		border-radius: 20rpx;
		/* 圆角 */
		overflow: hidden;
		/* 隐藏超出部分 */
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		/* 阴影效果 */
	}


	.photo-gallery {
		display: flex;
		flex-direction: column;
		/* 竖直排列 */
		align-items: center;
		/* 中心对齐 */
		gap: 20rpx;
		/* 每个照片容器的间隔 */
	}

	.photo-container {
		text-align: center;
		width: 100%;
		/* 将宽度设置为100% */
		margin-bottom: 20rpx;
		/* 确保每行底部有空间 */
	}

	.photo {
		width: 100%;
		/* 确保图片宽度充满容器 */
		height: 400rpx;
		/* 设置一个统一的高度，使其与视频播放器一致 */
		border-radius: 10rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.photo-description {
		margin-top: 10rpx;
		font-size: 28rpx;
		color: #555;
	}

	.photo-button {
		background-color: #4CAF50;
		/* 绿色背景 */
		color: #fff;
		font-size: 28rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		text-align: center;
		margin: 20rpx 0;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		line-height: 1.5;
	}

	.photo-button:hover {
		transform: translateY(-5rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	/*缺素识别的框*/
	.image-modal {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.modal-image {
		width: 80%;
		height: auto;
	}

	.image-description {
		color: white;
		margin-top: 10px;
		text-align: center;
	}

	/*题库*/
	.question-container {
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.options {
		margin: 10px 0;
	}

	button {
		margin-right: 5px;
		padding: 10px;
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}

	.question-container {
		max-width: 600px;
		/* 最大宽度 */
		margin: 20px auto;
		/* 居中对齐 */
		padding: 20px;
		/* 内边距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 10px;
		/* 圆角 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		/* 阴影效果 */
		background-color: #f9f9f9;
		/* 背景色 */
		font-family: 'Arial', sans-serif;
		/* 字体 */
	}

	.question-content {
		margin: 20px 0;
		/* 问题与选项之间的间距 */
	}

	.question-text {
		font-size: 1.2em;
		/* 字体大小 */
		line-height: 1.5;
		/* 行高 */
		margin-bottom: 15px;
		/* 底部间距 */
		color: #333;
		/* 字体颜色 */
	}

	.options {
		display: flex;
		/* 横向排列选项 */
		flex-direction: column;
		/* 垂直方向 */
	}

	.option-button {
		background-color: #28a745;
		/* 按钮颜色 */
		color: white;
		/* 按钮字体颜色 */
		border: none;
		/* 无边框 */
		border-radius: 5px;
		/* 圆角 */
		padding: 10px;
		/* 内边距 */
		margin: 5px 0;
		/* 按钮间距 */
		cursor: pointer;
		/* 鼠标悬停时指针样式 */
		transition: background-color 0.3s;
		/* 背景颜色过渡 */
		font-size: 1em;
		/* 字体大小 */
	}

	.option-button:hover {
		background-color: #218838;
		/* 鼠标悬停时按钮颜色 */
	}

	.answer-result {
		margin-top: 15px;
		/* 上间距 */
		font-weight: bold;
		/* 加粗 */
		color: #007bff;
		/* 结果显示颜色 */
	}

	.loading-message {
		text-align: center;
		/* 居中显示 */
		color: #999;
		/* 颜色 */
		font-style: italic;
		/* 斜体 */
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		/* 确保在最上面 */
	}

	.loading-spinner {
		color: white;
		font-size: 24px;
	}

	.ai-response-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		/* 确保模态框在最上面 */
		padding: 20px;
		width: 80%;
		max-width: 600px;
	}

	.medal-display {
		margin-top: 20rpx;
		/* 顶部间距 */
		padding: 20rpx;
		/* 内边距 */
		background-color: rgba(255, 255, 255, 0.8);
		/* 背景颜色 */
		border-radius: 20rpx;
		/* 圆角 */
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		/* 阴影效果 */
	}

	.medal {
		font-weight: bold;
		/* 加粗 */
		font-size: 24rpx;
		/* 字体大小 */
		color: #4caf50;
		/* 勋章的颜色 */
	}

	.medal-image {
		margin-top: 10rpx;
		/* 图片与文本的间距 */
		width: 100px;
		/* 设置宽度 */
		height: auto;
		/* 自适应高度 */
	}

	/*讨论区和评论区的*/
	.topic-section {
		padding: 20px;
		background: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.title-box {
		margin-bottom: 15px;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		color: #333;
	}

	.discussion-box {
		margin-bottom: 30px;
		/* 主题讨论与展示之间的间隔 */
		padding: 15px;
		background: #ffffff;
		border-radius: 8px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
	}

	.topic-input {
		margin-bottom: 20px;
	}

	.topic-input-field {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: #f7f7f7;
		font-size: 16px;
	}

	.submit-topic-button {
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 10px 20px;
		cursor: pointer;
		font-size: 16px;
	}

	.display-box {
		padding: 15px;
		background: #ffffff;
		border-radius: 8px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
	}

	.topic-list {
		margin-top: 20px;
	}

	.topic-item {
		margin-bottom: 20px;
		padding: 15px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background: #f9f9f9;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
	}

	.topic-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.topic-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.topic-content {
		font-size: 16px;
		color: #555;
		margin: 10px 0;
	}

	.topic-user,
	.topic-date {
		font-size: 12px;
		color: #999;
	}

	.reply-list {
		margin-top: 10px;
		padding-left: 10px;
	}

	.reply-item {
		margin-bottom: 8px;
		padding: 8px;
		border-left: 3px solid #007bff;
		background: #f1f1f1;
		border-radius: 4px;
	}

	.reply-user {
		font-weight: bold;
		color: #007bff;
	}

	.reply-content {
		font-size: 14px;
		color: #333;
	}

	.reply-input {
		display: flex;
		margin-top: 10px;
	}

	.reply-input-field {
		flex: 1;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		margin-right: 10px;
		font-size: 14px;
	}

	.submit-reply-button {
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 10px;
		cursor: pointer;
	}

	.topic-item {
		margin-bottom: 20px;
		padding: 15px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background: #f9f9f9;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
	}

	.topic-header {
		margin-bottom: 10px;
	}

	.topic-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.topic-meta {
		display: flex;
		justify-content: space-between;
		/* 两个信息在一行中分开 */
		margin-bottom: 10px;
		/* 元素之间的间距 */
		font-size: 12px;
		color: #999;
		/* 使用户ID和时间信息颜色变淡 */
	}

	.topic-content {
		font-size: 16px;
		color: #555;
		margin: 10px 0;
	}

	.reply-list {
		margin-top: 10px;
		padding-left: 10px;
	}

	.reply-item {
		margin-bottom: 8px;
		padding: 8px;
		border-left: 3px solid #007bff;
		background: #f1f1f1;
		border-radius: 4px;
	}

	.reply-user {
		font-weight: bold;
		color: #007bff;
	}

	.reply-content {
		font-size: 14px;
		color: #333;
	}

	.reply-input {
		display: flex;
		margin-top: 10px;
	}

	.reply-input-field {
		flex: 1;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		margin-right: 10px;
		font-size: 14px;
	}

	.submit-reply-button {
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 10px;
		cursor: pointer;
	}

	.discussion-box {
		padding: 20px;
		background-color: #f9f9f9;
		/* 背景颜色 */
		border-radius: 8px;
		/* 圆角 */
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		/* 阴影效果 */
	}

	.topic-input {
		display: flex;
		flex-direction: column;
		/* 纵向排列 */
	}

	.topic-input-field {
		margin-bottom: 12px;
		/* 输入框之间的间距 */
		padding: 10px;
		/* 内边距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 4px;
		/* 圆角 */
		font-size: 16px;
		/* 字体大小 */
	}

	.upload-photo-button,
	.submit-topic-button {
		padding: 10px 15px;
		/* 上下和左右内边距 */
		border: none;
		/* 无边框 */
		border-radius: 4px;
		/* 圆角 */
		font-size: 16px;
		/* 字体大小 */
		color: #fff;
		/* 字体颜色 */
		cursor: pointer;
		/* 鼠标指针样式 */
		transition: background-color 0.3s;
		/* 背景颜色过渡效果 */
		margin-bottom: 12px;
		/* 按钮之间的间距 */
	}

	.upload-photo-button {
		background-color: #007bff;
		/* 按钮背景颜色 */
	}

	.upload-photo-button:hover {
		background-color: #0056b3;
		/* 悬停时的背景颜色 */
	}

	.submit-topic-button {
		background-color: #28a745;
		/* 按钮背景颜色 */
	}

	.submit-topic-button:hover {
		background-color: #218838;
		/* 悬停时的背景颜色 */
	}
</style>