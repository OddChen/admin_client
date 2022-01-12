import { createEditorConfig } from './editor.utils'
import LineExample from '../charts/lines'
import Bar3D from '../charts/bar3D'
import BarCharts from '../charts/bar'
import PieCharts from '../charts/pie'
import {
  createColorProp,
  createSelectProp,
  createTextProp,
} from './editor.props'

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
  preview: () => <span>折线图</span>,
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

editorConfig.registryComponent('bar3d', {
  name: '3D柱状图',
  preview: () => <span>3D柱状图</span>,
  render: (randomid, size) => <Bar3D id={randomid} size={size} />,
  resize: {
    height: true,
    width: true,
  },
})

editorConfig.registryComponent('barchart', {
  name: '柱状图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <span>柱状图</span>,
  render: (randomid, size, blockprops) => (
    <BarCharts id={randomid} size={size} blockprops={blockprops} />
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
  preview: () => <span>饼图</span>,
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
