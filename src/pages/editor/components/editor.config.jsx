import { createEditorConfig } from './editor.utils'
import LineExample from '../../../components/charts/lines'

export const editorConfig = createEditorConfig()

editorConfig.registryComponent('bingtu', {
  name: 'test',
  preview: () => <span>测试内容</span>,
  render: (randomid) => <span id={randomid}>test</span>,
})

editorConfig.registryComponent('linechart', {
  name: '折线图',
  preview: () => <LineExample id='linepre' />,
  render: (randomid) => <LineExample id={randomid} />,
})
