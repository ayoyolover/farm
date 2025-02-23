// 全局请求封装
const base_url = 'http://192.168.1.109:5000';

// 需要修改token，和根据实际修改请求头
export default {
  request(params) {
    let url = params.url;
    let method = params.method || "GET";
    let data = params.data || {};

    return new Promise((resolve, reject) => {
      uni.request({
        url: base_url + url,
        method: method,
        data: data,
        sslVerify: false,
        success(response) {
          const res = response;
          if (res.statusCode == 200) {
            resolve(res.data);
          } else {
            uni.clearStorageSync();
            switch (res.statusCode) {
              case 401:
                uni.showModal({
                  title: "提示",
                  content: "请登录",
                  showCancel: false,
                  success() {
                    setTimeout(() => {
                      uni.navigateTo({
                        url: "/pages/login/index",
                      });
                    }, 1000);
                  },
                });
                break;
              case 404:
                uni.showToast({
                  title: '请求地址不存在...',
                  duration: 2000,
                });
                break;
              default:
                uni.showToast({
                  title: '请重试...',
                  duration: 2000,
                });
                break;
            }
          }
        },
        fail(err) {
          console.log(err);
          if (err.errMsg.indexOf('request:fail') !== -1) {
            uni.showToast({
              title: '网络异常',
              icon: "error",
              duration: 2000
            });
          } else {
            uni.showToast({
              title: '未知异常',
              duration: 2000
            });
          }
          reject(err);
        },
        complete() {
          uni.hideLoading();
          uni.hideToast();
        }
      });
    }).catch(() => {});
  },

  // 上传文件封装
  uploadFile(params) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: base_url + params.url, // 上传的接口
        filePath: params.filePath, // 文件路径
        name: params.name, // 后端接收的文件字段名
        formData: params.data || {}, // 附带的额外表单数据
        success: (uploadRes) => {
          console.log("上传响应:", uploadRes);
          try {
            // 假设返回的 uploadRes.data 是 JSON 格式 
            const res = JSON.parse(uploadRes.data);
            resolve(res); // 返回解析后的 JSON 对象
          } catch (err) {
            console.error("解析响应失败:", err, uploadRes.data);
            reject(new Error("响应数据格式错误"));
          }
        },
        fail: (err) => {
          console.log("上传文件失败", err);
          reject(err);
          uni.showToast({
            title: '文件上传失败',
            icon: 'none',
            duration: 2000,
          });
        },
        complete() {
          uni.hideLoading();
          uni.hideToast();
        }
      });
    });
  }

  
  
};
