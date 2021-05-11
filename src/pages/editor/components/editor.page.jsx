import React, { useRef, useMemo, useState } from 'react'
import { createEditorBlock } from './editor.utils'
import { EditorBlock } from './editorblock'
import '../iconfont/iconfont.css'
import { useEidtorCommand } from './editor.commander'
import { createEvent } from '../plugins/event'
import { CallBackRef } from '../hooks/CallbackRef'
import { Route, withRouter } from 'react-router'

const EditorPage = (props) => {
  //当前的预览状态
  const [preview, setPreview] = useState(false)
  //当前的编辑状态
  const [editing, setEditing] = useState(false)
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

  const classes = useMemo(
    () => ['editor', preview ? 'editor-preview' : null].join(' '),
    [preview]
  )

  const dragData = useRef({
    dragComponent: null,
  })
  //拖拽处理逻辑
  const menuDraggier = (() => {
    // 左边的拖拽
    const block = {
      dragstart: CallBackRef((e, dragComponent) => {
        containerRef.current.addEventListener('dragenter', container.dragenter)
        containerRef.current.addEventListener('dragover', container.dragover)
        containerRef.current.addEventListener('dragleave', container.dragleave)
        containerRef.current.addEventListener('drop', container.drop)
        dragData.current.dragComponent = dragComponent
        dragstart.emit()
      }),
      dragend: CallBackRef((e) => {
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
      }),
    }
    // 监听拖拽到容器部分
    const container = {
      dragenter: CallBackRef((e) => (e.dataTransfer.dropEffect = 'move')),
      dragover: CallBackRef((e) => e.preventDefault()),
      dragleave: CallBackRef((e) => (e.dataTransfer.dropEffect = 'none')),
      drop: CallBackRef((e) => {
        const { offsetX, offsetY } = e
        const blocks = [...props.value.blocks]
        blocks.push(
          createEditorBlock({
            top: offsetY,
            left: offsetX,
            component: dragData.current.dragComponent,
          })
        )
        props.onChange({
          ...props.value,
          blocks,
        })
        // console.log(dragData.current, e.offsetX, e.offsetY)
        setTimeout(() => dragend.emit())
      }),
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

  //对外暴露的方法，重新渲染和清除未选项边框
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
      if (preview) {
        return
      }
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
      if (preview) {
        return
      }
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
    //是否处于拖拽状态
    dragging: false,
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
        dragging: false,
      }
    }
    const mousemove = (e) => {
      const { startX, startY, startPosArray } = blockDragData.current
      const { clientX: moveX, clientY: moveY } = e
      const durX = moveX - startX
      const durY = moveY - startY
      focusData.focus.forEach((block, index) => {
        // console.log(startPosArray[index])
        const { top, left } = startPosArray[index]
        block.top = top + durY
        block.left = left + durX
      })
      methods.updateBlocks(props.value.blocks)
      if (!blockDragData.current.dragging) {
        blockDragData.current.dragging = true
        dragstart.emit()
      }
    }
    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
      if (blockDragData.current.dragging) {
        dragend.emit()
      }
    }
    return { mousedown }
  })()

  /**
   * header的功能选项按钮
   **/
  //监听者模式，添加开始和结束的监听，完善回退和前进操作
  const [dragstart] = useState(() => createEvent())
  const [dragend] = useState(() => createEvent())

  //命令管理
  const commander = useEidtorCommand({
    value: props.value,
    focusData,
    updateBlocks: methods.updateBlocks,
    dragstart,
    dragend,
  })

  const buttons = [
    {
      label: '撤销',
      icon: 'icon-back',
      handler: commander.undo,
      tip: 'ctrl+z',
    },
    {
      label: '重做',
      icon: 'icon-forward',
      handler: commander.redo,
      tip: 'ctrl+y, ctri+shift+z',
    },
    {
      label: () => (preview ? '编辑' : '预览'),
      icon: () => (preview ? 'icon-edit' : 'icon-browse'),
      handler: () => {
        if (!preview) {
          methods.clearFocus()
        }
        setPreview(!preview)
      },
    },
    {
      label: '导入',
      icon: 'icon-import',
      handler: () => {},
    },
    {
      label: '导出',
      icon: 'icon-export',
      handler: () => {},
    },
    {
      label: '置顶',
      icon: 'icon-place-top',
      handler: commander.placeTop,
      tip: 'ctrl+up',
    },
    {
      label: '置底',
      icon: 'icon-place-bottom',
      handler: commander.placeBottom,
      tip: 'ctrl+down',
    },
    {
      label: '删除',
      icon: 'icon-delete',
      handler: commander.delete,
      tip: 'ctrl+d, backspace, delete',
    },
    { label: '清空', icon: 'icon-reset', handler: commander.clear },
    {
      label: '关闭',
      icon: 'icon-close',
      handler: () => {
        methods.clearFocus()
        setEditing(false)
        //回头改成跳转到展示部分
        props.history.push('/')
      },
    },
  ]

  return (
    <div className={classes}>
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
      <div className='editor-head'>
        {buttons.map((btn, index) => {
          const label =
            typeof btn.label === 'function' ? btn.label() : btn.label
          const icon = typeof btn.icon === 'function' ? btn.icon() : btn.icon
          return (
            <div className='editor-head-btn' key={index} onClick={btn.handler}>
              <i className={`iconfont ${icon}`} />
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      <div className='editor-body'>
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
      <div className='editor-operator'>operator</div>
    </div>
  )
}
export default withRouter(EditorPage)
