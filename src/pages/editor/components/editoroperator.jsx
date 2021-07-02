import deepcopy from 'deepcopy'
import { useEffect, useState } from 'react'
import { Form, Button, InputNumber, Input, Select, Alert } from 'antd'
import { EditorPropsType } from './editor.props'
import { ChromePicker } from 'react-color'

/**
 * @param props - selectBlock value updateValue updateBlocks value config
 * @returns
 */
export const EditorOperator = (props) => {
  const [editData, setEditData] = useState({})
  const [form] = Form.useForm()

  useEffect(() => {
    methods.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectBlock])

  const methods = {
    apply: () => {
      if (!props.selectBlock) {
        props.updateValue({
          ...props.value,
          container: editData,
        })
      } else {
        props.value.blocks.forEach((block) => {
          if (block.focus) {
            block.blockprops = editData.props
            return
          }
        })
        props.updateBlocks(props.value.blocks)
      }
    },
    reset: () => {
      let data
      if (!props.selectBlock) {
        data = deepcopy(props.value.container)
      } else {
        data = deepcopy(props.selectBlock)
      }
      setEditData(data)
      form.resetFields()
      form.setFieldsValue(data)
    },
    onFormValuesChange: (changeValues, values) => {
      setEditData({
        ...editData,
        ...values,
      })
    },
  }

  let render = []
  if (!props.selectBlock) {
    render.push(
      <Form.Item
        label='容器宽度'
        name='width'
        key='container-width'
        initialValue={props.value.container.width}
      >
        <InputNumber step={100} min={0} precision={0} />
      </Form.Item>
    )
    render.push(
      <Form.Item
        label='容器高度'
        name='height'
        key='container-height'
        initialValue={props.value.container.height}
      >
        <InputNumber step={100} precision={0} />
      </Form.Item>
    )
    render.push(
      <Form.Item
        label='容器背景'
        name='background'
        key='container-background'
        initialValue={props.value.container.background}
      >
        <Input placeholder='默认白色 | 可输入背景图url()' />
      </Form.Item>
    )
  } else {
    const component = props.config.componentMap[props.selectBlock.componentKey]
    if (component) {
      render.push(
        ...Object.entries(component.blockprops || {}).map(
          ([propsName, propsConfig]) => renderEditor(propsName, propsConfig)
        )
      )
    }
  }
  return (
    <div className='editor-operator'>
      <div className='editor-operator-title'>
        {!!props.selectBlock ? '组件设置' : '容器设置'}
      </div>
      <Form
        layout='vertical'
        form={form}
        onValuesChange={methods.onFormValuesChange}
      >
        <Form.Item key='operator'>
          {render}
          <Button
            type='primary'
            onClick={methods.apply}
            style={{ marginRight: '8px' }}
          >
            应用
          </Button>
          <Button onClick={methods.reset}>重置</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const renderEditor = (propsName, propsConfig) => {
  // console.log(1)
  switch (propsConfig.type) {
    case EditorPropsType.text:
      return (
        <Form.Item
          label={propsConfig.name}
          name={['props', propsName]}
          key={`props_${propsName}`}
        >
          <Input />
        </Form.Item>
      )
    case EditorPropsType.color:
      const colorChangeComplete = (color) => {
        propsConfig.color = color.hex
      }
      const colorChange = (color) => {
        propsConfig.color = color.hex
      }
      return (
        <Form.Item
          label={propsConfig.name}
          name={['props', propsName]}
          key={`props_${propsName}`}
        >
          <ChromePicker
            disableAlpha={true}
            color={propsConfig.color}
            onChange={colorChange}
            onChangeComplete={colorChangeComplete}
          />
        </Form.Item>
      )
    case EditorPropsType.select:
      return (
        <Form.Item
          label={propsConfig.name}
          name={['props', propsName]}
          key={`props_${propsName}`}
        >
          <Select>
            {propsConfig.options.map((opt, index) => (
              <Select.Option value={opt.value} key={index}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    // case EditorPropsType.selects:
    //   const selectsChange = (value) => {
    //     console.log(value)
    //   }
    //   return (
    //     <Form.Item
    //       label={propsConfig.name}
    //       name={['props', propsName]}
    //       key={`props_${propsName}`}
    //     >
    //       <Select mode='tags' onChange={selectsChange}>
    //         {propsConfig.options.map((opt, index) => (
    //           <Select.Option value={opt.value} key={index}>
    //             {opt.label}
    //           </Select.Option>
    //         ))}
    //       </Select>
    //     </Form.Item>
    //   )
    default:
      return (
        <Alert
          message={`${propsConfig.type} is not exist!`}
          type='error'
          showIcon
        />
      )
  }
}
