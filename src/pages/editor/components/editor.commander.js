import { useCommander } from '../plugins/command.plugin'
import deepcopy from 'deepcopy'

export function useEidtorCommand({ focusData, value, updateBlocks }) {
  const commander = useCommander()
  //删除命令
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

  commander.useInit()

  return {
    delete: () => commander.state.commands.delete(),
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
  }
}
