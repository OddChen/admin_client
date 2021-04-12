import React, { useState } from 'react'
import './editor.less'
import EditorPage from './components/editor.page'
import { editorConfig } from './components/editor.config'

const Editor = () => {
  const [editorValue, setEditorValue] = useState({
    container: {
      height: 700,
      width: 1000,
    },
    blocks: [],
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
