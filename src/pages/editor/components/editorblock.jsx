import { useEffect, useMemo, useRef } from 'react'
import { useUpdate } from '../hooks/useUpadate'

//props: block, config, onMousedown
export const EditorBlock = (props) => {
  //样式
  const styles = useMemo(() => {
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: props.block.zIndex,
      opacity: props.block.adjustPosition ? '0' : '',
    }
  }, [
    props.block.top,
    props.block.left,
    props.block.zIndex,
    props.block.adjustPosition,
  ])
  //添加选中边框样式
  const classes = useMemo(
    () =>
      ['editor-block', props.block.focus ? 'editor-block-focus' : null].join(
        ' '
      ),
    [props.block.focus]
  )

  const component = props.config.componentMap[props.block.componentKey]
  let render
  if (!!component) {
    // 设置随机id，防止渲染冲突
    const randomid = component.key + Math.floor(Math.random() * 10000)
    let size =
      props.block.hasResize && component.resize
        ? (() => {
            let style = {
              height: undefined | '',
              width: undefined | '',
            }
            !!component.resize.width && (style.width = `${props.block.width}px`)
            !!component.resize.height &&
              (style.height = `${props.block.height}px`)
            return style
          })()
        : { width: props.block.width, height: props.block.height }
    let blockprops = props.block.blockprops
    render = component.render(randomid, size, blockprops || {})
  }

  // 重新渲染当前组件
  const { forceupdate } = useUpdate()
  const elRef = useRef({})
  // 拖动后调整位置到鼠标中央
  useEffect(() => {
    if (props.block.adjustPosition) {
      const { top, left } = props.block
      const { height, width } = elRef.current.getBoundingClientRect()
      props.block.adjustPosition = false
      props.block.top = top - height / 2
      props.block.left = left - width / 2
      props.block.width = elRef.current.offsetWidth
      props.block.height = elRef.current.offsetHeight
      forceupdate()
    }
  })

  return (
    <div
      className={classes}
      style={styles}
      ref={elRef}
      onMouseDown={props.onMouseDown}
    >
      {render}
      {props.children}
    </div>
  )
}
