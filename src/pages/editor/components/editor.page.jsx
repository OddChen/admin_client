import React, { useRef, useMemo } from 'react'
import { createEditorBlock } from './editor.utils'
import { EditorBlock } from './editorblock'

const EditorPage = (props) => {
  // container dom对象引用
  // 这里是渲染完后才获取，因此一直有值
  const containerRef = useRef({})
  //container对象样式
  const containerStyles = useMemo(() => {
    return {
      height: `${props.value.container.height}px`,
      width: `${props.value.container.width}px`,
    }
  }, [props.value.container.height, props.value.container.width])

  const dragData = useRef({
    dragComponent: null,
  })
  //拖拽处理逻辑
  const menuDraggier = (() => {
    // 左边的拖拽
    const block = {
      dragstart: (e, dragComponent) => {
        containerRef.current.addEventListener('dragenter', container.dragenter)
        containerRef.current.addEventListener('dragover', container.dragover)
        containerRef.current.addEventListener('dragleave', container.dragleave)
        containerRef.current.addEventListener('drop', container.drop)
        dragData.current.dragComponent = dragComponent
      },
      dragend: (e) => {
        containerRef.current.removeEventListener(
          'dragenter',
          container.dragenter
        )
        containerRef.current.removeEventListener('dragover', container.dragover)
        containerRef.current.removeEventListener(
          'dragleave',
          container.dragleave
        )
        containerRef.current.removeEventListener('drop', container.drop)
      },
    }
    // 监听拖拽到容器部分
    const container = {
      dragenter: (e) => {
        e.dataTransfer.dropEffect = 'move'
      },
      dragover: (e) => {
        e.preventDefault()
      },
      dragleave: (e) => {
        e.dataTransfer.dropEffect = 'move'
      },
      drop: (e) => {
        // console.log(dragData.current, e.offsetX, e.offsetY)
        props.onChange({
          ...props.value,
          blocks: [
            ...props.value.blocks,
            createEditorBlock({
              top: e.offsetY,
              left: e.offsetX,
              component: dragData.current.dragComponent,
            }),
          ],
        })
      },
    }

    return block
  })()

  //处理block元素的选中事件
  const focusHandler = (() => {
    //点击block元素的动作
    const mousedownBlock = (e) => {
      console.log('222')
    }
    //点击容器
    const mousedownContainer = (e) => {
      //排除点击到block元素
      if (e.target !== e.currentTarget) {
        return
      }
      console.log('点击了container')
    }
    return {
      block: mousedownBlock,
      container: mousedownContainer,
    }
  })()

  return (
    <div className='editor'>
      <div className='editor-menu'>
        {props.config.componentArray.map((component, index) => (
          <div
            className='editor-menu-item'
            key={index}
            draggable
            onDragStart={(e) => menuDraggier.dragstart(e, component)}
            onDragEnd={menuDraggier.dragend}
          >
            {component.preview()}
            <div className='editor-menu-item-name'>{component.name}</div>
          </div>
        ))}
      </div>
      <div className='editor-content'>
        <div className='editor-content-head'>head</div>
        <div className='editor-content-body'>
          <div
            className='editor-container'
            style={containerStyles}
            ref={containerRef}
            onMouseDown={focusHandler.container}
          >
            {props.value.blocks.map((block, index) => (
              <EditorBlock
                key={index}
                block={block}
                config={props.config}
                onMouseDown={focusHandler.block}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='editor-operator'>operator</div>
    </div>
  )
}
export default EditorPage
