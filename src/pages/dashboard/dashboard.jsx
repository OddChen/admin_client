import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import ShareDataset from './components/sharedataset/index.jsx'
import CustomBarTrend from './components/custombartrend/index.jsx'
import MapChart from './components/mapchart/index.jsx'
import ThreeMapChart from '../../components/map-chart/index.jsx'
import store from '../../utils/storageUtils'
import './dashboard.less'

const DashBoard = (props) => {
  const user = store.getUser().id
  const sessionData = sessionStorage.getItem(`${user}`)
  const cityData = JSON.parse(sessionData)
  if (
    !sessionData ||
    !cityData.criteria.count ||
    !cityData.dataset.length ||
    !cityData.result.length
  ) {
    props.history.push('/evaluation')
  }

  // 指标项，数据，结果
  const { criteria, dataset, result } = cityData
  // const [criteria, setCriteria] = useState({
  //   dataSource: [],
  //   count: 0,
  // })
  // const [dataset, setDataset] = useState([])
  // const [result, setResult] = useState([])

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

  // useEffect(() => {
  //   // console.log(props.location.dashboardData)
  //   if (
  //     !!props.location.dashboardData.criteria.count &&
  //     !!props.location.dashboardData.dataset.length
  //   ) {
  //     const { criteria, dataset, result } = props.location.dashboardData
  //     setCriteria(criteria)
  //     setDataset(dataset)
  //     setResult(result)
  //   } else {
  //     props.history.push('/evaluation')
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
          <ShareDataset criteria={criteria} dataset={dataset} result={result} />
        </div>
        <div className='middle'>
          <MapChart cityResult={result} />
        </div>
        <div className='right'>
          <CustomBarTrend
            criteria={criteria}
            dataset={dataset}
            result={result}
          />
        </div>
      </div>
      <div className='extends'>
        <ThreeMapChart criteria={criteria} dataset={dataset} result={result} />
      </div>
    </div>
  )
}

export default DashBoard
