import { useEffect, useState } from 'react'
import { Table } from 'antd'
import topsis_predict from './topsis'

const ResultTable = (props) => {
  const [loading, setLoading] = useState(true)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    const _criteria = props.criteria.dataSource.map((item) => ({
      name: item.name,
      type: item.type,
      weight: parseFloat(item.weight / 100.0),
    }))
    const _dataset = props.dataset.map((row) => [
      ..._criteria.map((item) => row[item.name]),
    ])

    const result = topsis_predict(_dataset, _criteria)
    setTimeout(() => {
      setDataset(
        result.map((item, index) => ({
          id: index + 1,
          city: props.dataset[item[0]].name,
          score: item[1],
        }))
      )
      setLoading(false)
    }, 1000)
  }, [props.criteria.dataSource, props.dataset])

  const columns = [
    {
      title: '排名',
      dataIndex: 'id',
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
        dataSource={dataset}
        scroll={{ y: 200 }}
      />
    </div>
  )
}

export default ResultTable
