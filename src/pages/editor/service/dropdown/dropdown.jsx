import ReactDom from 'react-dom'

const DropDownService = ((option) => {
  let ins
  return (option) => {
    if (!ins) {
      const el = document.createElement('div')
      document.body.appendChild(el)

      const Dropdown = () => {
        return (
          
        )
      }

      ReactDom.render(
        <Dropdown option={option} />,
        el
      )
    } else {
      ins.show(option)
    }
  }
})()

