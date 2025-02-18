// 引入 request 文件
import request from './index.js'

// 分页查询学习列表
export const getChatInfo = (userId,plantId) => {
	return request({
		url: `/system/getChatInfo?userId=${userId}&plantId=${plantId}`,
		method: 'get',
	})
}
export const getFarmerChatList = (userId) => {
	return request({
		url: `/system/getFarmerChatList?userId=${userId}`,
		method: 'get',
	})
}
// 获取学习列表详细信息
export const updateChatMessage = (obj) => {
	return request({
		url: `/system/updateChatMessage`,
		method: 'post',
		data: obj
	})
}

export const updateFarmerChatMessage = (obj) => {
	return request({
		url: `/system/updateFarmerChatMessage`,
		method: 'post',
		data: obj
	})
}
