import {
  Tile as TileLayer,
  Vector as VectorLayer,
  Heatmap as HeatmapLayer
} from 'ol/layer'
import {
  BingMaps,
  Vector as VectorSource
} from 'ol/source'
import {
  Point
} from 'ol/geom'
import {
  Circle as CircleStyle,
  Icon,
  Text,
  Fill,
  Stroke,
  Style
} from 'ol/style'
import Feature from 'ol/Feature'
// import {
//   getVectorContext
// } from 'ol/render'

function bingmap (imagerySet, key) {
  return new TileLayer({
    source: new BingMaps({
      key,
      imagerySet,
      culture: 'zh-cn'
    })
  })
}
function wtms () {

}
function vector (param = {}) {
  return new VectorLayer({
    source: new VectorSource(),
    style: style(param)
  })
}
function pointFeature (coord = [0, 0], prop = {}) {
  const point = new Point(coord)
  prop.geometry = point
  return new Feature(prop)
}
function style (param) {
  const config = {
    geometry: param.Geo,
    fill: param.FC && new Fill({
      color: param.FC
    }),
    stroke: param.SC && new Stroke({
      color: param.SC,
      width: param.SW || 2
    }),
    image: param.IR ? new CircleStyle({
      radius: param.IR,
      fill: new Fill({
        color: param.IFC
      }),
      stroke: new Stroke({
        color: param.ISC,
        width: param.ISW
      })
    }) : param.icon ? new Icon({
      src: param.icon.url,
      scale: param.icon.scale || 1,
      rotation: param.icon.rotation || 0,
      rotateWithView: param.icon.RWV || false
    }) : undefined,
    text: param.TFC && new Text({
      font: '12px Microsoft JhengHei',
      fill: Fill({
        color: param.TFC
      }),
      stroke: new Stroke({
        color: param.TSC,
        width: param.TSW
      }),
      scale: param.TSL || 1,
      offsetX: param.TOX || 0,
      offsetY: param.TOY || 0,
      textAlign: param.TA || 'center',
      backgroundFill: param.TBFC && new Fill({
        color: param.TBFC
      }),
      text: param.TCT || ''
    })
  }
  for (const k in config) {
    config[k] || delete config[k]
  }
  return new Style(config)
}
function heatmap (blur = 10, radius = 10) {
  return new HeatmapLayer({
    source: new VectorSource(),
    blur,
    radius
  })
}
export default {
  pointFeature,
  style,
  vector,
  heatmap,
  wtms,
  bingmap
}
