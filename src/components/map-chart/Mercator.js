//经纬度转墨卡托
export const getMercator = (poi) => {
  //[114.32894, 30.585748]
  var mercator = {}
  //半径
  var earthRad = 6378137.0
  //x轴
  mercator.x = ((poi.lng * Math.PI) / 180) * earthRad
  //y轴
  var a = (poi.lat * Math.PI) / 180
  mercator.y =
    (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))

  return mercator //[12727039.383734727, 3579066.6894065146]
}

//墨卡托转经纬度
export const getLngLat = (poi) => {
  var lnglat = {}
  lnglat.lng = (poi.x / 20037508.34) * 180
  var mmy = (poi.y / 20037508.34) * 180
  lnglat.lat =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2)
  return lnglat
}
