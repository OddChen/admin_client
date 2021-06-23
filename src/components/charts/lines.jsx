import React from 'react'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

class LineExample extends React.Component {
  componentDidMount() {
    echarts.use([GridComponent, LineChart, CanvasRenderer])
    var chartDom = document.getElementById(`${this.props.id}`)
    var myLineChart = echarts.init(chartDom)
    var option

    option = {
      xAxis: {
        type: 'category',
        data: ['一', '二', '三'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224],
          type: 'line',
        },
      ],
    }
    option && myLineChart.setOption(option)
  }

  render() {
    return (
      <div>
        <div id={this.props.id} style={this.props.size}></div>
      </div>
    )
  }
}

export default LineExample
