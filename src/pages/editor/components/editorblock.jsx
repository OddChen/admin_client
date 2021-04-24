import { useEffect, useMemo, useRef } from 'react'
import { useUpdate } from '../hook/useUpadate'

//props: block, config, onMousedown
export const EditorBlock = (props) => {
  const styles = useMemo(() => {
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      opacity: props.block.adjustPosition ? '0' : '',
    }
  }, [props.block.top, props.block.left, props.block.adjustPosition])

  const component = props.config.componentMap[props.block.componentKey]
  let render

  if (!!component) {
    // 设置随机id，防止渲染冲突
    const randomid = component.key + Math.floor(Math.random() * 10000)
    render = component.render(randomid)
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
      forceupdate()
    }
  })

  return (
    <div
      className='editor-block'
      style={styles}
      ref={elRef}
      onMouseDown={props.onMouseDown}
    >
      {render}
    </div>
  )
}
