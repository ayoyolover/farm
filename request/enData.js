// 引入 request 文件
import request from './index.js'

// 查询pH和电导率列表
export const getPAC = (time) => {
	return request({
		url: `/system/getPhAndConductivityList?currentTime=${time}`,
		method: 'get',
	})
}
// 查询氮磷钾列表
export const getNPK = (time) => {
	return request({
		url: `/system/soilElements?currentTime=${time}`,
		method: 'get',
	})
}