import * as echarts from 'echarts'
import { useEffect } from 'react'
import './index.less'

const CustomBarTrend = (props) => {
  const { criteria, dataset, result } = props
  const { count, dataSource } = criteria

  const initOption = () => {
    var chartDom = document.getElementById('custombartrend')
    var myChart = echarts.init(chartDom, 'dark')
    var option

    // var yearCount = 7
    // var categoryCount = 30

    // 指标
    var xAxisData = []

    var customData = []
    // 城市
    var legendData = []
    // 城市数据
    var dataList = []

    // 折线图
    legendData.push('趋势')

    // 传入数据项
    dataset.map((cur) => {
      return legendData.push(cur.city)
    })
    var encodeY = []
    const cityCount = dataset.length

    for (let i = 0; i < cityCount; i++) {
      legendData.push(dataset[i].city)
      dataList.push([])
      encodeY.push(1 + i)
    }

    for (let i = 0; i < count; i++) {
      // 指标名
      const criName = dataSource[i].name

      // xAxisData.push('category' + i)
      xAxisData.push(criName)

      // 趋势数据
      var customVal = [i]
      customData.push(customVal)

      for (var j = 0; j < dataList.length; j++) {
        // 当前指标下的城市数据
        const curcityData = dataset[j][`${criName}`]
        // var value =
        //   j === 0
        //     ? echarts.number.round(val, 2)
        //     : echarts.number.round(
        //         Math.max(0, dataList[j - 1][i] + (Math.random() - 0.5) * 200),
        //         2
        //       )
        dataList[j].push(curcityData)
        customVal.push(curcityData)
      }
    }

    function renderItem(params, api) {
      var xValue = api.value(0)
      var currentSeriesIndices = api.currentSeriesIndices()
      var barLayout = api.barLayout({
        barGap: '30%',
        barCategoryGap: '20%',
        count: currentSeriesIndices.length - 1,
      })

      var points = []
      for (var i = 0; i < currentSeriesIndices.length; i++) {
        var seriesIndex = currentSeriesIndices[i]
        if (seriesIndex !== params.seriesIndex) {
          var point = api.coord([xValue, api.value(seriesIndex)])
          point[0] += barLayout[i - 1].offsetCenter
          point[1] -= 20
          points.push(point)
        }
      }
      var style = api.style({
        stroke: api.visual('color'),
        fill: null,
      })

      return {
        type: 'polyline',
        shape: {
          points: points,
        },
        style: style,
      }
    }

    option = {
      backgroundColor: '',
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: legendData,
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 7,
        },
        {
          type: 'inside',
          start: 0,
          end: 7,
        },
      ],
      xAxis: {
        data: xAxisData,
      },
      yAxis: {},
      grid: { top: '20%', bottom: '15%', left: '13%' },
      series: [
        {
          type: 'custom',
          name: '趋势',
          renderItem: renderItem,
          itemStyle: {
            borderWidth: 2,
          },
          encode: {
            x: 0,
            y: encodeY,
          },
          data: customData,
          z: 100,
        },
      ].concat(
        dataList.map(function (data, index) {
          return {
            type: 'bar',
            animation: false,
            name: legendData[index + 1],
            // itemStyle: {
            //   opacity: 0.5,
            // },
            data: data,
          }
        })
      ),
    }

    option && myChart.setOption(option)
  }

  useEffect(() => {
    initOption()
  })

  return (
    <div className='border-container'>
      <div
        id='custombartrend'
        style={{
          width: 450,
          height: 400,
          // background: 'rgba(255, 255, 255, .08)',
        }}
      ></div>
      <span className='top-left border-span'></span>
      <span className='top-right border-span'></span>
      <span className='bottom-left border-span'></span>
      <span className='bottom-right border-span'></span>
    </div>
  )
}

export default CustomBarTrend
