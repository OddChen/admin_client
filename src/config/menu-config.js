import {
  PieChartOutlined,
  AppstoreOutlined,
  BlockOutlined,
  UserOutlined,
} from '@ant-design/icons'

const menuList = [
  {
    title: '展示',
    path: '/dashboard',
    icon: <PieChartOutlined />,
  },
  {
    title: '编辑',
    path: '/editor',
    icon: <AppstoreOutlined />,
  },
  {
    title: '管理',
    path: '/manage',
    icon: <BlockOutlined />,
    children: [
      {
        title: '用户信息管理',
        path: '/manage/user',
        icon: <UserOutlined />,
      },
      {
        title: '用户内容管理',
        path: '/manage/usercontent',
        icon: <UserOutlined />,
      },
    ],
  },
]

export default menuList
