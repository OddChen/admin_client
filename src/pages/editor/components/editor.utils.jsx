export function createEditorConfig() {
  const componentMap = {}
  const componentArray = []

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
