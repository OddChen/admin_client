import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'
// 创建一个HTML标
function batag(name, gdp) {
  // 创建div元素(作为标签)
  var div = document.createElement('div')
  // div.style.visibility = 'hidden'
  div.innerHTML = name + '<br>' + '宽带用户' + gdp + '万户'
  div.style.padding = '4px 10px'
  div.style.color = '#fff'
  div.style.fontSize = '5px'
  div.style.position = 'absolute'
  div.style.backgroundColor = 'rgba(25,25,25,0.5)'
  div.style.borderRadius = '5px'
  // div.style.marginLeft = '50px';//HTML标签偏移
  div.style.marginLeft = name.length * 2 + 'px' //HTML标签偏移
  div.style.marginTop = '-8px' //HTML标签偏移
  // 这里无法去读宽高度，说明还未渲染导致
  // console.log(div.offsetWidth)
  //div元素包装为CSS2模型对象CSS2DObject
  var label = new CSS2DObject(div)
  div.style.pointerEvents = 'none' //避免HTML标签遮挡三维场景的鼠标事件
  // 设置HTML元素标签在three.js世界坐标中位置
  // label.position.set(x, y, z);
  return label //返回CSS2模型标签
}

// 创建一个CSS2渲染器CSS2DRenderer
var balabelRenderer = new CSS2DRenderer()
balabelRenderer.setSize(window.innerWidth, window.innerHeight)
balabelRenderer.domElement.style.position = 'absolute'
balabelRenderer.domElement.style.top = '0px'
balabelRenderer.domElement.style.left = '0px'
// //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
balabelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(balabelRenderer.domElement)

export { batag, balabelRenderer }
