/**
 * 可视化设计方案表格
 */
import { useState } from 'react'
import { Skeleton, Card, Button, Pagination, Spin } from 'antd'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import './editorscheme.less'
import { Link } from 'react-router-dom'
import editorData from '../editor/editor-data.json'

const EditorScheme = () => {
  const [loading, setLoading] = useState()
  const [spinning, setSpinning] = useState(true)
  const [pagevalue, setPagevalue] = useState(0)
  const { Meta } = Card

  let schemes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  const handleChange = (value) => {
    //page, pageSize
    setPagevalue((value - 1) * 15)
  }

  setTimeout(() => {
    setSpinning(false)
  }, 500)

  let editor = {
    pathname: '/editor',
    editorData,
  }

  let render = schemes.slice(pagevalue, pagevalue + 15).map((scheme) => {
    return (
      <div>
        <Spin spinning={spinning}>
          <Card
            key={scheme}
            className='scheme-card'
            hoverable={true}
            actions={[
              // <Button type='link'>
              //   <SettingOutlined key='setting' />
              //   操作
              // </Button>,
              <Button type='link' size='small'>
                <Link to={editor}>
                  <EditOutlined key='edit' />
                  编辑
                </Link>
              </Button>,
            ]}
          >
            <Skeleton loading={loading} active>
              <Meta title={scheme} description='This is the description' />
            </Skeleton>
          </Card>
        </Spin>
      </div>
    )
  })
  //key: scheme.dashboardname
  return (
    <div className='editorscheme'>
      {render}
      <Pagination
        className='scheme-pagination'
        size='small'
        defaultCurrent={1}
        defaultPageSize={15}
        onChange={handleChange}
        total={schemes.length}
      />
    </div>
  )
}

export default EditorScheme
