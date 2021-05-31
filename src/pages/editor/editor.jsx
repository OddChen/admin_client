import React, { useState } from 'react'
import './editor.less'
import EditorPage from './components/editor.page'
import { editorConfig } from './components/editor.config'
import editorData from './editor-data.json'

const Editor = () => {
  const [editorValue, setEditorValue] = useState(editorData)
  return (
    <EditorPage
      config={editorConfig}
      value={editorValue}
      onChange={setEditorValue}
    />
  )
}
export default Editor
