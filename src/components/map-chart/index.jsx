import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import mapurl from './mapurl'
// 填充图
import { borderline } from './FillChart/borderline'
import { tag, labelRenderer } from './FillChart/tag'
import { ExtrudeMesh } from './FillChart/ExtrudeMesh'
// 气泡图
import { bubbleline } from './BubbleChart/line'
import { cirMesh } from './BubbleChart/cirMesh'
import { shapeMesh } from './BubbleChart/shapeMesh'
import { btag, blabelRenderer } from './BubbleChart/tag'
// 柱状图
import { barline } from './BarChart/line'
import { prismMesh } from './BarChart/prismMesh'
import { baExtrudeMesh } from './BarChart/ExtrudeMesh'
import { batag, balabelRenderer } from './BarChart/tag'

import { Select } from 'antd'
import { Option } from 'antd/lib/mentions'
import './index.less'

class ThreeMapChart extends React.Component {
  constructor(props) {
    super(props)
    // console.log(this.props)
    this.state = {
      // width: props.size.width || 300,
      // height: props.size.height || 300,
      width: 800,
      height: 500,
      charttype: 'fill',
      lng: 0,
      lat: 0,
    }

    this.threeRef = React.createRef()
  }

  componentDidMount() {
    // 类型切换
    if (this.state.charttype === 'bar') {
      this.renderBar()
    } else if (this.state.charttype === 'bubble') {
      this.renderBubble()
    } else {
      this.renderFill()
    }
  }

  componentDidUpdate() {
    // 类型切换
    if (this.state.charttype === 'bar') {
      this.renderBar()
    } else if (this.state.charttype === 'bubble') {
      this.renderBubble()
    } else {
      this.renderFill()
    }
  }

