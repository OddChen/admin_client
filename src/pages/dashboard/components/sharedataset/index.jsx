import * as echarts from 'echarts'
import { useEffect } from 'react'
import './index.less'

const ShareDataset = (props) => {
  const { criteria, dataset, result } = props
  // console.log(criteria, dataset, result)

  const initOption = () => {
    var chartDom = document.getElementById('sharedataset')
    var myChart =
      echarts.getInstanceByDom(chartDom) || echarts.init(chartDom, 'dark')
    var option

    // x坐标设置,排名前五的城市
    let cityName = ['城市']
    for (let i = 0; i < 5; i++) {
      cityName.push(`${result[i].city}`)
    }
    // y轴设置
    let yData = []
    for (let i = 0; i < 8; i++) {
      let cname = criteria.dataSource[i].name
      yData.push([`${cname}`])
      dataset.map((curd) => yData[yData.length - 1].push(curd[cname]))
    }
    // console.log(yData)

    setTimeout(function () {
      option = {
        backgroundColor: '',
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: true,
          position: function (point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            var x = 0 // x坐标位置
            var y = 0 // y坐标位置

            var pointX = point[0]
            var pointY = point[1]

            // 提示框大小
            var boxWidth = size.contentSize[0]
            var boxHeight = size.contentSize[1]

            // boxWidth > pointX 说明鼠标左边放不下提示框
            if (boxWidth > pointX) {
              x = 5
            } else {
              // 左边放的下
              x = pointX - boxWidth
            }

            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (boxHeight > pointY) {
              y = 5
            } else {
              // 上边放得下
              y = pointY - boxHeight
            }
            return [x, y]
          },
        },
        dataset: {
          source: [
            cityName,
            ...yData,
            // ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4],
            // ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8],
            // ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2],
            // ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9],
          ],
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '30%', bottom: '10%', left: '13%' },
        series: [
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          {
            type: 'line',
            // smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' },
          },
          // {
          //   type: 'pie',
          //   id: 'pie',
          //   radius: '30%',
          //   center: ['50%', '35%'],
          //   emphasis: { focus: 'data' },
          //   label: {
          //     formatter: '{b}: {@2012} ({d}%)',
          //   },
          //   encode: {
          //     itemName: '城市',
          //     value: '2012',
          //     tooltip: '2012',
          //   },
          // },
        ],
      }

      // myChart.on('updateAxisPointer', function (event) {
      //   var xAxisInfo = event.axesInfo[0]
      //   if (xAxisInfo) {
      //     var dimension = xAxisInfo.value + 1
      //     myChart.setOption({
      //       series: {
      //         id: 'pie',
      //         label: {
      //           formatter: '{b}: {@[' + dimension + ']} ({d}%)',
      //         },
      //         encode: {
      //           value: dimension,
      //           tooltip: dimension,
      //         },
      //       },
      //     })
      //   }
      // })

      myChart.setOption(option)
    })

    option && myChart.setOption(option)
  }

  useEffect(() => {
    initOption()
  })

  return (
    <div className='border-container'>
      <div
        id='sharedataset'
        style={{
          width: 450,
          height: 400,
        }}
      ></div>
      <span className='top-left border-span'></span>
      <span className='top-right border-span'></span>
      <span className='bottom-left border-span'></span>
      <span className='bottom-right border-span'></span>
    </div>
  )
}

export default ShareDataset
