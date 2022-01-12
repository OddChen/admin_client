import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import ShareDataset from './components/sharedataset/index.jsx'
import CustomBarTrend from './components/custombartrend/index.jsx'
import './dashboard.less'
import MapChart from './components/mapchart/index.jsx'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

const DashBoard = (props) => {
  // 指标项，数据，结果
  // const { criteria, dataset, result } = props.location.dashboardData
  const [criteria, setCriteria] = useState({
    dataSource: [],
    count: 0,
  })
  const [dataset, setDataset] = useState([])
  const [result, setResult] = useState([])

  const [isFullScreen, setIsFullScreen] = useState(false)
  const screenRef = useRef()

  useEffect(() => {
    window.onresize = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true)
      } else {
        setIsFullScreen(false)
      }
    }
  })

  useEffect(() => {
    // console.log(props.location.dashboardData)
    if (!!props.location.dashboardData.criteria.count) {
      const { criteria, dataset, result } = props.location.dashboardData
      setCriteria(criteria)
      setDataset(dataset)
      setResult(result)
    } else {
      props.history.push('/evaluation')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //全屏
  const fullScreen = () => {
    if (!isFullScreen) {
      screenRef.current.requestFullscreen()
    }
  }
  // 退出全屏
  const exitFullScreen = () => {
    document.exitFullscreen()
  }

  return (
    <div ref={screenRef} className='dashboard'>
      {isFullScreen ? (
        <Button className='screenbtn' type='text' onClick={exitFullScreen}>
          退出全屏
        </Button>
      ) : (
        <Button className='screenbtn' type='text' onClick={fullScreen}>
          全屏
        </Button>
      )}
      <div className='header'>评价结果可视化展示</div>
      <div className='main'>
        <div className='left'>
          <ShareDataset />
        </div>
        <div className='middle'>
          <MapChart cityResult={result} />
        </div>
        <div className='right'>
          <CustomBarTrend />
        </div>
      </div>
    </div>
  )
}

export default DashBoard
