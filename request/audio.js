// 引入 request 文件
import request from './124flask.js'

// 分页查询学习列表
export const textToAudio = (data) => {
	return request({
		url: `/system/generateAudio`,
		method: 'POST',
		data: data
	})
}
