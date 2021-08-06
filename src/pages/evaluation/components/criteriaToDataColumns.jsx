import { Button, Popconfirm } from 'antd'

export const criteriaToDataColumns = (dataSource, handleDelete) => {
  return [
    {
      title: '城市',
      dataIndex: 'city',
      width: 100,
      fixed: 'left',
      editable: true,
    },
    ...dataSource.map((column) => ({
      title: `${column.name}`,
      dataIndex: column.name,
      width: 100,
      editable: true,
    })),
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title='确认删除?'
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type='primary'>删除</Button>
          </Popconfirm>
        ) : null,
    },
  ]
}
