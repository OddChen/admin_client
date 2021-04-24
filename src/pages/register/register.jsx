import React, { Component } from 'react'
import { Form, Button, Input, Cascader } from 'antd'
import { Link } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import logo from '../../assets/images/small-logo.png'
import options from '../../config/cityselect-config'
import './register.less'

class Register extends Component {
  onFinish = () => {
    console.log('finish')
  }
  onFinishFailed = () => {
    console.log('false')
  }
  onChange(value) {
    console.log(value)
  }
  render() {
    return (
      <div className='register'>
        <header className='register-header'>
          <img src={logo} alt='logo' />
          <h1>智慧城市评价结果可视化</h1>
        </header>
        <section className='register-content'>
          <h2>注册</h2>
          <div>
            <Form
              name='register_form'
              className='register-form'
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                name='username'
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='用户名'
                />
              </Form.Item>
              <Form.Item
                name='password'
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className='site-form-item-icon' />}
                  type='password'
                  placeholder='密码'
                />
              </Form.Item>
              <Form.Item
                name='repassword'
                rules={[
                  { required: true, message: '请再次输入密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致!'))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className='site-form-item-icon' />}
                  type='password'
                  placeholder='再次输入'
                />
              </Form.Item>
              <Form.Item name='province'>
                <Cascader
                  options={options}
                  onChange={this.onChange}
                  placeholder='请选择所属城市'
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='register-form-button'
                >
                  注册
                </Button>
                <Link className='login-link' to='/login'>
                  登录
                </Link>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    )
  }
}

export default Register
