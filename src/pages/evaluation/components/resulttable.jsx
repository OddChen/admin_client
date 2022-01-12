import { useEffect, useState } from 'react'
import { Table } from 'antd'
import topsis_predict from './topsis'

const ResultTable = (props) => {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState()

  useEffect(() => {
    const _criteria = props.criteria.dataSource.map((item) => ({
      name: item.name,
      type: item.type,
      weight: parseFloat(item.weight / 100.0),
    }))
    const _dataset = props.dataset.map((row) => [
      ..._criteria.map((item) => row[item.name]),
    ])
    // 评价结果
    const cri_result = topsis_predict(_dataset, _criteria)

    const newresult = cri_result.map((item, index) => ({
      key: index + 1,
      city: props.dataset[item[0]].name,
      score: item[1],
    }))

    setTimeout(() => {
      props.handleResult(newresult)
      setResult(newresult)
      setLoading(false)
    }, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      title: '排名',
      dataIndex: 'key',
    },
    {
      title: '城市',
      dataIndex: 'city',
    },
    {
      title: '评价得分',
      dataIndex: 'score',
      sorter: {
        compare: (a, b) => a.score - b.score,
      },
    },
  ]

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={result}
        scroll={{ y: 200 }}
      />
    </div>
  )
}

export default ResultTable