  // 填充图
  renderFill = () => {
    // 底图中心经纬度
    // let lng = 0,
    //   lat = 0

    /**
     * 填充图
     * 创建场景对象Scene
     */
    var scene = new THREE.Scene()
    //three.js文件加载类FileLoader：封装了XMLHttpRequest
    var loader = new THREE.FileLoader()
    loader.setResponseType('json')
    // 组对象mapGroup是所有行政区边界Line模型的父对象
    var mapGroup = new THREE.Group()
    scene.add(mapGroup)
    var lineGroup = new THREE.Group() //边界线组 底部
    mapGroup.add(lineGroup)
    var meshGroup = new THREE.Group() //轮廓Mesh组
    mapGroup.add(meshGroup)
    var lineGroup2 = new THREE.Group() //边界线组 顶部
    mapGroup.add(lineGroup2)
    lineGroup.position.z = -0.01 //适当偏移解决深度冲突
    lineGroup2.position.z = 0.01 //适当偏移解决深度冲突

    // 加载数据
    const arr = []
    this.props.result.map((cur) =>
      arr.push({ name: `${cur.city}市`, value: Number(cur.score) })
    )
    const dataJson = JSON.stringify({ arr })

    loader.load(`data:,${dataJson}`, function (data) {
      var gdpObj = {} //每个省份的名字作为属性，属性值是国家对应GDP
      var color1 = new THREE.Color(0xffffff)
      var color2 = new THREE.Color(0xff8888) //GDP最高对应颜色
      var gdpMax = arr.reduce((acc, cur) => Math.max(acc, cur.value), 0) //设置一个基准值,以最高的gdp为准
      data.arr.forEach(function (obj) {
        var gdp = obj.value //当前省份GDP
        gdpObj[obj.name] = gdp //每个省份的名字作为属性，属性值是国家对应GDP
      })

      //  加载 "省份.json"，结构和./china.json 一样，地级市对应省份
      const region = JSON.parse(localStorage.getItem('user_key')).region
      const mapname = region.toString().substring(0, 3)

      const mapData = mapurl[`${mapname}`]
      // const mapData = require(`../../assets/maps/${mapname}.json`)
      loader.load(mapData, function (data2) {
        // 设置地图中心经纬度
        // lng = data2.features[0].properties.center[0]
        // lat = data2.features[0].properties.center[1]

        // 访问所有子行政区(地级市)边界坐标数据：data.features
        data2.features.forEach(function (area) {
          // "Polygon"：省份area有一个封闭轮廓
          //"MultiPolygon"：省份area有多个封闭轮廓
          if (area.geometry.type === 'Polygon') {
            // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
            area.geometry.coordinates = [area.geometry.coordinates]
          }
          var name = area.properties.name //地级市名
          // height：行政区轮廓拉伸高度，和gdp大小正相关，不过注意相机渲染范围(或者说地图尺寸范围)
          var height = gdpObj[name] / 50 //拉伸高度
          var mesh = ExtrudeMesh(area.geometry.coordinates, height)
          mesh.name = name //设置mesh对应的地级市名字
          meshGroup.add(mesh) //地级市轮廓拉伸Mesh插入组对象mapGroup
          // 颜色插值计算
          var color = color1
            .clone()
            .lerp(color2.clone(), gdpObj[mesh.name] / gdpMax)
          mesh.material.color.copy(color)
          mesh.gdp = gdpObj[mesh.name] //mesh自定义一个gdp属性，用于标签设置
          mesh.color = color //记录下自身的颜色，以便选中改变mesh颜色的时候，不选中状态再改变回来

          // 解析所有封闭轮廓边界坐标area.geometry.coordinates
          var line = borderline(area.geometry.coordinates)
          lineGroup.add(line) //地级市边界轮廓插入组对象lineGroup
          var line2 = line.clone()
          line2.position.z = height //顶部边界线跟随轮廓拉伸高度保持一致
          lineGroup2.add(line2)
        })
      })
    })

    /**
     * 光源设置
     */
    // 平行光1
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.position.set(400, 200, 300)
    scene.add(directionalLight)
    // 平行光2
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight2.position.set(-400, -200, -300)
    scene.add(directionalLight2)
    //环境光
    var ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    //three.js辅助坐标系
    var axesHelper = new THREE.AxesHelper(300)
    scene.add(axesHelper)
    /**
     * 相机设置
     */
    var width = this.state.width //窗口宽度
    var height = this.state.height //窗口高度
    var k = width / height //窗口宽高比
    // var s = 200;
    var s = 3 //根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    // camera.position.set(200, 300, 200); //设置相机位置
    // camera.position.set(113.51, 33.87, 200); //沿着z轴观察
    // 通过OrbitControls在控制台打印相机位置选择一个合适的位置

    var center = new THREE.Vector3()
    setTimeout(() => {
      //包围盒计算
      var box3 = new THREE.Box3()
      box3.expandByObject(meshGroup)
      var scaleV3 = new THREE.Vector3()
      box3.getSize(scaleV3)

      box3.getCenter(center)
      camera.position.set(center.x, center.y, 200)
      camera.lookAt(center.x, center.y, 0) //指向地图的几何中心
    }, 600)

    /**
     * 创建渲染器对象
     */
    var renderer = new THREE.WebGLRenderer({
      antialias: true, //开启锯齿
      alpha: true,
    })
    renderer.setSize(width, height) //设置渲染区域尺寸
    renderer.setClearColor(0xeeeeee, 0.0) //设置背景颜色
    // console.log(document.querySelector('#mapchart>canvas'))
    const oldNode = document.querySelector('#mapchart > canvas')
    if (oldNode) {
      this.threeRef.current.removeChild(oldNode)
    }
    this.threeRef.current.appendChild(renderer.domElement) //body元素中插入canvas对象

    // 渲染函数
    function render() {
      //渲染场景中的HTMl元素包装成的CSS2模型对象
      labelRenderer.render(scene, camera)
      renderer.render(scene, camera) //执行渲染操作
      requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
    }
    render()
    //创建控件对象  控件可以监听鼠标的变化，改变相机对象的属性
    // 旋转、缩放用于代码调试

    var controls = new OrbitControls(camera, renderer.domElement)
    // 相机控件与.lookAt()无效( .target属性 )
    setTimeout(() => {
      controls.target.set(center.x, center.y, 0)
      controls.update() //update()函数内会执行camera.lookAt(controls.target)
    }, 600)

    /**
     * 射线投射器`Raycaster`的射线拾取选中网格模型对象函数choose()
     * 选中的网格模型变为半透明效果
     */
    var label = tag()
    scene.add(label) //标签插入场景中
    // console.log(label);
    var chooseMesh = null //标记鼠标拾取到的mesh
    function choose(event) {
      if (chooseMesh) {
        // 把上次选中的mesh设置为原来的颜色
        chooseMesh.material.color.copy(chooseMesh.color)
      } else {
        label.element.style.visibility = 'hidden' //没有选中mesh，隐藏标签
      }
      var Sx = event.clientX - renderer.domElement.getBoundingClientRect().left //鼠标单击位置横坐标
      var Sy = event.clientY - renderer.domElement.getBoundingClientRect().top //鼠标单击位置纵坐标
      //屏幕坐标转WebGL标准设备坐标
      var x = (Sx / renderer.domElement.offsetWidth) * 2 - 1 //WebGL标准设备横坐标
      var y = -(Sy / renderer.domElement.offsetHeight) * 2 + 1 //WebGL标准设备纵坐标
      //创建一个射线投射器`Raycaster`
      var raycaster = new THREE.Raycaster()
      //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      //返回.intersectObjects()参数中射线选中的网格模型对象
      // 未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
      var intersects = raycaster.intersectObjects(meshGroup.children)
      // console.log("射线器返回的对象", intersects);
      // console.log("射线投射器返回的对象 点point", intersects[0].point);
      // console.log("射线投射器的对象 几何体",intersects[0].object.geometry.vertices)
      // intersects.length大于0说明，说明选中了模型
      if (intersects.length > 0) {
        chooseMesh = intersects[0].object
        chooseMesh.material.color.set(0x00ffff) //选中改变颜色
        // 根据鼠标位置设置标签位置(射线与mesh表面相交点世界坐标intersects[0].point)
        // intersects[0].point.y+=0.5;//偏移
        label.position.copy(intersects[0].point)
        // console.log(chooseMesh.center)
        label.element.innerHTML =
          chooseMesh.name + '评价得分：' + chooseMesh.gdp.toFixed(2)
        label.element.style.visibility = 'visible'
      } else {
        chooseMesh = null
      }
    }
    // addEventListener('click', choose); // 监听窗口鼠标单击事件
    window.addEventListener('mousemove', choose) // 监听窗口鼠标滑动事件
  }

