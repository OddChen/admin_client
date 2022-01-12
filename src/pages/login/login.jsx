import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, Redirect } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import logo from '../../assets/images/small-logo.png'
import { reqLogin } from '../../api'
import './login.less'
/**
 * 登录路由组件
 */
class Login extends React.Component {
  onFinish = async (values) => {
    const { username, password } = values
    const response = await reqLogin(username, password)
    // console.log('检验成功', response.data)
    const result = response.data //{status: 0, data: } {status: 1, msg: ''}
    const user = result.data
    memoryUtils.user = user
    storageUtils.saveUser(user)
    if (result.status === 0) {
      message.success('登录成功', 2)
      //跳转页面
      this.props.history.replace('/')
    } else {
      // 登录失败提示错误信息
      message.error(result.msg, 3)
    }
  }

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    message.error('请重新登录')
    //console.log('检验失败', values, errorFields, outOfDate);
  }
  render() {
    let user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/' />
    }
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo' />
          <h1>智慧城市评价结果可视化</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <div>
            <Form
              name='normal_login'
              className='login-form'
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
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='login-form-button'
                >
                  登录
                </Button>
                <Link className='register-link' to='/register'>
                  注册
                </Link>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    )
  }
}

export default Login
