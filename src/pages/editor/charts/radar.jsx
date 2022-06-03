import React from 'react'
import * as echarts from 'echarts'

class Radar extends React.Component {
  setRadarOption = () => {
    return {
      title: {
        text: '标题',
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending'],
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: 'Sales', max: 6500 },
          { name: 'Administration', max: 16000 },
          { name: 'Information Technology', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 },
        ],
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget',
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending',
            },
          ],
        },
      ],
    }
  }

  initOption = () => {
    // echarts.use([GridComponent, BarChart, CanvasRenderer])
    var chartDom = document.getElementById(`${this.props.id}`)
    var myRadarChart =
      echarts.getInstanceByDom(this.radarChart) || echarts.init(chartDom)
    var option = this.setRadarOption(this.props)
    option && myRadarChart.setOption(option)
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
          this.radarChart = e
        }}
        id={this.props.id}
        style={
          this.props.size.width ? this.props.size : { width: 200, height: 200 }
        }
      ></div>
    )
  }
}

export default Radar
