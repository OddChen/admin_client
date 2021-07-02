export const EditorPropsType = {
  //编辑说明
  text: 'text',
  select: 'select',
  selects: 'selects',
  color: 'color',
}

/**
 * options: label value
 */
//input
export const createTextProp = (name) => {
  return {
    name,
    type: EditorPropsType.text,
  }
}

//select
export const createSelectProp = (name, options) => {
  return {
    name,
    type: EditorPropsType.select,
    options,
  }
}

export const createSelectsProp = (name, options) => {
  return {
    name,
    type: EditorPropsType.selects,
    options,
  }
}

//color
export const createColorProp = (name) => {
  return {
    name,
    type: EditorPropsType.color,
  }
}
