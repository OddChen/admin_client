import React from 'react'
import * as echarts from 'echarts'

class Funnel extends React.Component {
  setFunnelOption = () => {
    return {
      title: {
        text: 'Funnel',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%',
      },
      toolbox: {
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      legend: {
        data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order'],
      },
      series: [
        {
          name: 'Funnel',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: [
            { value: 60, name: 'Visit' },
            { value: 40, name: 'Inquiry' },
            { value: 20, name: 'Order' },
            { value: 80, name: 'Click' },
            { value: 100, name: 'Show' },
          ],
        },
      ],
    }
  }

  initOption = () => {
    // echarts.use([GridComponent, BarChart, CanvasRenderer])
    var chartDom = document.getElementById(`${this.props.id}`)
    var myFunnelChart =
      echarts.getInstanceByDom(this.funnelChart) || echarts.init(chartDom)
    var option = this.setFunnelOption(this.props)
    option && myFunnelChart.setOption(option)
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
          this.funnelChart = e
        }}
        id={this.props.id}
        style={
          this.props.size.width ? this.props.size : { width: 500, height: 300 }
        }
      ></div>
    )
  }
}

export default Funnel
