import { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import './dialog.less'
import { Modal, Button, Input, message } from 'antd'
import { defer } from '../../utils/defer'

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

        const handler = {
          onCancel: () => {
            !!option.onCancel && option.onCancel()
            methods.close()
          },
          // onConfirm: () => {
          //   !!option.onConfirm && option.onConfirm(editValue)
          //   methods.close()
          // },
          onImportConfirm: () => {
            !!option.onImportConfirm && option.onImportConfirm(editValue)
            methods.close()
          },
          onExportConfirm: () => {
            // !!option.onExportConfirm && option.onExportConfirm(editValue)
            setLoading(true)
            //数据响应成功后执行下面操作
            setTimeout(() => {
              setLoading(false)
              message.success('成功导出')
              methods.close()
            }, 1000)
          },
        }

        const inputProps = {
          value: editValue,
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
            // footer={
            //   option.confirmButton || option.cancelButton ? (
            //     <>
            //       {option.cancelButton && (
            //         <Button onClick={handler.onCancel}>取消</Button>
            //       )}
            //       {option.confirmButton && (
            //         <Button type='primary' onClick={handler.onConfirm}>
            //           确定
            //         </Button>
            //       )}
            //     </>
            //   ) : null
            // }
          >
            {option.message}
            {/* 可以改成input框 */}
            {/* {option.editType === 'input' && <Input {...inputProps} />} */}
            {option.editType === 'textarea' && (
              <Input.TextArea {...inputProps} rows={15} />
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
