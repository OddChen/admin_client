import React, { useState } from 'react'
import './editor.less'
import EditorPage from './components/editor.page'
import { editorConfig } from './components/editor.config'

const Editor = () => {
  const [editorValue, setEditorValue] = useState(() => {
    const val = {
      container: {
        height: 500,
        width: 700,
      },
      blocks: [
        {
          componentKey: 'linechart',
          top: 100,
          left: 100,
          adjustPosition: false,
          focus: false,
          zIndex: 0,
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
