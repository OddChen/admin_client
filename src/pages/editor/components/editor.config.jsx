import { createEditorConfig } from './editor.utils'
import lineExample from '../../../components/charts/lines'

export const editorConfig = createEditorConfig()

editorConfig.registryComponent('bingtu', {
  name: 'test',
  preview: () => <span>test</span>,
  render: () => <span>test</span>,
})

editorConfig.registryComponent('linechart', {
  name: '折线图',
  preview: () => <lineExample />,
  render: () => <lineExample />,
})
