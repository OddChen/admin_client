import { useEffect, useRef, useState } from 'react'
import { KeyboardCode } from './keyboard-code'

export function useCommander() {
  const [state] = useState(() => ({
    //当前队列中最后执行返回的执行对象
    current: -1,
    //命令队列
    queue: [],
    //预定义命令数组
    commandArray: [],
    //command动作的包装,通过command name执行
    commands: {},
    //组件销毁之前消除副作用的函数数组
    destroyList: [],
  }))

  //注册操作命令
  const Registry = (command) => {
    const commandRef = useRef(command)
    commandRef.current = command
    useState(() => {
      if (state.commands[command.name]) {
        const existIndex = state.commandArray.findIndex(
          (item) => item.current.name === command.name
        )
        state.commandArray.splice(existIndex, 1)
      }
      state.commandArray.push(commandRef)
      state.commands[command.name] = (...args) => {
        const { redo, undo } = commandRef.current.execute(...args)
        redo()
        //不需要进入命令队列就直接结束
        if (commandRef.current.followQueue === false) {
          return
        }
        //将命令队列剩余的部分清除，保留current及之前的
        let { queue, current } = state
        if (queue.length > 0) {
          queue = queue.slice(0, current + 1)
          state.queue = queue
        }
        //设置队列中最后一个命令为当前命令
        queue.push({ undo, redo })
        //索引加一
        state.current = current + 1
      }
    })
  }

  const [keyboardEvent] = useState(() => {
    const onKeydown = (e) => {
      if (document.activeElement !== document.body) {
        return
      }
      //当前按键
      const { keyCode, shiftKey, altKey, ctrlKey, metaKey } = e
      let keyString = []
      if (ctrlKey || metaKey) {
        keyString.push('ctrl')
      }
      if (shiftKey) {
        keyString.push('shift')
      }
      if (altKey) {
        keyString.push('alt')
      }
      keyString.push(KeyboardCode[keyCode])
      const keyNames = keyString.join('+')
      state.commandArray.forEach(({ current: { keyboard, name } }) => {
        if (!keyboard) {
          return
        }
        const keys = Array.isArray(keyboard) ? keyboard : [keyboard]
        if (keys.indexOf(keyNames) > -1) {
          state.commands[name]()
          e.stopPropagation()
          e.preventDefault()
        }
      })
    }
    const init = () => {
      window.addEventListener('keydown', onKeydown, true)
      return () => {
        window.removeEventListener('keydown', onKeydown, true)
      }
    }
    return { init }
  })

  //初始化command和键盘监听事件，调用命令的初始化逻辑
  const useInit = () => {
    useState(() => {
      state.commandArray.forEach(
        (command) =>
          !!command.current.init &&
          state.destroyList.push(command.current.init())
      )
      state.destroyList.push(keyboardEvent.init())
    })

    //注册撤回命令（不需要进入命令队列）
    Registry({
      name: 'undo',
      keyboard: 'ctrl+z',
      followQueue: false,
      execute: () => {
        return {
          redo: () => {
            if (state.current === -1) {
              return
            }
            const queueItem = state.queue[state.current]
            // console.log('queueItem',queueItem)
            if (!!queueItem) {
              !!queueItem.undo && queueItem.undo()
              state.current--
            }
          },
        }
      },
    })

    //注册重做命令（不需要进入命令队列）
    Registry({
      name: 'redo',
      keyboard: ['ctrl+y', 'ctrl+shift+z'],
      followQueue: false,
      execute: () => {
        return {
          redo: () => {
            const queueItem = state.queue[state.current + 1]
            if (!!queueItem) {
              queueItem.redo()
              state.current++
            }
          },
        }
      },
    })
  }

  useEffect(() => {
    return () => {
      state.destroyList.forEach((fn) => !!fn && fn())
    }
  })
  return {
    state,
    Registry,
    useInit,
  }
}
