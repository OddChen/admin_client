import React from 'react'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

class LineExample extends React.Component {
  componentDidMount() {
    echarts.use([GridComponent, LineChart, CanvasRenderer])

    var chartDom = document.getElementById('linechart')
    var myChart = echarts.init(chartDom)
    var option

    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    }

    option && myChart.setOption(option)
  }
  render() {
    return (
      <div>
        <div id='linechart' style={{ height: '300px', width: '300px' }}></div>
      </div>
    )
  }
}

export default LineExample
