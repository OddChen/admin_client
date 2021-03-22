/* eslint-disable import/no-anonymous-default-export */
import store from 'store'
/*local数据存储 */
const USER_KEY = 'user_key'
export default {
  //保存
  saveUser(user) {
    //localStorage.setItem(USER_KEY, JSON.stringify(user))
    store.set(USER_KEY, user)
  },
  //读取
  getUser() {
    //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    return store.get(USER_KEY) || {}
  },
  //删除
  removeUser() {
    store.remove(USER_KEY)
  }
}