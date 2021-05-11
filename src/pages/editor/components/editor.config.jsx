import { createEditorConfig } from './editor.utils'
import LineExample from '../../../components/charts/lines'
import Bar3D from '../../../components/charts/bar3D'

export const editorConfig = createEditorConfig()

editorConfig.registryComponent('bingtu', {
  name: 'test',
  preview: () => <span>测试内容</span>,
  render: (randomid) => <span id={randomid}>test</span>,
})

editorConfig.registryComponent('linechart', {
  name: '折线图',
  // preview: () => <LineExample id='linepre' />,
  //换成图片
  preview: () => <span>折线图</span>,
  render: (randomid) => <LineExample id={randomid} />,
})

editorConfig.registryComponent('bar3d', {
  name: '3D柱状图',
  preview: () => <span>3D柱状图</span>,
  render: (randomid) => <Bar3D id={randomid} />,
})
