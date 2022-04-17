import React, { Component } from 'react'
import { Form, Button, Input, Cascader, message } from 'antd'
import { Link } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import logo from '../../assets/images/small-logo.png'
import options from '../../config/cityselect-config'
import './register.less'
import { reqAddUser } from '../../api'

class Register extends Component {
  onFinish = async (values) => {
    const { username, password, region } = values
    const response = await reqAddUser(username, password, region)
    //console.log('检验成功', response.data)
    const result = response.data //{status: 0, data: } {status: 1, msg: ''}
    if (result.status === 0) {
      message.success('注册成功', 2)
      //跳转页面
      this.props.history.replace('/login')
    } else {
      // 登录失败提示错误信息
      message.error(result.msg, 3)
    }
  }
  onFinishFailed = () => {
    message.error('注册失败，请重新注册')
  }
  onChange(value) {
    console.log(value)
  }
  render() {
    return (
      <div className='register'>
        <header className='register-header'>
          <img src={logo} alt='logo' />
          <h1>数据分析结果可视化平台</h1>
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
                rules={[
                  { required: true, message: '请输入用户名！' },
                  { min: 4, message: '用户名至少4位' },
                  { max: 12, message: '用户名至多12位' },
                  {
                    pattern: /\w+/,
                    message: '用户名必须是字母、数字或下划线的组合',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='用户名'
                />
              </Form.Item>
              <Form.Item
                name='password'
                rules={[
                  { required: true, message: '请输入密码!' },
                  { min: 4, message: '密码至少4位！' },
                  { max: 12, message: '密码至多12位！' },
                  {
                    pattern: /\w+/,
                    message: '密码必须是字母、数字或下划线的组合',
                  },
                ]}
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
              <Form.Item name='region'>
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
