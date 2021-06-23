export const EditorOperator = (props) => {
  return (
    <div className='editor-operator'>
      {!!props.selectBlock ? '编辑元素' : '编辑模块'}
    </div>
  )
}
