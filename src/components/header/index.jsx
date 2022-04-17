import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Modal } from 'antd'
import logo from '../../assets/images/small-logo.png'
import './index.less'
import menuList from '../../config/menu-config'
import SubMenu from 'antd/lib/menu/SubMenu'
import LinkButton from '../link-button'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

class Header extends Component {
  constructor(props) {
    super(props)
    this.menuNodes = this.getMeunNodes(menuList)
  }
  getMeunNodes = (menuList) => {
    let path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push(
          <Menu.Item key={item.path} icon={item.icon}>
            <Link to={item.path}>{item.title}</Link>
          </Menu.Item>
        )
      } else {
        const cItem = item.children.find((cItem) => cItem.key === path)
        if (cItem) {
          this.openKey = item.key
        }
        pre.push(
          <SubMenu key={item.path} icon={item.icon} title={item.title}>
            {this.getMeunNodes(item.children)}
          </SubMenu>
        )
      }
      return pre
    }, [])
  }

  logout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      onOk: () => {
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
      },
    })
  }

  render() {
    let path = this.props.location.pathname
    const openKey = this.openKey
    const username = memoryUtils.user.username

    return (
      <div className='top-nav'>
        <Link to='/' className='top-nav-header'>
          <img src={logo} alt='logo' />
          <h1>数据分析结果可视化平台</h1>
        </Link>
        <Menu
          theme='dark'
          mode='horizontal'
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
        <div className='header'>
          <div className='header-top'>
            <span>欢迎，{username} </span>
            <LinkButton onClick={this.logout}>退出</LinkButton>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
