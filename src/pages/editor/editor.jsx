import React, { useEffect, useState } from 'react'
import './editor.less'
import EditorPage from './components/editor.page'
import { editorConfig } from './components/editor.config'
import editorData from './editor-data.json'

const Editor = (props) => {
  const [editorValue, setEditorValue] = useState(editorData)

  useEffect(() => {
    const { id, ispublic, user_id, description, name, container, blocks } =
      props.location.editorData
    let editorData = {
      id: id,
      ispublic: ispublic,
      user_id: user_id,
      description: description,
      name: name,
      container: JSON.parse(container),
      blocks: JSON.parse(blocks),
    }

    setEditorValue(editorData)
  }, [props.location.editorData])

  return (
    <EditorPage
      config={editorConfig}
      value={editorValue}
      onChange={setEditorValue}
    />
  )
}
export default Editor
