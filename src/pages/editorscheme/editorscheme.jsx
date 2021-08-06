/**
 * 可视化设计方案表格
 */
import { useEffect, useState } from 'react'
import { Skeleton, Card, Button, Pagination, Spin, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import './editorscheme.less'
import { Link } from 'react-router-dom'
import editorDatas from '../editor/editor-data.json'
import { reqGetData } from '../../api'
import memoryUtils from '../../utils/memoryUtils'

const EditorScheme = () => {
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(true)
  const [pagevalue, setPagevalue] = useState(0)
  const [schemes, setSchemes] = useState([editorDatas])
  const { Meta } = Card

  const handleChange = (value) => {
    //page, pageSize
    setPagevalue((value - 1) * 15)
  }

  setTimeout(() => {
    setSpinning(false)
  }, 500)

  const user_id = memoryUtils.user.id
  useEffect(() => {
    const getData = async () => {
      const response = await reqGetData(user_id)
      const result = response.data

      if (result.status === 0) {
        setLoading(false)

        let schemesArr = []
        result.data.forEach((value) => {
          schemesArr.push(value)
        })

        setSchemes(schemesArr)
      } else {
        message.error(result.msg, 3)
      }
    }
    getData()
  }, [user_id])

  let render = schemes.slice(pagevalue, pagevalue + 15).map((scheme) => {
    let editor = {
      pathname: '/editor',
      editorData: scheme,
    }

    return (
      <div key={scheme.id}>
        <Spin spinning={spinning}>
          <Card
            className='scheme-card'
            hoverable={true}
            actions={[
              <Button type='link' size='small'>
                <Link to={editor}>
                  <EditOutlined key='edit' />
                  编辑
                </Link>
              </Button>,
            ]}
          >
            <Skeleton loading={loading} active>
              <Meta title={scheme.name} description={scheme.description} />
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
