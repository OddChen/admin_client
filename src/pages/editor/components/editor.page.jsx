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

  //统计所有被选中的block元素
  const focusData = useMemo(() => {
    const focus = []
    const unfocus = []
    props.value.blocks.forEach((block) =>
      (block.focus ? focus : unfocus).push(block)
    )
    return {
      focus,
      unfocus,
    }
  }, [props.value.blocks])

  //对外暴露的方法
  const methods = {
    // 更新blocks，重新渲染
    updateBlocks: (blocks) => {
      props.onChange({
        ...props.value,
        blocks: [...blocks],
      })
    },
    //清空选中的元素
    clearFocus: (external) =>
      (!!external
        ? focusData.focus.filter((item) => item !== external)
        : focusData.focus
      ).forEach((block) => {
        block.focus = false
      }, methods.updateBlocks(props.value.blocks)),
  }

  //处理block元素的选中事件
  const focusHandler = (() => {
    //点击block元素的动作
    const block = (e, block) => {
      //按住shift键后的效果，实现多选
      if (e.shiftKey) {
        if (focusData.focus.length <= 1) {
          block.focus = true
        } else {
          block.focus = !block.focus
        }
        methods.updateBlocks(props.value.blocks)
      } else {
        if (!block.focus) {
          block.focus = true
          methods.clearFocus(block)
        }
      }
      blockDraggier.mousedown(e)
    }
    //点击容器
    const container = (e) => {
      //排除点击到block元素
      if (e.target !== e.currentTarget) {
        return
      }
      if (!e.shiftKey) {
        methods.clearFocus()
      }
    }
    return {
      block,
      container,
    }
  })()

  //拖拽所有被选中的block
  const blockDragData = useRef({
    startX: 0,
    startY: 0,
    startPosArray: [],
  })
  const blockDraggier = (() => {
    const mousedown = (e) => {
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
      //当前鼠标位置以及所有被选中元素的位置
      blockDragData.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosArray: focusData.focus.map(({ top, left }) => ({ top, left })),
      }
    }
    const mousemove = (e) => {
      const { startX, startY, startPosArray } = blockDragData.current
      const { clientX: moveX, clientY: moveY } = e
      const durX = moveX - startX
      const durY = moveY - startY
      focusData.focus.forEach((block, index) => {
        const { top, left } = startPosArray[index]
        block.top = top + durY
        block.left = left + durX
      })
      methods.updateBlocks(props.value.blocks)
    }
    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }
    return { mousedown }
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
                onMouseDown={(e) => focusHandler.block(e, block)}
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
