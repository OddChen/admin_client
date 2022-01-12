import React from 'react'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/chart/pie')

class PieCharts extends React.Component {
  setBarOption = () => {
    return {
      backgroundColor: '#2c343c',
      title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: 'Direct' },
            { value: 310, name: 'Email' },
            { value: 274, name: 'Union Ads' },
            { value: 235, name: 'Video Ads' },
            { value: 400, name: 'Search Engine' },
          ].sort(function (a, b) {
            return a.value - b.value
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          },
        },
      ],
    }
  }

  initOption = () => {
    // echarts.use([
    //   TitleComponent,
    //   TooltipComponent,
    //   VisualMapComponent,
    //   PieChart,
    //   CanvasRenderer,
    //   LabelLayout,
    // ])
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
          this.props.size.width ? this.props.size : { width: 200, height: 200 }
        }
      ></div>
    )
  }
}

export default PieCharts
