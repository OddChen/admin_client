import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Input, Button, Popconfirm, Form, Select } from 'antd'

const { Option } = Select
const EditableContext = React.createContext(null)
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const CriteriaTable = (props) => {
  const [state, setState] = useState({})
  const { dataSource } = state
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  //列名
  const column = [
    {
      title: '序号',
      dataIndex: 'key',
      width: 70,
    },
    {
      title: '指标名称',
      dataIndex: 'name',
      width: 190,
      editable: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 190,
      render: (_, record) => (
        <Select
          defaultValue={record.type}
          bordered={false}
          style={{ width: 120 }}
        >
          <Option value='benefit'>正向</Option>
          <Option value='cost'>负向</Option>
        </Select>
      ),
    },
    {
      title: '权重',
      dataIndex: 'weight',
      width: 190,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) =>
        state.dataSource.length >= 1 ? (
          <Popconfirm
            title='确认删除?'
            onConfirm={() => props.handleDelete(record.key)}
          >
            <Button type='primary'>删除</Button>
          </Popconfirm>
        ) : null,
    },
  ]
  const columns = column.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    }
  })

  //获取父组件中表格数据
  useEffect(() => {
    const { dataSource, count } = props.rows
    const newdataSource = [...dataSource]
    setState({ dataSource: newdataSource, count })
  }, [props.rows])

  const handleSave = (row) => {
    const newData = [...state.dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    props.handleSave(newData)
    // setState({
    //   dataSource: newData,
    // })
  }

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        scroll={{ y: 200 }}
      />
      <Button
        onClick={props.handleAdd}
        type='primary'
        shape='round'
        style={{
          marginBottom: 20,
          marginRight: 660,
        }}
      >
        添加指标
      </Button>
    </div>
  )
}

export default CriteriaTable
