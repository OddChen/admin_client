import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'
// 创建一个HTML标签
function btag(div) {
  //div元素包装为CSS2模型对象CSS2DObject
  var label = new CSS2DObject(div)
  div.style.pointerEvents = 'none' //避免HTML标签遮挡三维场景的鼠标事件
  // 设置HTML元素标签在three.js世界坐标中位置
  // label.position.set(x, y, z);
  return label //返回CSS2模型标签
}

// 创建一个CSS2渲染器CSS2DRenderer
var blabelRenderer = new CSS2DRenderer()
blabelRenderer.setSize(window.innerWidth, window.innerHeight)
blabelRenderer.domElement.style.position = 'absolute'
//标签向右、向下偏移，以免遮挡选中的气泡
blabelRenderer.domElement.style.top = '30px'
blabelRenderer.domElement.style.left = '70px'
// //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
blabelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(blabelRenderer.domElement)

export { btag, blabelRenderer }
