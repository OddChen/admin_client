/**
 * 可视化设计方案表格
 */
import { useState } from 'react'
import { Skeleton, Card } from 'antd'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import './editorscheme.less'

const EditorScheme = () => {
  const [loading, setLoading] = useState()
  const { Meta } = Card

  let schemes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  return (
    <div className='editorscheme'>
      {schemes.map((scheme) => {
        return (
          <Card
            key={scheme}
            className='scheme-card'
            actions={[
              <SettingOutlined key='setting' />,
              <EditOutlined key='edit' />,
            ]}
          >
            <Skeleton loading={loading} active>
              <Meta title={scheme} description='This is the description' />
            </Skeleton>
          </Card>
        )
      })}
      {/* <Card
        className='scheme-card'
        actions={[
          <EditOutlined key='edit' />,
          <SettingOutlined key='setting' />,
        ]}
      >
        <Skeleton loading={loading} active>
          <Meta title='1' description='This is the description' />
        </Skeleton>
      </Card>
      <Card
        className='scheme-card'
        actions={[
          <EditOutlined key='edit' />,
          <SettingOutlined key='setting' />,
        ]}
      >
        <Skeleton loading={loading} active>
          <Meta title='2' description='This is the description' />
        </Skeleton>
      </Card> */}
    </div>
  )
}

export default EditorScheme
