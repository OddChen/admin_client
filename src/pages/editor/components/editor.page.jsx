import React, { useRef, useMemo, useState } from 'react'
import '../iconfont/iconfont.css'
import { createEditorBlock } from './editor.utils'
import { EditorBlock } from './editorblock'
import { useEidtorCommand } from './editor.commander'
import { EditorResize, EditorResizeDirector } from './editor.resize'
import { createEvent } from '../plugins/event'
import { CallBackRef } from '../hooks/CallbackRef'
import { withRouter } from 'react-router'
import { dialog } from '../service/dialog/dialog'
import { notification } from 'antd'
import deepcopy from 'deepcopy'
import { EditorOperator } from './editoroperator'

const EditorPage = (props) => {
  //当前的预览状态
  const [preview, setPreview] = useState(false)
  //当前的编辑状态
  const [editing, setEditing] = useState(false)
  //当前选中block的index
  const [selectIndex, setSelectIndex] = useState(-1)

  const selectBlock = useMemo(
    () => props.value.blocks[selectIndex],
    [props.value.blocks, selectIndex]
  )

  // container dom对象引用
  // 这里是渲染完后才获取，因此一直有值
  const containerRef = useRef({})
  const bodyRef = useRef({})

  //container对象样式
  const containerStyles = useMemo(() => {
    // console.log(props.value)
    return {
      height: `${props.value.container.height}px`,
      width: `${props.value.container.width}px`,
      background: `${props.value.container.background}`,
    }
  }, [
    props.value.container.height,
    props.value.container.width,
    props.value.container.background,
  ])

  //编辑和预览状态的样式
  const classes = useMemo(
    () => ['editor', preview ? 'editor-preview' : null].join(' '),
    [preview]
  )

  //拖拽处理逻辑
  // 左边菜单的拖拽
  const dragData = useRef({
    dragComponent: null,
  })
  const menuDraggier = (() => {
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
  //导入新的数据
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
    //导入新的数据后重新渲染
    updateValue: (value) => {
      props.onChange({ ...value })
    },
    flushedValue: () => {
      setTimeout(() => {
        commander.clear()
        methods.updateValue(props.value)
      }, 10)
    },
  }

  //处理block元素的选中事件
  const focusHandler = (() => {
    //点击block元素的动作
    const block = (e, block, index) => {
      // console.log(block)
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

      setSelectIndex(block.focus ? index : -1)
      setTimeout(() => {
        blockDraggier.mousedown(e, block)
      })
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
        setSelectIndex(-1)
      }
    }
    return {
      block,
      container,
    }
  })()

  /*
   *拖拽所有被选中的block
   */
  //标准线
  const [mark, setMark] = useState({ x: null, y: null })
  //拖拽数据
  const blockDragData = useRef({
    //鼠标的开始位置
    startX: 0,
    startY: 0,
    //是否按住了shift
    shiftKey: false,
    //block的开始位置
    startLeft: 0,
    startTop: 0,
    //所有block的开始位置
    startPosArray: [],
    //是否处于拖拽状态
    dragging: false,
    markLines: {
      x: [],
      y: [],
    },
    //鼠标在拖拽过程中的位置
    moveX: 0,
    moveY: 0,
    //滚动条
    body: {
      startScrollTop: 0,
      moveScrollTop: 0,
    },
  })
  //拖拽移动操作
  const blockDraggier = (() => {
    const handleMove = (e) => {
      if (!blockDragData.current.dragging) {
        blockDragData.current.dragging = true
        dragstart.emit()
      }
      let {
        moveX,
        moveY,
        body,
        shiftKey,
        startX,
        startY,
        startPosArray,
        markLines,
        startTop,
        startLeft,
      } = blockDragData.current
      // let { clientX: moveX, clientY: moveY } = e
      moveY = moveY + (body.moveScrollTop - body.startScrollTop)
      //按着shift的情况下只能垂直和水平移动
      if (shiftKey) {
        if (Math.abs(moveX - startX) > Math.abs(moveY - startY)) {
          moveY = startY
        } else {
          moveX = startX
        }
      }
      // console.log(startTop, moveY, startY)
      //设置标线
      const now = {
        mark: {
          x: null,
          y: null,
        },
        top: startTop + moveY - startY,
        left: startLeft + moveX - startX,
      }

      for (let i = 0; i < markLines.y.length; i++) {
        const { top, showTop } = markLines.y[i]
        if (Math.abs(now.top - top) < 5) {
          moveY = top + startY - startTop
          now.mark.y = showTop
        }
      }
      for (let i = 0; i < markLines.x.length; i++) {
        const { left, showLeft } = markLines.x[i]
        if (Math.abs(now.left - left) < 5) {
          moveX = left + startX - startLeft
          now.mark.x = showLeft
        }
      }

      //移动block位置
      const durX = moveX - startX
      const durY = moveY - startY
      focusData.focus.forEach((block, index) => {
        // console.log(startPosArray)
        const { top, left } = startPosArray[index]
        block.top = top + durY
        block.left = left + durX
      })
      // console.log(now.mark)
      setMark(now.mark)
      methods.updateBlocks(props.value.blocks)
    }

    const mousedown = (e, block) => {
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
      bodyRef.current.addEventListener('scroll', scroll)
      // console.log(block)
      //当前鼠标位置以及所有被选中元素的位置
      blockDragData.current = {
        startX: e.clientX,
        startY: e.clientY,
        shiftKey: e.shiftKey,
        startLeft: block.left,
        startTop: block.top,
        startPosArray: focusData.focus.map(({ top, left }) => ({ top, left })),
        dragging: false,
        markLines: (() => {
          const x = []
          const y = []
          const { unfocus } = focusData
          unfocus.forEach((b) => {
            //b:作为对齐标准的block属性, top，left:拖拽的block位置, showTop,showLeft:标线位置
            //两个block顶部对齐
            y.push({ top: b.top, showTop: b.top })
            //中间对齐
            y.push({
              top: b.top + b.height / 2 - block.height / 2,
              showTop: b.top + b.height / 2,
            })
            //底部对齐
            y.push({
              top: b.top + b.height - block.height,
              showTop: b.top + b.height,
            })
            //底部对齐顶部
            y.push({
              top: b.top - block.height,
              showTop: b.top,
            })
            //顶部对齐底部
            y.push({
              top: b.top + b.height,
              showTop: b.top + b.height,
            })

            //两个block左侧对齐
            x.push({ left: b.left, showLeft: b.left })
            //中间对齐
            x.push({
              left: b.left + b.width / 2 - block.height / 2,
              showLeft: b.left + b.width / 2,
            })
            //右侧对齐
            x.push({
              left: b.left + b.width - block.width,
              showLeft: b.left + b.width,
            })
            //右侧对齐左侧
            x.push({
              left: b.left - block.width,
              showLeft: b.left,
            })
            //左侧对齐右侧
            x.push({
              left: b.left + b.width,
              showLeft: b.left + b.width,
            })
          })

          return { x, y }
        })(),
        moveX: e.clientX,
        moveY: e.clientY,
        body: {
          startScrollTop: bodyRef.current.scrollTop,
          moveScrollTop: bodyRef.current.scrollTop,
        },
      }
    }

    const mousemove = (e) => {
      blockDragData.current.moveX = e.clientX
      blockDragData.current.moveY = e.clientY
      handleMove()
    }

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
      bodyRef.current.removeEventListener('scroll', scroll)
      //清除标线
      setMark({ x: null, y: null })

      if (blockDragData.current.dragging) {
        dragend.emit()
      }
    }

    const scroll = CallBackRef((e) => {
      blockDragData.current.body.moveScrollTop = e.target.scrollTop
      handleMove()
    })

    return { mousedown, mark }
  })()

  //拖拽调整block大小
  const resizeData = useRef({
    block: {},
    startX: 0,
    startY: 0,
    direction: {
      horizontal: EditorResizeDirector.start,
      vertical: EditorResizeDirector.start,
    },
    startBlock: {
      top: 0,
      left: 0,
      height: 0,
      width: 0,
    },
    dragging: false,
  })
  const resizeDraggier = (() => {
    //direction: { horizontal, vertical }
    const mousedown = (e, direction, block) => {
      e.stopPropagation()
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
      resizeData.current = {
        block,
        startX: e.clientX,
        startY: e.clientY,
        direction,
        startBlock: {
          ...deepcopy(block),
        },
        dragging: false,
      }
    }

    const mousemove = (e) => {
      if (!resizeData.current.dragging) {
        resizeData.current.dragging = true
        dragstart.emit()
      }

      let { startX, startY, startBlock, direction, block } = resizeData.current
      let { clientX: moveX, clientY: moveY } = e

      if (direction.horizontal === EditorResizeDirector.center) {
        moveX = startX
      }
      if (direction.vertical === EditorResizeDirector.center) {
        moveY = startY
      }

      let durX = moveX - startX
      let durY = moveY - startY
      // console.log(durX, durY)
      // console.log(startBlock)
      if (direction.vertical === EditorResizeDirector.start) {
        durY = -durY
        block.top = startBlock.top - durY
      }
      if (direction.horizontal === EditorResizeDirector.start) {
        durX = -durX
        block.left = startBlock.left - durX
      }

      const width = startBlock.width + durX
      const height = startBlock.height + durY
      // console.log(width, height)
      block.width = width
      block.height = height
      block.hasResize = true
      // console.log(block)
      methods.updateBlocks(props.value.blocks)
    }

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
      // 使得echarts组件在拖拽大小后刷新页面
      methods.flushedValue()

      if (resizeData.current.dragging) {
        setTimeout(dragend.emit)
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
    updateValue: methods.updateValue,
    dragstart,
    dragend,
  })

  //header栏按钮和命令
  const buttons = [
    {
      label: '撤销',
      icon: 'icon-back',
      handler: commander.undo,
      tip: 'ctrl+z',
    },
    // {
    //   label: '重做',
    //   icon: 'icon-forward',
    //   handler: commander.redo,
    //   tip: 'ctrl+y, ctri+shift+z',
    // },
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
      handler: async () => {
        const text = await dialog.textarea('', {
          title: '请选择要导入的方案',
        })
        // console.log(text)
        try {
          const data = JSON.parse(text || '')
          // console.log(data)
          commander.updateValue(data)
        } catch (e) {
          console.error(e)
          notification.open({
            message: '导入失败',
            description: '导入数据的格式不正常，请检查！',
          })
        }
      },
    },
    {
      label: '导出',
      icon: 'icon-export',
      handler: () => {
        dialog.textarea(props.value, {
          editReadonly: true,
          title: '导出设计方案',
        })
      },
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
    { label: '清空', icon: 'icon-delete', handler: commander.clear },
    {
      label: '刷新',
      icon: 'icon-reset',
      handler() {
        methods.flushedValue()
      },
    },
    {
      label: '关闭',
      icon: 'icon-close',
      handler: () => {
        methods.clearFocus()
        setEditing(false)

        //回头改成跳转到展示部分
        props.history.push('/editorscheme')
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
      <div className='editor-body' ref={bodyRef}>
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
              onMouseDown={(e) => focusHandler.block(e, block, index)}
            >
              {block.focus &&
                !!props.config.componentMap[block.componentKey] &&
                !!props.config.componentMap[block.componentKey].resize &&
                (props.config.componentMap[block.componentKey].resize.width ||
                  props.config.componentMap[block.componentKey].resize
                    .height) && (
                  <EditorResize
                    component={props.config.componentMap[block.componentKey]}
                    onMouseDown={(e, direction) =>
                      resizeDraggier.mousedown(e, direction, block)
                    }
                  />
                )}
            </EditorBlock>
          ))}
          {blockDraggier.mark.x !== null && (
            <div
              className='editor-mark-x'
              style={{ left: `${blockDraggier.mark.x}px` }}
            ></div>
          )}
          {blockDraggier.mark.y !== null && (
            <div
              className='editor-mark-y'
              style={{ top: `${blockDraggier.mark.y}px` }}
            ></div>
          )}
        </div>
      </div>
      <EditorOperator
        selectBlock={selectBlock}
        value={props.value}
        updateValue={methods.updateValue}
        updateBlocks={methods.updateBlocks}
        config={props.config}
      />
    </div>
  )
}
export default withRouter(EditorPage)
