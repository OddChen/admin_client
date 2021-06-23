import { createEditorConfig } from './editor.utils'
import LineExample from '../../../components/charts/lines'
import Bar3D from '../../../components/charts/bar3D'

export const editorConfig = createEditorConfig()

editorConfig.registryComponent('bingtu', {
  name: '文本',
  preview: () => <span>文字描述</span>,
  //size:{height, width}
  render: (randomid, size) => (
    <p id={randomid} style={size}>
      test
    </p>
  ),
  resize: {
    height: false,
    width: true,
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
