import React from 'react'
import * as echarts from 'echarts'

class Nightingale extends React.Component {
  setNightingaleOption = () => {
    return {
      legend: {
        top: 'bottom',
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [50, 150],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8,
          },
          data: [
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 28, name: 'rose 5' },
            { value: 26, name: 'rose 6' },
            { value: 22, name: 'rose 7' },
            { value: 18, name: 'rose 8' },
          ],
        },
      ],
    }
  }

  initOption = () => {
    // echarts.use([GridComponent, BarChart, CanvasRenderer])
    var chartDom = document.getElementById(`${this.props.id}`)
    var myNightingaleChart =
      echarts.getInstanceByDom(this.nightingaleChart) || echarts.init(chartDom)
    var option = this.setNightingaleOption(this.props)
    option && myNightingaleChart.setOption(option)
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
          this.nightingaleChart = e
        }}
        id={this.props.id}
        style={
          this.props.size.width ? this.props.size : { width: 400, height: 400 }
        }
      ></div>
    )
  }
}

export default Nightingale
