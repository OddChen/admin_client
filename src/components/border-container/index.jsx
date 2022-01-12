import './index.less'

const BorderContainer = (props) => {
  const { width, height } = props
  return (
    <div
      className='border-container'
      style={{ width, height, top: `-${height}` }}
    >
      <span className='top-left border-span'></span>
      <span className='top-right border-span'></span>
      <span className='bottom-left border-span'></span>
      <span className='bottom-right border-span'></span>
    </div>
  )
}

export default BorderContainer
