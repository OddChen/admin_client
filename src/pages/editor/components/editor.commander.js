import { useCommander } from '../plugins/command.plugin'
import deepcopy from 'deepcopy'
import { CallBackRef } from '../hooks/CallbackRef'

export function useEidtorCommand({
  value,
  focusData,
  updateBlocks,
  updateValue,
  dragstart,
  dragend,
}) {
  const commander = useCommander()
  //删除
  commander.Registry({
    name: 'delete',
    keyboard: ['delete', 'ctrl+d', 'backspace'],
    execute() {
      const before = deepcopy(value.blocks)
      const after = deepcopy(focusData.unfocus)
      // console.log(before, focusData)
      return {
        redo: () => {
          updateBlocks(deepcopy(after))
        },
        undo: () => {
          updateBlocks(deepcopy(before))
        },
      }
    },
  })

  //拖拽:从菜单拖拽、调整位置、调整大小
  ;(() => {
    const blockDragData = { before: null }
    const handler = {
      dragstart: () => (blockDragData.current.before = deepcopy(value.blocks)),
      dragend: CallBackRef(() => commander.state.commands.drag()),
    }

    commander.Registry({
      name: 'drag',
      init() {
        blockDragData.current = { before: null }
        dragstart.on(handler.dragstart)
        dragend.on(handler.dragend)
        return () => {
          dragstart.off(handler.dragstart)
          dragend.off(handler.dragend)
        }
      },
      execute() {
        // console.log('拖拽')
        console.log(blockDragData.current.before, value.blocks)
        let before = deepcopy(blockDragData.current.before)
        let after = deepcopy(value.blocks)
        return {
          redo: () => {
            updateBlocks(deepcopy(after))
          },
          undo: () => {
            updateBlocks(deepcopy(before))
          },
        }
      },
    })
  })()

  //清空
  commander.Registry({
    name: 'clear',
    execute: () => {
      let data = {
        before: deepcopy(value.blocks),
        after: deepcopy([]),
      }
      return {
        redo: () => {
          updateBlocks(deepcopy(data.after))
        },
        undo: () => {
          updateBlocks(deepcopy(data.before))
        },
      }
    },
  })

  //全选
  commander.Registry({
    name: 'selectAll',
    followQueue: false,
    keyboard: 'ctrl+a',
    execute: () => {
      return {
        redo: () => {
          value.blocks.forEach((block) => (block.focus = true))
          updateBlocks(value.blocks)
        },
      }
    },
  })

  //置顶
  commander.Registry({
    name: 'placeTop',
    keyboard: 'ctrl+up',
    execute() {
      const before = deepcopy(value.blocks)
      const after = deepcopy(
        (() => {
          const { focus, unfocus } = focusData
          //未选中的最大Index
          // console.log('placetop')
          const maxUnFocusIndex = unfocus.reduce(
            (prev, item) => Math.max(prev, item.zIndex),
            -Infinity
          )
          //选中的最小Index
          const minFocusIndex = focus.reduce(
            (prev, item) => Math.min(prev, item.zIndex),
            Infinity
          )
          let dur = maxUnFocusIndex - minFocusIndex
          if (dur >= 0) {
            dur++
            focus.forEach((block) => (block.zIndex = block.zIndex + dur))
          }
          return value.blocks
        })()
      )
      return {
        redo: () => updateBlocks(after),
        undo: () => updateBlocks(before),
      }
    },
  })

  //置底
  commander.Registry({
    name: 'placeBottom',
    keyboard: 'ctrl+down',
    execute() {
      const before = deepcopy(value.blocks)
      const after = deepcopy(
        (() => {
          const { focus, unfocus } = focusData
          //未选中的最小Index
          const minUnFocusIndex = unfocus.reduce(
            (prev, item) => Math.min(prev, item.zIndex),
            Infinity
          )
          //选中的最大Index
          const maxFocusIndex = focus.reduce(
            (prev, item) => Math.max(prev, item.zIndex),
            -Infinity
          )
          const minFocusIndex = focus.reduce(
            (prev, item) => Math.min(prev, item.zIndex),
            Infinity
          )
          let dur = maxFocusIndex - minUnFocusIndex
          //zIndex最小只能为0
          if (dur >= 0) {
            dur++
            focus.forEach((block) => (block.zIndex = block.zIndex - dur))
            if (minFocusIndex - dur < 0) {
              dur = dur - minFocusIndex
              value.blocks.forEach(
                (block) => (block.zIndex = block.zIndex + dur)
              )
            }
          }
          return value.blocks
        })()
      )
      // console.log(before, after)
      return {
        redo: () => updateBlocks(after),
        undo: () => updateBlocks(before),
      }
    },
  })

  //导入
  commander.Registry({
    name: 'updateValue',
    execute: (newVal) => {
      const before = deepcopy(value)
      const after = deepcopy(newVal)
      // console.log(before, after)
      return {
        redo: () => {
          updateValue(deepcopy(after))
        },
        undo: () => {
          updateValue(deepcopy(before))
        },
      }
    },
  })

  //初始化生成默认的undo和redo
  commander.useInit()

  return {
    delete: () => commander.state.commands.delete(),
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    clear: () => commander.state.commands.clear(),
    placeTop: () => commander.state.commands.placeTop(),
    placeBottom: () => commander.state.commands.placeBottom(),
    updateValue: (newVal) => commander.state.commands.updateValue(newVal),
  }
}
