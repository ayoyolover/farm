// 引入 request 文件
import request from './respberry.js'

// 分页查询学习列表
export const capture = (time) => {
	return request({
		url: `/capture`,
		method: 'get',
	})
}
// 获取学习列表详细信息
export const handleOX = (option) => {
	return request({
		url: `/handleOX?action=${option}`,
		method: 'get',
	})
}

export const handleLED = (option) => {
	return request({
		url: `/handleLED?action=${option}`,
		method: 'get',
	})
}