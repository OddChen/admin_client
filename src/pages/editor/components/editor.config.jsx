import { createEditorConfig } from './editor.utils'
import {
  createColorProp,
  createSelectProp,
  createTextProp,
} from './editor.props'
import LineExample from '../charts/lines'
import Bar3D from '../charts/bar3D'
import BarCharts from '../charts/bar'
import PieCharts from '../charts/pie'
import BarLabel from '../charts/barlabel'
import Bubble from '../charts/bubble'
import Funnel from '../charts/funnel'
import Nightingale from '../charts/nightingale'
import Radar from '../charts/radar'
import Scatter from '../charts/scatter'
import ThreeMapChart from '../../../components/map-chart/index'

import line from '../../../assets/images/charts/line-simple.webp'
import barlabel from '../../../assets/images/charts/bar-label-rotation.webp'
import bar from '../../../assets/images/charts/bar-simple.webp'
import bar3d from '../../../assets/images/charts/bar3d-punch-card.webp'
import bubble from '../../../assets/images/charts/bubble-gradient.webp'
import funnel from '../../../assets/images/charts/funnel.webp'
import pie from '../../../assets/images/charts/pie-simple.webp'
import pierose from '../../../assets/images/charts/pie-roseType-simple.webp'
import radar from '../../../assets/images/charts/radar.webp'
import scatter from '../../../assets/images/charts/scatter-simple.webp'

export const editorConfig = createEditorConfig()

editorConfig.registryComponent('text', {
  name: '文本',
  preview: () => <span>文字描述</span>,
  //size:{height, width}
  render: (randomid, size, blockprops) => (
    <span
      id={randomid}
      style={{
        color: !blockprops.color ? '' : blockprops.color.hex,
        fontSize: blockprops.fontsize,
      }}
    >
      {blockprops.text || '渲染文本'}
    </span>
  ),
  // resize: {
  //   height: false,
  //   width: true,
  // },
  blockprops: {
    text: createTextProp('显示文本'),
    color: createColorProp('字体颜色'),
    fontsize: createSelectProp('字体大小', [
      { label: '14px', value: '14px' },
      { label: '18px', value: '18px' },
      { label: '24px', value: '24px' },
    ]),
  },
})

editorConfig.registryComponent('linechart', {
  name: '折线图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={line} alt='折线图'></img>,
  render: (randomid, size, blockprops) => (
    <LineExample id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {
    xAxis_name: createTextProp('x轴名称'),
    xAxis_position: createSelectProp('x轴位置', [
      { label: '顶部', value: 'top' },
      { label: '底部', value: 'bottom' },
    ]),
    xAxis_data: createTextProp('x轴数据'),
    yAxis_name: createTextProp('y轴名称'),
    series_data: createTextProp('y轴数据'),
    series_smooth: createSelectProp('平滑曲线', [
      { label: '是', value: 'true' },
      { label: '否', value: 'false' },
    ]),
  },
})

editorConfig.registryComponent('barchart', {
  name: '柱状图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={bar} alt='柱状图'></img>,
  render: (randomid, size, blockprops) => (
    <BarCharts id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {
    xAxis_data: createTextProp('x轴数据'),
    series_data: createTextProp('y轴数据'),
  },
})

editorConfig.registryComponent('bar3d', {
  name: '3D柱状图',
  preview: () => <img src={bar3d} alt='3D柱状图'></img>,
  render: (randomid, size) => <Bar3D id={randomid} size={size} />,
  resize: {
    height: true,
    width: true,
  },
})

editorConfig.registryComponent('barlabel', {
  name: '柱状图标签旋转',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={barlabel} alt='柱状图标签旋转'></img>,
  render: (randomid, size, blockprops) => (
    <BarLabel id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {},
})

editorConfig.registryComponent('piechart', {
  name: '饼图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={pie} alt='饼图'></img>,
  render: (randomid, size, blockprops) => (
    <PieCharts id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {},
})

editorConfig.registryComponent('nightingale', {
  name: '南丁格尔图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={pierose} alt='南丁格尔图'></img>,
  render: (randomid, size, blockprops) => (
    <Nightingale id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {
    data_value: createTextProp('数据值'),
    data_name: createTextProp('数据名称'),
    borderradius: createSelectProp('圆滑程度', [
      { label: '低', value: 0 },
      { label: '中', value: 8 },
      { label: '高', value: 20 },
    ]),
    legend_position: createSelectProp('类别条目位置', [
      { label: '顶部', value: 'top' },
      { label: '底部', value: 'bottom' },
    ]),
    show_tool: createSelectProp('是否显示拓展工具', [
      { label: '是', value: 'true' },
      { label: '否', value: 'false' },
    ]),
  },
})

editorConfig.registryComponent('bubble', {
  name: '气泡图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={bubble} alt='气泡图'></img>,
  render: (randomid, size, blockprops) => (
    <Bubble id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {
    title_text: createTextProp('标题'),
    x_data: createTextProp('x轴坐标'),
    y_data: createTextProp('y轴坐标'),
    size: createTextProp('数据大小'),
    name: createTextProp('数据项名称'),
    type: createTextProp('所属类别'),
  },
})

editorConfig.registryComponent('funnel', {
  name: '漏斗图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={funnel} alt='漏斗图'></img>,
  render: (randomid, size, blockprops) => (
    <Funnel id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {
    title_text: createTextProp('标题'),
    type: createTextProp('数据类别'),
    data_value: createTextProp('数据值'),
    data_name: createTextProp('数据名称'),
  },
})

editorConfig.registryComponent('radar', {
  name: '雷达图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={radar} alt='雷达图'></img>,
  render: (randomid, size, blockprops) => (
    <Radar id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {},
})

editorConfig.registryComponent('scatter', {
  name: '散点图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <img src={scatter} alt='散点图'></img>,
  render: (randomid, size, blockprops) => (
    <Scatter id={randomid} size={size} blockprops={blockprops} />
  ),
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
  },
  blockprops: {},
})

// editorConfig.registryComponent('threemap', {
//   name: '三维填充图',
//   //换成图片
//   preview: () => <span>三维填充图</span>,
//   render: (randomid, size, blockprops) => (
//     <ThreeMapChart id={randomid} size={size} results={blockprops} />
//   ),
//   //是否可以拖拽宽高
//   resize: {
//     height: true,
//     width: true,
//   },
//   blockprops: {},
// })
