// 引入 request 文件
import request from './index.js'

// 查询pH和电导率列表
// export const getStatus = (userId,plantId) => {
// 	return request({
// 		url: `/system/updateVirtualStatus?userId=${userId}&plantId=${plantId}&oxygenTimes=${0}&lightTimes=${0}`,
// 		method: 'get',
// 	})
// }

export const getStatus = (userId,plantId) => {
	return request({
		url: `/system/getVirtualStatus?userId=${userId}&plantId=${plantId}`,
		method: 'get',
	})
}