  // 气泡图
  renderBubble = () => {
    /**
     * 创建场景对象Scene
     */
    var scene = new THREE.Scene()
    //three.js文件加载类FileLoader：封装了XMLHttpRequest
    var loader = new THREE.FileLoader()
    loader.setResponseType('json')
    // 组对象mapGroup是所有国家边界Line模型的父对象
    var mapGroup = new THREE.Group()
    scene.add(mapGroup)
    var lineGroup = new THREE.Group() //边界线组
    mapGroup.add(lineGroup)
    var meshGroup = new THREE.Group() //轮廓Mesh组
    mapGroup.add(meshGroup)
    lineGroup.position.z += 0.1 //适当偏移解决深度冲突

    //  加载./china.json，结构和world.json 一样，省份对应国家
    const region = JSON.parse(localStorage.getItem('user_key')).region
    const mapname = region.toString().substring(0, 3)
    const mapData = mapurl[`${mapname}`]

    const city_cdn = {}

    loader.load(mapData, function (data) {
      // 访问所有省份边界坐标数据：data.features
      data.features.forEach(function (area) {
        city_cdn[area.properties.name] = area.properties.center
        // "Polygon"：省份area有一个封闭轮廓
        //"MultiPolygon"：省份area有多个封闭轮廓
        if (area.geometry.type === 'Polygon') {
          // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
          area.geometry.coordinates = [area.geometry.coordinates]
        }
        // 解析所有封闭轮廓边界坐标area.geometry.coordinates
        lineGroup.add(bubbleline(area.geometry.coordinates)) //省份边界轮廓插入组对象mapGroup
        meshGroup.add(shapeMesh(area.geometry.coordinates)) //省份轮廓Mesh插入组对象mapGroup
      })
      return city_cdn
    })

    var cirGroup = new THREE.Group()
    cirGroup.position.z = 0.2 //适当偏移，以免深度冲突
    scene.add(cirGroup)

    //加载数据
    let dataJson = {}
    setTimeout(() => {
      const arr = []
      // console.log(this.props.dataset)
      this.props.dataset.map((cur) =>
        arr.push({
          name: `${cur.city}市`,
          value: Number(cur['地区生产总值（亿元）']),
          coordinate: city_cdn[`${cur.city}市`],
        })
      )
      dataJson = JSON.stringify({ arr })
      loadData()
    }, 200)
    // ./数据.json包含城市的经纬度坐标和对应的PM2.5值
    const loadData = () =>
      loader.load(`data:,${dataJson}`, function (data) {
        // GDP最高对应红色，GDP最低对应白色
        var color1 = new THREE.Color(0x00ffcc) //0x00ffc
        var color2 = new THREE.Color(0xff6666) //0xff6666

        var pmArr = [] //所有pm2.5数据集合
        data.arr.forEach(function (obj) {
          var pm25 = obj.value //访问数据PM2.5值
          pmArr.push(pm25)
        })
        pmArr.sort(compareNum)
        // console.log('排序后pm2.5',pmArr);
        var Max = pmArr[pmArr.length - 1] //PM2.5最大值作为基准值
        data.arr.forEach(function (obj) {
          var pm25 = obj.value
          // 颜色插值计算
          var color = color1.clone().lerp(color2.clone(), pm25 / Max)
          // 气泡大小和pm2.5正相关，同时注意根据相机渲染范围来设置合适大小
          var mesh = cirMesh(
            obj.coordinate[0],
            obj.coordinate[1],
            (pm25 / Max) * 0.5,
            color.getHex()
          )
          cirGroup.add(mesh)
          mesh.name = obj.name
          mesh.pm25 = pm25 //mesh自定义一个gdp属性，用于标签设置
          mesh.coordinate = obj.coordinate //用于控制标签位置
          mesh.color = color //记录下自身的颜色，以便选中改变mesh颜色的时候，不选中状态再改变回来
        })
      })
    // 数组排序规则
    function compareNum(num1, num2) {
      if (num1 < num2) {
        return -1
      } else if (num1 > num2) {
        return 1
      } else {
        return 0
      }
    }
    //three.js辅助坐标系
    var axesHelper = new THREE.AxesHelper(300)
    scene.add(axesHelper)
    /**
     * 相机设置
     */
    var width = this.state.width //窗口宽度
    var height = this.state.height //窗口高度
    var k = width / height //窗口宽高比
    // var s = 200;
    var s = 3 //根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    // camera.position.set(200, 300, 200); //设置相机位置

    var center = new THREE.Vector3()
    setTimeout(() => {
      //包围盒计算
      var box3 = new THREE.Box3()
      box3.expandByObject(meshGroup)
      var scaleV3 = new THREE.Vector3()
      box3.getSize(scaleV3)

      box3.getCenter(center)
      camera.position.set(center.x, center.y, 200) //沿着z轴观察
      camera.lookAt(center.x, center.y, 0) //指向地图的几何中心
    }, 500)
    //  camera.position.set(104, 35, 200)
    //  camera.lookAt(104, 35, 0) //指向中国地图的几何中心
    /**
     * 创建渲染器对象
     */
    var renderer = new THREE.WebGLRenderer({
      antialias: true, //开启锯齿
    })
    renderer.setSize(width, height) //设置渲染区域尺寸
    renderer.setClearColor(0xeeeeee, 0.0) //设置背景颜色
    const oldNode = document.querySelector('#mapchart > canvas')
    if (oldNode) {
      this.threeRef.current.removeChild(oldNode)
    }
    this.threeRef.current.appendChild(renderer.domElement) //body元素中插入canvas对象

    // 渲染函数
    function render() {
      //渲染场景中的HTMl元素包装成的CSS2模型对象
      blabelRenderer.render(scene, camera)
      renderer.render(scene, camera) //执行渲染操作
      requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
    }
    render()
    //创建控件对象  控件可以监听鼠标的变化，改变相机对象的属性
    // 旋转、缩放用于代码调试

    var controls = new OrbitControls(camera, renderer.domElement)
    // 相机控件与.lookAt()无效( .target属性 )
    setTimeout(() => {
      controls.target.set(center.x, center.y, 0)
      controls.update() //update()函数内会执行camera.lookAt(controls.target)
    }, 600)
    /**
     * 射线投射器`Raycaster`的射线拾取选中网格模型对象函数choose()
     * 选中的网格模型变为半透明效果
     */
    var pm = document.getElementById('pm')
    var city = document.getElementById('city')
    var div = document.getElementById('tag')
    var label = btag(div)
    scene.add(label) //标签插入场景中
    var chooseMesh = null //标记鼠标拾取到的mesh
    function choose(event) {
      if (chooseMesh) {
        // 把上次选中的mesh设置为原来的颜色
        chooseMesh.material.color.copy(chooseMesh.color)
      } else {
        label.element.style.visibility = 'hidden' //没有选中mesh，隐藏标签
      }
      var Sx = event.clientX - renderer.domElement.getBoundingClientRect().left //鼠标单击位置横坐标
      var Sy = event.clientY - renderer.domElement.getBoundingClientRect().top //鼠标单击位置纵坐标
      //屏幕坐标转WebGL标准设备坐标
      var x = (Sx / renderer.domElement.offsetWidth) * 2 - 1 //WebGL标准设备横坐标
      var y = -(Sy / renderer.domElement.offsetHeight) * 2 + 1 //WebGL标准设备纵坐标
      //创建一个射线投射器`Raycaster`
      var raycaster = new THREE.Raycaster()
      //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      //返回.intersectObjects()参数中射线选中的网格模型对象
      // 未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
      var intersects = raycaster.intersectObjects(cirGroup.children)
      // console.log("射线器返回的对象", intersects);
      // console.log("射线投射器返回的对象 点point", intersects[0].point);
      // intersects.length大于0说明，说明选中了模型
      if (intersects.length > 0) {
        chooseMesh = intersects[0].object
        chooseMesh.material.color.set(0x00ffff) //选中改变颜色
        label.position.set(
          chooseMesh.coordinate[0],
          chooseMesh.coordinate[1],
          0
        )
        // console.log(chooseMesh.name)
        pm.innerHTML = chooseMesh.pm25
        city.innerHTML = chooseMesh.name
        label.element.style.visibility = 'visible'
      } else {
        chooseMesh = null
      }
    }
    // addEventListener('click', choose); // 监听窗口鼠标单击事件
    window.addEventListener('mousemove', choose) // 监听窗口鼠标滑动事件
  }

