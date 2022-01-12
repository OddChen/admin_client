import React from 'react'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/grid')
require('echarts/lib/chart/bar')

class BarCharts extends React.Component {
  setBarOption = () => {
    return {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
        },
      ],
    }
  }

  initOption = () => {
    // echarts.use([GridComponent, BarChart, CanvasRenderer])
    var chartDom = document.getElementById(`${this.props.id}`)
    var myBarChart =
      echarts.getInstanceByDom(this.barChart) || echarts.init(chartDom)
    var option = this.setBarOption(this.props)
    option && myBarChart.setOption(option)
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
          this.barChart = e
        }}
        id={this.props.id}
        style={
          this.props.size.width ? this.props.size : { width: 200, height: 200 }
        }
      ></div>
    )
  }
}

export default BarCharts
