import {
  PieChartOutlined,
  AppstoreOutlined,
  BlockOutlined,
  UserOutlined,
} from '@ant-design/icons'

const menulist = [
  {
    title: '展示',
    path: '/dashboard',
    icon: <PieChartOutlined />,
  },
  {
    title: '设计',
    path: '/design',
    icon: <AppstoreOutlined />,
  },
  {
    title: '管理',
    path: '/manage',
    icon: <BlockOutlined />,
    children: [
      {
        title: '用户内容管理',
        path: '/user',
        icon: <UserOutlined />,
      },
    ],
  },
]

export default menulist
