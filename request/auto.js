// 引入 request 文件
import request from './124flask.js'

export const autoGreet = (obj) => {
	return request({
		url: `/greet`,
		method: 'post',
		data: obj
	})
}