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
  Point,
  Polygon,
  MultiPolygon
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
import { fromLonLat } from 'ol/proj'
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

function vector (param = {}, styleFn) {
  return new VectorLayer({
    zIndex: 1,
    source: new VectorSource(),
    style: styleFn ? styleFn.bind(null, style, param) : style(param)
  })
}

function pointFeature (coord = [0, 0], prop = {}) {
  return new Feature({ ...prop, geometry: new Point(coord) })
}

function muPolygonFeature (polygons, prop = {}) {
  const mp = new MultiPolygon([polygons])
  return new Feature({ ...prop, geometry: mp, center: mp.getInteriorPoints().getCoordinates() })
}

function polygonFeature (coords, prop = {}) {
  return new Feature({ ...prop, geometry: new Polygon(coords) })
}
function GeoProp (geo, type) {
  const geotext = geo.geomsttext
  const output = {
    id: geo.gisid,
    name: geo.name,
    key: geo.data_key,
    type: geo.appobjname,
    layer: geo.appobjid,
    disable: geo.Disenable,
    state: geo.CallType,
    showType: geo.ShowTemp,
    geoType: type,
    maxzoom: 40,
    minzoom: 10
  }
  if (geo.subgisdatas.length) {
    // output.relative=geo.subgisdatas.map(v=>GeoProp(v,v.loadtemp))
  }
  if (type === 'multipolygon') {
    output.coords = geotext.match(/(?<=\()[^()]*(?=\))/g).map(polygon => {
      return polygon.split(', ').map(point => {
        return fromLonLat(point.split(' ').map(parseFloat))
      })
    })
    return muPolygonFeature(output.coords, output)
  } else if (type === 'polygon') {

  } else if (type === 'point') {
    output.coords = fromLonLat(geotext.match(/\((.*)\)$/)[1].split(' ').map(parseFloat))
    output.center = output.coords
    return pointFeature(output.coords, output)
  }
}
function style (param) {
  const config = {
    geometry: param.Geo,
    fill: param.FC && new Fill({
      color: param.FC
    }),
    stroke: param.SC && new Stroke({
      color: param.SC,
      width: param.SW || 2,
      lineDash: param.lineDash,
      lineJoin: param.LineJson || 'round',
      lineCap: param.lineCap || 'round'
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
  muPolygonFeature,
  polygonFeature,
  GeoProp,
  style,
  vector,
  heatmap,
  wtms,
  bingmap
}
