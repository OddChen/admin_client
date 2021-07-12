/*
包含应用中所有接口请求函数模块
每个函数的返回值都是promise
*/

import ajax from './ajax'
//登录
export const reqLogin = (username, password) =>
  ajax('/login', { username, password }, 'POST')

//添加用户
export const reqAddUser = (username, password, region) =>
  ajax('/register', { username, password, region }, 'POST')

//导出数据
export const reqExport = (dashboard) => {
  return ajax('/export', { dashboard }, 'POST')
}

//获取当前用户可查看的模板数据
export const reqGetData = (user_id) => {
  return ajax('/getdata', { user_id }, 'POST')
}
