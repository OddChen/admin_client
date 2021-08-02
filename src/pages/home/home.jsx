import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd'
import Header from '../../components/header'
import memoryUtils from '../../utils/memoryUtils'
import './home.less'
import DashBoard from '../dashboard/dashboard'
import User from '../user/user'
import EditorScheme from '../editorscheme/editorscheme'
import Evaluation from '../evaluation/evaluation'

const { Content, Footer } = Layout
/**
 * 管理路由组件
 */
class Dashboard extends React.Component {
  render() {
    const user = memoryUtils.user
    if (!user || !user.id) {
      //跳转到登录
      return <Redirect to='/login' />
    }

    //面包屑同步
    let path = this.props.location.pathname.split('/').filter((i) => i)
    //console.log(path)
    const breadcrumbNameMap = {
      '/evaluation': '评价',
      '/dashboard': '展示',
      '/editorscheme': '方案',
      //'/manage': '管理',
      '/manage/user': '用户管理',
    }
    const extraBreadcrumbItems = path.map((_, index) => {
      const url = `/${path.slice(0, index + 1).join('/')}`
      return (
        <Breadcrumb.Item key={url}>{breadcrumbNameMap[url]}</Breadcrumb.Item>
      )
    })

    return (
      <div>
        <Layout>
          <Header />
          <Layout className='layout'>
            <Breadcrumb className='layout-breadcrumb'>
              {extraBreadcrumbItems}
            </Breadcrumb>
            <Content className='layout-content'>
              <Switch>
                <Route path='/evaluation' component={Evaluation} />
                <Route path='/dashboard' component={DashBoard} />
                <Route path='/editorscheme' component={EditorScheme} />
                <Route path='/manage/user' component={User} />
                <Redirect to='/dashboard' />
              </Switch>
            </Content>
          </Layout>

          <Footer className='layout-footer'>推荐使用谷歌浏览器</Footer>
        </Layout>
      </div>
    )
  }
}

export default Dashboard
