export function createEditorConfig() {
  const componentMap = {}
  const componentArray = []
  // 注册组件
  function registryComponent(key, option) {
    if (componentMap[key]) {
      const index = componentArray.indexOf(componentMap[key])
      componentArray.splice(index, 1)
    }
    const newComponent = {
      key,
      ...option,
    }
    componentArray.push(newComponent)
    componentMap[key] = newComponent
  }

  return {
    componentMap,
    componentArray,
    registryComponent,
  }
}

/**
 * 创建block数据
 */
export function createEditorBlock({ top, left, component }) {
  return {
    //组件的key值，通过这个找到对应的组件
    componentKey: component.key,
    //top定位
    top,
    //left定位
    left,
    //是否需要调整位置
    adjustPosition: true,
    //是否被选中
    focus: false,
    zIndex: 0,
    width: 0,
    height: 0,
    //是否调整过大小
    hasResize: false,
  }
}
