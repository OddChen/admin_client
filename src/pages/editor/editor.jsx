import React, { useState } from 'react'
import './editor.less'
import EditorPage from './components/editor.page'
import { editorConfig } from './components/editor.config'

const Editor = () => {
  const [editorValue, setEditorValue] = useState(() => {
    const val = {
      container: {
        height: 400,
        width: 600,
      },
      blocks: [
        {
          componentKey: 'bingtu',
          top: 100,
          left: 100,
          adjustPosition: false,
        },
        // {
        //   componentKey: 'linechart',
        //   top: 200,
        //   left: 200,
        // },
      ],
    }
    return val
  })
  return (
    <EditorPage
      config={editorConfig}
      value={editorValue}
      onChange={setEditorValue}
    />
  )
}
export default Editor