  renderBar = () => {
    /**
     * 创建场景对象Scene
     */
    var scene = new THREE.Scene()
    //three.js文件加载类FileLoader：封装了XMLHttpRequest
    var loader = new THREE.FileLoader()
    loader.setResponseType('json')
    // 组对象mapGroup是所有国家边界Line模型的父对象
    var mapGroup = new THREE.Group()
    scene.add(mapGroup)
    var lineGroup = new THREE.Group() //边界线组
    mapGroup.add(lineGroup)
    var meshGroup = new THREE.Group() //轮廓Mesh组
    mapGroup.add(meshGroup)
    var extrudeHeight = 0.5 //地图轮廓拉伸高度
    lineGroup.position.z = extrudeHeight + extrudeHeight * 0.1 //适当偏移解决深度冲突

    // 加载数据
    const arr = []
    this.props.dataset.map((cur) =>
      arr.push({
        name: `${cur.city}市`,
        value: Number(cur['互联网宽带接入用户（万户）']),
      })
    )
    const dataJson = JSON.stringify({ arr })
    loader.load(`data:,${dataJson}`, function (data) {
      var gdpObj = {} //每个省份的名字作为属性，属性值是国家对应GDP
      var gdpMax = arr.reduce((acc, cur) => Math.max(acc, cur.value), 0) //设置一个基准值,以最高的广州gdp为准
      data.arr.forEach(function (obj) {
        var gdp = obj.value //当前省份GDP
        gdpObj[obj.name] = gdp //每个省份的名字作为属性，属性值是国家对应GDP
      })

      var prismGroup = new THREE.Group()
      prismGroup.position.z = extrudeHeight //适当偏移，以免深度冲突
      scene.add(prismGroup)

      //  加载地理位置json，省份对应国家
      const region = JSON.parse(localStorage.getItem('user_key')).region
      const mapname = region.toString().substring(0, 3)
      const mapData = mapurl[`${mapname}`]

      loader.load(mapData, function (data2) {
        var color1 = new THREE.Color(0xffff00)
        var color2 = new THREE.Color(0xff0000) //最大数值对应柱子颜
        // 访问所有省份边界坐标数据：data.features
        data2.features.forEach(function (area) {
          // "Polygon"：省份area有一个封闭轮廓
          //"MultiPolygon"：省份area有多个封闭轮廓
          if (area.geometry.type === 'Polygon') {
            // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
            area.geometry.coordinates = [area.geometry.coordinates]
          }
          // 解析所有封闭轮廓边界坐标area.geometry.coordinates
          lineGroup.add(barline(area.geometry.coordinates)) //省份边界轮廓插入组对象mapGroup
          // height：根据行政区尺寸范围设置，比如高度设置为地图尺寸范围的2%、5%等，过小感觉不到高度，过大太高了
          var height = extrudeHeight //拉伸高度
          meshGroup.add(ExtrudeMesh(area.geometry.coordinates, height)) //省份轮廓拉伸Mesh插入组对象mapGroup

          var name = area.properties.name //省份名
          if (name) {
            var gdp = gdpObj[name]
            if (gdp === undefined) console.log(area.properties)
            var center = area.properties.center //行政区几何中心经纬度坐标
            // console.log(name,gdp,center)
            // 颜色插值计算
            var color = color1.clone().lerp(color2.clone(), gdp / gdpMax)
            var barHeight = (gdp / gdpMax) * 5
            var mesh = prismMesh(
              center[0],
              center[1],
              0.3,
              barHeight,
              color.getHex()
            )
            prismGroup.add(mesh)

            // 柱子上方标注标签
            var tag2D = batag(name, gdp)
            //  var center = area.properties.center //行政区几何中心经纬度坐标
            tag2D.position.set(center[0], center[1], barHeight - extrudeHeight)
            scene.add(tag2D)
            setTimeout(() => {
              scene.remove(tag2D)
            }, 10000)
          }
        })
        // 地图底部边界线
        var lineGroup2 = lineGroup.clone()
        mapGroup.add(lineGroup2)
        lineGroup2.position.z = -extrudeHeight * 0.1 //适当偏移解决深度冲突
      })
    })

    /**
     * 光源设置
     */
    // 平行光1
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.position.set(400, 200, 300)
    scene.add(directionalLight)
    // 平行光2
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight2.position.set(-400, -200, -300)
    scene.add(directionalLight2)
    //环境光
    var ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    //three.js辅助坐标系
    var axesHelper = new THREE.AxesHelper(300)
    scene.add(axesHelper)
    /**
     * 相机设置
     */
    var width = this.state.width //窗口宽度
    var height = this.state.height //窗口高度
    var k = width / height //窗口宽高比
    // var s = 200;
    var s = 3 //根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    // camera.position.set(200, 300, 200); //设置相机位置
    // camera.position.set(104, 35, 200); //沿着z轴观察
    // 通过OrbitControls在控制台打印相机位置选择一个合适的位置
    var center = new THREE.Vector3()
    setTimeout(() => {
      //包围盒计算
      var box3 = new THREE.Box3()
      box3.expandByObject(meshGroup)
      var scaleV3 = new THREE.Vector3()
      box3.getSize(scaleV3)
      box3.getCenter(center)
      camera.position.set(center.x, center.y, 200)
      camera.lookAt(center.x, center.y, 0) //指向地图的几何中心
    }, 500)
    // var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1500);
    // // 根据渲染范围或说地图范围设置相机的距离
    // // camera.position.set(104, 35, 50);//沿着z轴方向
    // camera.position.set(104, 35-25, 40);
    // camera.lookAt(104, 35, 0);
    /**
     * 创建渲染器对象
     */
    var renderer = new THREE.WebGLRenderer({
      antialias: true, //开启锯齿
    })
    renderer.setSize(width, height) //设置渲染区域尺寸
    renderer.setClearColor(0xeeeeee, 0.0) //设置背景颜色
    const oldNode = document.querySelector('#mapchart > canvas')
    if (oldNode) {
      this.threeRef.current.removeChild(oldNode)
    }
    this.threeRef.current.appendChild(renderer.domElement) //body元素中插入canvas对象

    // 渲染函数
    function render() {
      //渲染场景中的HTMl元素包装成的CSS3模型对象
      labelRenderer.render(scene, camera)
      renderer.render(scene, camera) //执行渲染操作
      requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
      // console.log(camera.position);
    }
    render()
    //创建控件对象  控件可以监听鼠标的变化，改变相机对象的属性
    // 旋转、缩放用于代码调试

    var controls = new OrbitControls(camera, renderer.domElement)
    // 相机控件与.lookAt()无效( .target属性 )
    setTimeout(() => {
      controls.target.set(center.x, center.y, 0)
      controls.update() //update()函数内会执行camera.lookAt(controls.target)
    }, 600)
  }

  handleChange = (value) => {
    // 获取value
    this.setState({
      charttype: `${value}`,
    })
  }

  render() {
    return (
      <div className='mapcontent'>
        <div>
          <Select
            defaultValue='fill'
            bordered={false}
            style={{ color: '#0ff' }}
            onChange={this.handleChange}
          >
            <Option value='bubble'>气泡图</Option>
            <Option value='bar'>柱状图</Option>
            <Option value='fill'>填充图</Option>
          </Select>
        </div>
        <div id='mapchart' ref={this.threeRef}></div>
        <div
          id='tag'
          style={{
            visibility: 'hidden',
            color: '#ffffff',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '6px 16px',
            borderRadius: '5px',
          }}
        >
          <div>
            <span>城市：</span>
            <span id='city' style={{ color: '#00ffff' }}>
              郑州
            </span>
          </div>
          <div
            style={{
              height: '1px',
              background: 'rgb(190, 190, 190)',
              marginTop: '4px',
              marginBottom: '4px',
            }}
          ></div>
          <div>
            <span>地区生产总值：</span>
            <span id='pm' style={{ color: '#00ffff' }}>
              19
            </span>
            <span>亿元</span>
          </div>
        </div>
      </div>
    )
  }
}

export default ThreeMapChart
