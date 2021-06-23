export const EditorResizeDirector = {
  start: 'start',
  center: 'center',
  end: 'end',
}

export const EditorResize = (props) => {
  // console.log(props)
  const render = []
  if (props.component.resize.height) {
    render.push(
      <div
        className='editor-block-resize editor-block-resize-top'
        key='top'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.center,
              vertical: EditorResizeDirector.start,
            },
            props.block
          )
        }
      />
    )
    render.push(
      <div
        className='editor-block-resize editor-block-resize-bottom'
        key='bottom'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.center,
              vertical: EditorResizeDirector.end,
            },
            props.block
          )
        }
      />
    )
  }
  if (props.component.resize.width) {
    render.push(
      <div
        className='editor-block-resize editor-block-resize-left'
        key='left'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.start,
              vertical: EditorResizeDirector.center,
            },
            props.block
          )
        }
      />
    )
    render.push(
      <div
        className='editor-block-resize editor-block-resize-right'
        key='right'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.end,
              vertical: EditorResizeDirector.center,
            },
            props.block
          )
        }
      />
    )
  }
  if (props.component.resize.height && props.component.resize.width) {
    render.push(
      <div
        className='editor-block-resize editor-block-resize-top-left'
        key='top-left'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.start,
              vertical: EditorResizeDirector.start,
            },
            props.block
          )
        }
      />
    )
    render.push(
      <div
        className='editor-block-resize editor-block-resize-top-right'
        key='top-right'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.end,
              vertical: EditorResizeDirector.start,
            },
            props.block
          )
        }
      />
    )
    render.push(
      <div
        className='editor-block-resize editor-block-resize-bottom-left'
        key='bottom-left'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.start,
              vertical: EditorResizeDirector.end,
            },
            props.block
          )
        }
      />
    )
    render.push(
      <div
        className='editor-block-resize editor-block-resize-bottom-right'
        key='bottom-right'
        onMouseDown={(e) =>
          props.onMouseDown(
            e,
            {
              horizontal: EditorResizeDirector.end,
              vertical: EditorResizeDirector.end,
            },
            props.block
          )
        }
      />
    )
  }

  return <div>{render}</div>
}
