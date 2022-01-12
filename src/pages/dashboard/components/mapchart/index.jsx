import { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import './index.less'

const MapChart = (props) => {
  const [chartData, setChartData] = useState('')

  const region = JSON.parse(localStorage.getItem('user_key')).region
  const mapname = region.toString().substring(0, 3)
  const mapData = require(`../../../../assets/maps/${mapname}.json`)

  // const mouseEvents = (mapchart) => {
  //   mapchart.on('mouseover', () => {
  //     clearInterval()
  //   })
  // }

  // const mapActive = () => {
  //   const dataLength =
  // }
  useEffect(() => {
    let cityData = props.cityResult.map((item) => {
      return {
        [item.city]: item.score,
      }
    })
    setChartData(cityData)
    // console.log(option.series[0].data)
  }, [props.cityResult])

  useEffect(() => {
    echarts.registerMap(`${mapname}`, mapData)

    const chartDom = document.getElementById('mapchart')
    const mapchart = echarts.init(chartDom)
    // 鼠标滑入事件
    // mouseEvents(mapchart)
    // 轮播事件

    mapchart.setOption(option)
    window.addEventListener('resize', function () {
      mapchart.resize()
    })
  })

  const option = {
    tooltip: {
      // 窗口外框
      backgroundColor: 'rgba(0,0,0,0)',
      trigger: 'item',
    },
    // legend: { // 注释掉有文字
    // 	show: false,
    // },
    series: [
      {
        tooltip: {
          // 显示的窗口
          trigger: 'item',
          formatter: function (item) {
            const cityname = item.name.substring(0, item.name.length - 1)
            const cityobj = option.series[0].data.find(
              // eslint-disable-next-line eqeqeq
              (item) => Object.keys(item) == cityname
            )
            let score = cityobj[cityname]
            let tipHtml = ''
            tipHtml = `<div style="padding: .6rem .8rem;font-size: .325rem;color:#fff;border-radius:10%;background: linear-gradient(#cccecf, #cccecf) left top,
                linear-gradient(#cccecf, #cccecf) left top,
                linear-gradient(#cccecf, #cccecf) right top,
                linear-gradient(#cccecf, #cccecf) right top,
                linear-gradient(#cccecf, #cccecf) left bottom,
                linear-gradient(#cccecf, #cccecf) left bottom,
                linear-gradient(#cccecf, #cccecf) right bottom,
                linear-gradient(#cccecf, #cccecf) right bottom;
            background-repeat: no-repeat;
            background-size: .08rem .3rem, .3rem .08rem;background-color:rgba(6, 79, 111,.6);">${item.name}：<span style="color:#f9eb59;font-size:.4rem">${score}</span> </div>`
            return tipHtml
          },
          borderWidth: 0,
        },
        name: `${mapname}评价结果`,
        type: 'map',
        map: `${mapname}`, // 自定义扩展图表类型
        zoom: 0.65, // 缩放
        showLegendSymbol: true,
        label: {
          // 文字
          show: true,
          color: '#fff',
          fontSize: 10,
        },
        itemStyle: {
          // 地图样式
          borderColor: 'rgba(147, 235, 248, 1)',
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(147, 235, 248, .2)', // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
          shadowColor: 'rgba(128, 217, 248, 1)',
          // shadowColor: 'rgba(255, 255, 255, 1)',
          shadowOffsetX: -2,
          shadowOffsetY: 2,
          shadowBlur: 10,
        },
        emphasis: {
          // 鼠标移入动态的时候显示的默认样式
          itemStyle: {
            areaColor: '#4adcf0',
            borderColor: '#404a59',
            borderWidth: 1,
          },
          label: {
            // 文字
            show: true,
            color: '#fff',
            fontSize: 10,
          },
        },
        layoutCenter: ['50%', '50%'],
        layoutSize: '150%',
        markPoint: {
          symbol: 'none',
        },
        data: chartData,
      },
    ],
  }

  return (
    <div className='border-container'>
      <div id='mapchart' style={{ width: '100%', height: 300 }}></div>
      <span className='top-left border-span'></span>
      <span className='top-right border-span'></span>
      <span className='bottom-left border-span'></span>
      <span className='bottom-right border-span'></span>
    </div>
  )
}

export default MapChart
