import { useState } from 'react'
import { Button, Form, Input, Modal, Steps, Select, message } from 'antd'
import './evaluation.less'
import CriteriaTable from './component/criteriatable'
import DataTable from './component/datatable'
import { criteriaToDataColumns } from './component/criteriaToDataColumns'
import XLSX from 'xlsx'
import ResultTable from './component/resulttable'

const Evaluation = () => {
  //数据
  const [state, setState] = useState({
    criteria: {
      dataSource: [
        {
          key: '1',
          name: '公路通车里程',
          type: 'benefit',
          weight: '30%',
        },
      ],
      count: 1,
    },
    sum: 0,
    dataset: [],
    loading: false,
  })
  //当前步骤
  const [current, setCurrent] = useState(0)
  const { Step } = Steps

  /**
   * 指标权重表格操作
   */
  //添加行
  const handleAdd = () => {
    const { dataSource, count } = state.criteria
    let newcount = count + 1
    let newdataSource = dataSource
    newdataSource.push({
      key: `${newcount}`,
      name: '新增',
      type: 'benefit',
      weight: '%',
    })
    setState({
      ...state,
      criteria: { dataSource: newdataSource, count: newcount },
    })
  }
  //删除行
  const handleDelete = (key) => {
    const { dataSource, count } = state.criteria
    let newdataSource = dataSource.filter((item) => item.key !== key)
    let newcount = count - 1
    setState({
      ...state,
      criteria: {
        ...state.criteria,
        dataSource: newdataSource,
        count: newcount,
      },
    })
  }
  //修改
  const handleSave = (newData) => {
    setState({
      ...state,
      criteria: {
        ...state.criteria,
        dataSource: newData,
      },
    })
  }
  //导入文件
  const handleFile = (files) => {
    setState({ ...state, loading: true })
    const reader = new FileReader()
    const file = files.file.originFileObj
    //是否读取为二进制字符串
    const rABS = !!reader.readAsBinaryString
    if (rABS) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
    reader.onload = (e) => {
      const bstr = e.target.result
      //读取完成的数据
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws, { header: 0 })
      setState({ ...state, dataset: data.map(mapRows), loading: false })
      console.log(state.dataset)
    }
  }
  //
  const mapRows = (row, idx) => {
    let _row = { ...row }
    _row.name = _row['Name']
    console.log(row, _row.name)
    delete _row['Name']
    return {
      ..._row,
      city: _row.name,
      id: idx + state.dataset.length,
    }
  }

  const steps = [
    {
      title: '指标&权重',
      content: (
        <CriteriaTable
          rows={state.criteria}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
          handleSave={handleSave}
        />
      ),
    },
    {
      title: '城市数据',
      content: (
        <DataTable
          rows={state.dataset}
          columns={criteriaToDataColumns(
            state.criteria.dataSource,
            handleDelete
          )}
          handleFile={handleFile}
          loading={state.loading}
        />
      ),
    },
    {
      title: '评价结果',
      content: <ResultTable />,
    },
  ]

  //前进后退
  const next = () => {
    setCurrent(current + 1)
  }
  const prev = () => {
    setCurrent(current - 1)
  }

  return (
    <div className='evaluation'>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className='steps-content'>{steps[current].content}</div>
      <div className='steps-action'>
        {current < steps.length - 1 && (
          <Button type='primary' onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type='primary'
            onClick={() => message.success('Processing complete!')}
          >
            提交
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            上一步
          </Button>
        )}
      </div>
    </div>
  )
}

export default Evaluation
