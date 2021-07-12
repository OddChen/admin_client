/*
能发送异步AJAX请求的模块
封装axios库
返回值是promise对象
新建Promise对象统一处理请求异常
*/
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    //执行异步请求
    if (type === 'GET') {
      //发送GET请求
      promise = axios.get(url, {
        //配置对象
        params: data, //指定请求参数
      })
    } else {
      //POST请求
      promise = axios.post(url, data)
    }
    //成功调用resolve(value)
    promise
      .then((res) => {
        // console.log(res)
        resolve(res)
      })
      .catch((error) => {
        console.log(error)
        message.error('请求出错了' + error.message)
      })
  })
}
