import { useState } from 'react'
import { Button, Steps, message } from 'antd'
import './evaluation.less'
import CriteriaTable from './components/criteriatable'
import DataTable from './components/datatable'
import { criteriaToDataColumns } from './components/criteriaToDataColumns'
import XLSX from 'xlsx'
import ResultTable from './components/resulttable'
import Visualizatin from './components/visualization'
import store from '../../utils/storageUtils'
import { Link } from 'react-router-dom'

const Evaluation = () => {
  //数据
  const [state, setState] = useState({
    criteria: {
      dataSource: [],
      count: 0,
    },
    dataset: [],
    result: [],
    loading: false,
  })
  //当前步骤
  const [current, setCurrent] = useState(0)
  const { Step } = Steps

  /**
   * 指标权重表格操作
   */
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
      setState({
        ...state,
        criteria: { dataSource: data.map(mapRows), count: data.length },
      })
    }
  }
  const mapRows = (row) => {
    let _row = { ...row }
    return {
      key: _row['序号'],
      name: _row['指标'],
      type: _row['类型'],
      weight: parseFloat(_row['权重'] * 100).toFixed(4),
    }
  }
  //添加行
  const handleAdd = () => {
    const { dataSource, count } = state.criteria
    let newcount = count + 1
    let newdataSource = dataSource
    newdataSource.push({
      key: `${newcount}`,
      name: '指标名',
      type: 'benefit',
      weight: '0',
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

  /**
   * 数据表格操作
   */
  //导入文件
  const handleDataFile = (files) => {
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
      setState({ ...state, dataset: data.map(mapDataRows), loading: false })
    }
  }
  const mapDataRows = (row, idx) => {
    let _row = { ...row }
    _row.name = _row['城市']
    delete _row['城市']
    return {
      ..._row,
      city: _row.name,
      key: idx + state.dataset.length,
    }
  }
  //添加行
  const handleDataAdd = () => {
    const newdata = [...state.dataset]
    const len = newdata.length
    //需要添加的属性列
    const otherdata = []
    state.criteria.dataSource.map((column) =>
      otherdata.push({ [column.name]: '0' })
    )
    //新增数据
    newdata.push({
      key: `${len}`,
      city: '城市名',
    })
    //合并属性
    let curdata = otherdata.reduce((acc, obj) => {
      return Object.assign(acc, obj)
    }, newdata[len])
    newdata[len] = curdata
    setState({
      ...state,
      dataset: newdata,
    })
    // console.log(state.dataset)
  }
  //修改
  const handleDataSave = (newData) => {
    setState({
      ...state,
      dataset: newData,
    })
  }
  //删除行
  const handleDataDelete = (key) => {
    const curdata = [...state.dataset]
    let newdata = curdata.filter((item) => item.key !== key)
    setState({
      ...state,
      dataset: newdata,
    })
  }

  /**
   * 评价结果保存
   */
  const handleDataResult = (result) => {
    setState({
      ...state,
      result,
    })

    // 将当前数据存入sessionStorage中
    const user = store.getUser().id
    const sessionData = JSON.stringify(state)
    sessionStorage.setItem(`${user}`, sessionData)
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
          handleFile={handleFile}
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
            handleDataDelete
          )}
          handleAdd={handleDataAdd}
          handleFile={handleDataFile}
          handleSave={handleDataSave}
          loading={state.loading}
        />
      ),
    },
    {
      title: '评价结果',
      content: (
        <ResultTable
          criteria={state.criteria}
          dataset={state.dataset}
          result={state.result}
          handleResult={handleDataResult}
        />
      ),
    },
    // {
    //   title: '结果可视化',
    //   content: <Visualizatin />,
    // },
  ]

  //前进后退
  const next = () => {
    setCurrent(current + 1)
  }
  const prev = () => {
    setCurrent(current - 1)
  }

  const dashboard = {
    pathname: '/dashboard',
    dashboardData: state,
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
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            上一步
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type='primary' onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type='primary'>
            <Link to={dashboard}>可视化评价结果</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default Evaluation
