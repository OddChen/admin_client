import React from 'react'
import * as echarts from 'echarts'

class PieCharts extends React.Component {
  setBarOption = () => {
    return {
      title: {
        text: '标题',
        subtext: '副标题',
        left: 'right',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }

  initOption = () => {
    var chartDom = document.getElementById(`${this.props.id}`)
    var myBarChart =
      echarts.getInstanceByDom(this.pieChart) || echarts.init(chartDom)
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
          this.pieChart = e
        }}
        id={this.props.id}
        style={
          this.props.size.width ? this.props.size : { width: 400, height: 400 }
        }
      ></div>
    )
  }
}

export default PieCharts
