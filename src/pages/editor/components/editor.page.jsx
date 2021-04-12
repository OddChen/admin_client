import React from 'react'

const EditorPage = (props) => {
  console.log(props)
  return (
    <div className='editor'>
      <div className='editor-menu'>menu</div>
      <div className='editor-content'>
        <div className='editor-content-head'>head</div>
        <div className='editor-content-body'>body</div>
      </div>
      <div className='editor-operator'>operator</div>
    </div>
  )
}
export default EditorPage
