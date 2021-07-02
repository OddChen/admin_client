import React from 'react'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

class LineExample extends React.Component {
  setLineOption = (props) => {
    let blockprops = props.blockprops
    let x_data = blockprops.xAxis_data?.split('，')
    let series_data = blockprops.series_data?.split('，')
    return {
      xAxis: {
        name: blockprops.xAxis_name || '',
        position: blockprops.xAxis_position || 'bottom',
        type: 'category',
        data: x_data || ['一', '二', '三'],
      },
      yAxis: {
        name: blockprops.yAxis_name || '',
        type: 'value',
      },
      series: [
        {
          data: series_data || [150, 230, 224],
          type: 'line',
          smooth: !!blockprops.series_smooth || false,
        },
      ],
    }
  }

  initOption = () => {
    echarts.use([GridComponent, LineChart, CanvasRenderer])
    var chartDom = document.getElementById(`${this.props.id}`)
    var myLineChart =
      echarts.getInstanceByDom(this.lineChart) || echarts.init(chartDom)
    var option = this.setLineOption(this.props)
    option && myLineChart.setOption(option)
  }

  componentDidMount() {
    this.initOption()
  }

  componentDidUpdate() {
    this.initOption()
  }

  render() {
    return (
      <div
        ref={(e) => {
          this.lineChart = e
        }}
        id={this.props.id}
        style={
          this.props.size.width ? this.props.size : { width: 200, height: 200 }
        }
      ></div>
    )
  }
}

export default LineExample
