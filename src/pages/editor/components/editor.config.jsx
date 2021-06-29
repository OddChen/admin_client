import { createEditorConfig } from './editor.utils'
import LineExample from '../../../components/charts/lines'
import Bar3D from '../../../components/charts/bar3D'
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
  render: (randomid, size) => <LineExample id={randomid} size={size} />,
  //是否可以拖拽宽高
  resize: {
    height: true,
    width: true,
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
