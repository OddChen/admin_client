import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '../../components/header'
import memoryUtils from '../../utils/memoryUtils'
import './home.less'
import Design from '../design/design'
import Manage from '../manage/manage'
import DashBoard from '../dashboard/dashboard'
import User from '../user/user'

const { Content, Footer } = Layout
/**
 * 管理路由组件
 */
class Dashboard extends React.Component {
  render() {
    const user = memoryUtils.user
    if (!user || !user._id) {
      //跳转到登录
      return <Redirect to='/login' />
    }
    return (
      <div>
        <Layout className='layout'>
          <Header />
          <Content className='layout-content'>
            <Switch>
              <Route path='/dashboard' component={DashBoard} />
              <Route path='/design' component={Design} />
              <Route path='/manage' component={Manage} />
              <Route path='/user' component={User} />
              <Redirect to='/' />
            </Switch>
          </Content>
          <Footer className='layout-footer'>推荐使用谷歌浏览器</Footer>
        </Layout>
      </div>
    )
  }
}

export default Dashboard
