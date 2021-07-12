import { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
// import './dialog.less'
import { Modal, Button, Input, message, Form, Select, Switch } from 'antd'
import { defer } from '../../utils/defer'
import { reqExport } from '../../../../api'
import memoryUtils from '../../../../utils/memoryUtils'

const DialogService = (() => {
  let ins
  return (option) => {
    if (!ins) {
      const el = document.createElement('div')
      document.body.appendChild(el)

      const Service = (props) => {
        const [option, setOption] = useState(props.option)
        const [showFlag, setShowFlag] = useState(false)
        const [editValue, setEditValue] = useState('')
        const [loading, setLoading] = useState(false)
        const [dashboardname, setDashboardname] = useState(
          props.option.editValue.name
        )
        const [ispublic, setIspublic] = useState(
          props.option.editValue.ispublic
        )
        const [description, setDescription] = useState(
          props.option.editValue.description
        )

        const handler = {
          onCancel: () => {
            !!option.onCancel && option.onCancel()
            methods.close()
          },
          //导入
          onImportConfirm: () => {
            !!option.onImportConfirm && option.onImportConfirm(editValue)
            methods.close()
          },
          //导出
          onExportConfirm: async () => {
            setLoading(true)
            let user_id = memoryUtils.user.id
            editValue.user_id = user_id
            editValue.name = dashboardname
            editValue.description = description
            editValue.ispublic = ispublic
            setEditValue(editValue)

            let response = await reqExport(editValue)
            console.log(response)
            const result = response.data
            // 数据响应成功后执行下面操作
            if (result.status === 0) {
              setLoading(false)
              message.success('成功导出')
              methods.close()
            } else {
              message.error(result.msg, 3)
            }
            setLoading(false)
            message.success('导出成功')
          },
        }

        const inputProps = {
          value: JSON.stringify(editValue),
          onChange: (e) => {
            setEditValue(e.target.value)
          },
        }

        const methods = {
          show: (opt) => {
            setOption(opt)
            setEditValue(opt.editValue || '')
            setShowFlag(true)
          },
          close: () => {
            setShowFlag(false)
          },
        }

        const select_opt = [1, 2, 3, 4, 5]

        props.onRef(methods)

        useEffect(() => {
          methods.show(props.option)
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
          <Modal
            maskClosable={true}
            closable={true}
            title={option.title || '系统提示'}
            visible={showFlag}
            onCancel={handler.onCancel}
            footer={
              option.editReadonly
                ? [
                    <Button key='cancel' onClick={handler.onCancel}>
                      取消导出
                    </Button>,
                    <Button
                      key='exportsub'
                      type='primary'
                      loading={loading}
                      onClick={handler.onExportConfirm}
                    >
                      确定导出
                    </Button>,
                  ]
                : [
                    <Button key='cancel' onClick={handler.onCancel}>
                      取消导入
                    </Button>,
                    <Button
                      key='importsub'
                      type='primary'
                      loading={loading}
                      onClick={handler.onImportConfirm}
                    >
                      确定导入
                    </Button>,
                  ]
            }
          >
            {option.message}
            {option.editReadonly ? (
              <Form>
                <Form.Item>
                  <Input
                    addonBefore='方案名称'
                    value={dashboardname}
                    onChange={(e) => setDashboardname(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Input
                    addonBefore='方案描述'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  是否公开：
                  <Switch
                    checkedChildren='是'
                    unCheckedChildren='否'
                    checked={ispublic}
                    onClick={() => setIspublic(!ispublic)}
                  />
                </Form.Item>
                <Form.Item>
                  <Input.TextArea
                    value={inputProps.value}
                    rows={10}
                    readOnly={true}
                  />
                </Form.Item>
              </Form>
            ) : (
              <Form>
                <Form.Item>
                  <Select>
                    {select_opt.map((name) => (
                      <Select.Option key={name}>{name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Input.TextArea
                    value={inputProps.value}
                    rows={15}
                    readOnly={false}
                    onChange={inputProps.onChange}
                  />
                </Form.Item>
              </Form>
            )}
          </Modal>
        )
      }
      ReactDom.render(
        <Service option={option} onRef={(val) => (ins = val)} />,
        el
      )
    } else {
      ins.show(option)
    }
  }
})()

export const dialog = {
  //JSON.stringify(props.value), {editReadonly: true,title: '导出设计方案',}
  textarea: (editValue, opt) => {
    const dfd = defer()
    const option = {
      editValue,
      editType: 'textarea',
      ...(opt || {}),
      editReadonly: opt.editReadonly,
      // confirmButton: !opt || !opt.editReadonly,
      // cancelButton: !opt || !opt.editReadonly,
      onImportConfirm: (editValue) => {
        dfd.resolve(editValue)
      },
    }
    DialogService(option)
    return dfd.promise
  },
}
