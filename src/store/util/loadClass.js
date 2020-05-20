import {
  Tile as TileLayer,
  Vector as VectorLayer,
  Heatmap as HeatmapLayer
} from 'ol/layer'
import {
  Projection,
  fromLonLat
} from 'ol/proj'
import WMTSTileGrid from 'ol/tilegrid/WMTS'

import {
  WMTS,
  BingMaps,
  Vector as VectorSource
} from 'ol/source'
import {
  Point,
  LineString,
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

import { GeoJSON } from 'ol/format'
import { unByKey } from 'ol/Observable'
import { getLength } from 'ol/sphere'

function readFeature (json) {
  return (new GeoJSON()).readFeature(json, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
}
function readFeatures (json) {
  return (new GeoJSON()).readFeatures(json, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
}
function bingmap (imagerySet, key) {
  return new TileLayer({
    source: new BingMaps({
      key,
      imagerySet,
      culture: 'zh-cn'
    })
  })
}
function wmts ({ url, ...param }) {
  console.log(url)
  const projection = new Projection({
    code: 'EPSG:3857',
    units: 'm',
    axisOrientation: 'neu'
  })
  const resolutions = [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.2985821416974068, 0.1492910708487034, 0.0746455354243517, 0.0373227677121758, 0.0186613838560879, 0.009330691928044, 0.004665345964022, 0.002332672982011, 0.0011663364910055, 5.831682455027E-4, 2.915841227514E-4, 1.457920613757E-4]
  const matrixIds = ['EPSG:3857:0', 'EPSG:3857:1', 'EPSG:3857:2', 'EPSG:3857:3', 'EPSG:3857:4', 'EPSG:3857:5', 'EPSG:3857:6', 'EPSG:3857:7', 'EPSG:3857:8', 'EPSG:3857:9', 'EPSG:3857:10', 'EPSG:3857:11', 'EPSG:3857:12', 'EPSG:3857:13', 'EPSG:3857:14', 'EPSG:3857:15', 'EPSG:3857:16', 'EPSG:3857:17', 'EPSG:3857:18', 'EPSG:3857:19', 'EPSG:3857:20', 'EPSG:3857:21', 'EPSG:3857:22', 'EPSG:3857:23', 'EPSG:3857:24', 'EPSG:3857:25', 'EPSG:3857:26', 'EPSG:3857:27', 'EPSG:3857:28', 'EPSG:3857:29', 'EPSG:3857:30']
  const tileGrid = new WMTSTileGrid({
    tileSize: [256, 256],
    extent: [-2.003750834E7, -2.003750834E7, 2.003750834E7, 2.003750834E7],
    origins: [[-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.003750834E7], [-2.003750834E7, 2.0037508340000007E7], [-2.003750834E7, 2.0037508340000007E7], [-2.003750834E7, 2.0037508340000007E7], [-2.003750834E7, 2.0037517894628484E7], [-2.003750834E7, 2.0037513117314216E7], [-2.003750834E7, 2.0037508340000164E7], [-2.003750834E7, 2.0037508340000164E7], [-2.003750834E7, 2.0037508340000164E7], [-2.003750834E7, 2.0037508340000164E7], [-2.003750834E7, 2.0037508489287797E7], [-2.003750834E7, 2.00375083400036E7], [-2.003750834E7, 2.00375083400036E7]],
    resolutions,
    matrixIds
  })
  return new TileLayer({
    source: new WMTS({
      url,
      projection,
      tileGrid,
      layer: param.LAYER,
      matrixSet: param.TILEMATRIXSET,
      format: param.FORMAT,
      style: param.STYLE,
      wrapX: true
    })
  })
}
function heatmap ({ blur = 25, radius = 15 } = {}) {
  return new HeatmapLayer({
    zIndex: 1,
    source: new VectorSource(),
    blur,
    radius
  })
}

function vector (param = {}, styleFn, z) {
  return new VectorLayer({
    zIndex: z,
    source: new VectorSource(),
    style: styleFn ? styleFn.bind(null, style, param) : (Array.isArray(param) ? param.map(p => style(p)) : style(param))
  })
}

function pointFeature (coord = [0, 0], prop = {}) {
  return new Feature({ ...prop, geometry: new Point(coord) })
}

function lineFeature (coords, prop = {}) {
  return new Feature({ ...prop, geometry: new LineString(coords) })
}

function polygonFeature (coords, prop = {}) {
  return new Feature({ ...prop, geometry: new Polygon(coords) })
}
function multipolygonFeature (polygons, prop = {}) {
  const mp = new MultiPolygon(polygons)
  return new Feature({ ...prop, geometry: mp, center: mp.getInteriorPoints().getCoordinates()[0] })
}
function createGeom (coords, type) {
  type = type.toLowerCase()
  const map = {
    point: Point,
    linestring: LineString,
    polygon: Polygon,
    multipolygon: MultiPolygon
  }
  return new map[type](coords)
}
function setProp (geo, type) {
  return {
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
    minzoom: 10,
    zoom: 16
  }
}

function getCenter (coords, type) {
  if (type === 'polygon') {
    return new Polygon(coords).getInteriorPoint().getCoordinates()
  } else if (type === 'linestring') {
    return coords[parseInt(coords.length / 2)]
  } else if (type === 'point') {
    return coords
  } else if (type === 'multipolygon') {
    return new MultiPolygon(coords).getInteriorPoints().getCoordinates()[0]
  }
}
function GeoProp (geo, type) {
  const geotext = geo.geomsttext
  const output = setProp(geo, type)
  if (geo.subgisdatas.length) {
    // output.relative=geo.subgisdatas.map(v=>GeoProp(v,v.loadtemp))
  }
  if (type === 'multipolygon') {
    output.coords = [geotext.match(/(?<=\()[^()]*(?=\))/g).map(polygon => {
      return polygon.split(', ').map(point => {
        return fromLonLat(point.split(' ').map(parseFloat))
      })
    })]
    output.center = getCenter(output.coords, type)
    return pointFeature(output.center, output)
  } else if (type === 'polygon') {

  } else if (type === 'linestring') {

  } else if (type === 'point') {
    output.coords = fromLonLat(geotext.match(/\((.*)\)$/)[1].split(' ').map(parseFloat))
    output.center = getCenter(output.coords, type)
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
      lineJoin: param.LJ || 'round',
      lineCap: param.LC || 'round'
    }),
    image: param.IR ? new CircleStyle({
      radius: param.IR,
      fill: param.IFC && new Fill({
        color: param.IFC
      }),
      stroke: param.ISW && new Stroke({
        color: param.ISC,
        width: param.ISW
      })
    }) : param.icon ? new Icon({
      src: param.icon.url,
      scale: param.icon.scale || 1,
      rotation: param.icon.rotation || 0,
      rotateWithView: param.icon.RWV || false,
      anchor: param.icon.ac || [0.5, 0.5]
    }) : undefined,
    text: param.Text ? new Text({
      font: 'bold 12px Microsoft JhengHei',
      fill: param.TFC && new Fill({
        color: param.TFC
      }),
      stroke: param.TSC && new Stroke({
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
    }) : undefined
  }
  for (const k in config) {
    config[k] || delete config[k]
  }
  return new Style(config)
}
function getDistance (line, istrans) {
  const length = getLength(line)
  if (!istrans) return length
  return length > 1000 ? (Math.round(length / 1000 * 100) / 100) + ' ' + 'km' : (Math.round(length * 100) / 100) + ' ' + 'm'
}
function divideLine (line, step = 10) {
  if (!(line instanceof LineString))line = new LineString(line)
  const coords = []
  let origin = 0
  let divide
  line.forEachSegment(function (start, end) {
    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    const dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    const h = Math.atan2(dy, dx)
    const old = origin
    origin += dr
    if (origin < step) {

    } else {
      divide = parseInt(origin / step)
      origin = origin % step
      for (let i = 0, x, y; i < divide; i++) {
        if (i === 0) {
          x = start[0] + Math.cos(h) * (step - old)
          y = start[1] + Math.sin(h) * (step - old)
        } else {
          x = x + Math.cos(h) * step
          y = y + Math.sin(h) * step
        }
        coords.push({
          coord: [x, y],
          h: -parseFloat((h).toFixed(4))
        })
      }
    }
  })
  return coords
}
export default {
  divideLine,
  getDistance,
  unByKey,
  readFeature,
  readFeatures,
  createGeom,
  pointFeature,
  lineFeature,
  polygonFeature,
  multipolygonFeature,
  getCenter,
  setProp,
  GeoProp,
  style,
  vector,
  heatmap,
  wmts,
  bingmap
}
