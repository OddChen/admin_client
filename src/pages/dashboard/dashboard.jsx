import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import ShareDataset from './components/sharedataset'
import CustomBarTrend from './components/custombartrend'

const DashBoard = () => {
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
    <div ref={screenRef}>
      {isFullScreen ? (
        <Button type='text' onClick={exitFullScreen}>
          退出全屏
        </Button>
      ) : (
        <Button type='text' onClick={fullScreen}>
          全屏
        </Button>
      )}
      <ShareDataset />
      <CustomBarTrend />
    </div>
  )
}

export default DashBoard
