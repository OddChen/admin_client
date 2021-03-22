import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import logo from '../../assets/images/LOGO.png'
import './index.less'
import menuList from '../../config/menu-config'
import SubMenu from 'antd/lib/menu/SubMenu'

function Header() {
  return (
    <div className='top-nav'>
      <Link to='/' className='top-nav-header'>
        <img src={logo} alt='logo' />
        <h1>智慧城市评价结果可视化</h1>
      </Link>
      <Menu theme='dark' mode='horizontal'>
        {menuList.map((item) => {
          if (!item.children) {
            return (
              <Menu.Item key={item.path} icon={item.icon}>
                <Link to={item.path}>{item.title}</Link>
              </Menu.Item>
            )
          } else {
            return (
              <SubMenu key={item.path} icon={item.icon} title={item.title}>
                {item.children.map((citem) => {
                  return (
                    <Menu.Item key={citem.path} icon={citem.icon}>
                      <Link to={citem.path}>{citem.title}</Link>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            )
          }
        })}
      </Menu>
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，admin</span>
          <a href='test'>退出</a>
        </div>
      </div>
    </div>
  )
}

export default Header
