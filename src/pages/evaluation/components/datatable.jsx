import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Input, Button, Form, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

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

const DataTable = (props) => {
  const column = props.columns
  //rows: dataset
  const state = props.rows

  //保存修改
  const handleSave = (row) => {
    const newData = [...state]
    const index = newData.findIndex((item) => row.id === item.id)
    // const item = newData[index]
    // console.log(row, index, item)
    newData.splice(index, 1, row)
    props.handleSave(newData)
  }
  //Upload文件
  const fileprops = {
    name: 'file',
    onChange: props.handleFile,
    accept: '.xlsx, .xls',
    progress: {
      strokeColor: { '0%': '#108ee9', '100%': '#87d068' },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  //列名
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

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={state}
        columns={columns}
        scroll={{ x: 700, y: 200 }}
      />
      <div className='data-btn'>
        <Button
          onClick={props.handleAdd}
          type='primary'
          shape='round'
          style={{ marginRight: 15 }}
        >
          添加数据
        </Button>
        <Upload {...fileprops}>
          <Button icon={<UploadOutlined />} shape='round'>
            上传
          </Button>
        </Upload>
      </div>
    </div>
  )
}

export default DataTable
