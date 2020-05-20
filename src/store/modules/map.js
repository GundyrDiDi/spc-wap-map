import Map from 'ol/Map'
import View from 'ol/View'
import { defaults, ScaleLine } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'
import loadClass from '../util/loadClass'
// import { getVectorContext } from 'ol/render'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    preloaded: false,
    bingKey: 'AoDg4R00J2io1dJw7mTF0iQ1CBNjROkFXSRBcxhgb3qKq4eCbNBYizRtVG_q-fZD',
    el: undefined,
    mymap: '',
    view: undefined,
    activeLayer: {
      tiles: undefined,
      applayers: undefined,
      ellayers: {}
    },
    staticlayer: {},
    dynamiclayer: {},
    dyData: [],
    tiles: {},
    applayers: {},
    ellayers: {},
    fullMap: false,
    deviceLocation: undefined,
    shouldRequest: true,
    mapExtent: [],
    zoom: 15,
    actLocation: undefined,
    tobottom: false,
    moving: false,
    icons: {},
    mapstatus: '',
    road: null,
    mark: null,
    measure: null,
    mspoints: []
  },
  getters: {
    deviceCoord (state) {
      if (state.deviceLocation) {
        const { longitude, latitude } = state.deviceLocation.coords
        return [longitude, latitude]
      }
      return [121.3183, 30.7149]
    },
    actlayarr (state) {
      const { applayers, ellayers } = state.activeLayer
      return [applayers, ...Object.values(ellayers)].filter(v => !!v)
    }
  },
  mutations: {
    switchLayer (state, { key, layer }) {
      const aclayer = state.activeLayer[key]
      if (aclayer) {
        if (aclayer === layer) {
          if (!aclayer.require) {
            aclayer.selected = false
            state.mymap.removeLayer(aclayer.layer)
            Vue.set(state.activeLayer, key, undefined)
          }
          return
        }
        aclayer.selected = false
        state.mymap.removeLayer(aclayer.layer)
      }
      layer.selected = true
      Vue.set(state.activeLayer, key, layer)
      state.mymap.addLayer(layer.layer)
    },
    addLayer (state, { key, layer }) {
      const aclayers = state.activeLayer[key]
      const i = aclayers[layer.appid]
      if (i) {
        layer.selected = false
        state.mymap.removeLayer(layer.layer)
        Vue.set(aclayers, layer.appid, undefined)
      } else {
        layer.selected = true
        Vue.set(aclayers, layer.appid, layer)
        state.mymap.addLayer(layer.layer)
      }
    },
    _movetoPoint ({ view }, { lonlat, coord, zoom, duration = 1000 }) {
      if (lonlat) {
        coord = fromLonLat(lonlat)
      }
      view.animate({
        center: coord || view.getCenter(),
        zoom: zoom || view.getZoom(),
        duration
      })
    }
  },
  actions: {
    _createOverlay (store, config) {
      const ol = new Overlay(config)
      store.state.mymap.addOverlay(ol)
      return ol
    },
    _setCurLocation ({ state }, coord) {
      coord = fromLonLat(coord)
      if (!state.curlocallayer) {
        state.curlocallayer = loadClass.vector(
          {
            icon: {
              url: state.icons.curIcon,
              scale: 0.7
            }
          }
        )
        state.curlocallayer.setMap(state.mymap)
        state.curlocation = loadClass.pointFeature(coord, {
          name: 'curCoord'
        })
        state.curlocallayer.getSource().addFeature(state.curlocation)
      } else {
        state.curlocation.getGeometry().setCoordinates(coord)
      }
    },
    // 标记
    _addtoCurlayer ({ state }, { url, text }) {
      const f = loadClass.pointFeature(state.view.getCenter())
      f.setStyle(loadClass.style({
        icon: {
          url,
          ac: [0.5, 1],
          scale: 0.5
        },
        Text: true,
        TCT: text.slice(0, 8) || '我的标记',
        TOY: 6,
        TSL: 0.7
      }))
      state.curlocallayer.getSource().addFeature(f)
    },
    setActLocation (store, loc) {
      const state = store.state
      if (!state.highlight) {
        state.highlight = loadClass.vector({
          FC: 'rgba(9,151,247,.3)',
          SC: 'rgba(237, 100, 100, .8)',
          SW: 1,
          lineDash: [6, 10],
          IR: 5,
          IFC: 'rgb(64, 124, 235)',
          ISW: 2,
          ISC: '#fff'
        })
        state.highlight.setMap(state.mymap)
        state.actFeature = new Feature()
        state.highlight.getSource().addFeature(state.actFeature)
      }
      if (state.actLocation && state.actLocation.dy) {
        state.actLocation.layer.layer.setVisible(true)
        state.actLocation.layer.layer.getSource().getFeatures().forEach(f => {
          const prop = f.getProperties()
          if (prop.id === state.actLocation.id) {
            f.set('h', state.actFeature.get('h'))
            f.setGeometry(state.actFeature.getGeometry())
          }
        })
        loadClass.unByKey(state.listen)
      }
      if (loc) {
        const { actFeature, highlight, view } = state
        if (loc.dy) {
          loc.layer = state.dynamiclayer[loc.layer]
          const { layer, param } = loc.layer
          const style = loadClass.style(param.normal)
          const defaultH = param.normal.defaultH
          layer.setVisible(false)
          state.listen = highlight.on('postrender', e => {
            const { time } = state.dyData
            const { source: points } = state.dyData[0].gisdatasource[0]
            const intime = e.frameState.time
            const t = Math.min(intime - time, 9999) + 1
            const sptime = Math.ceil(10000 / (points.length - 1))
            const index = Math.ceil(t / sptime)
            const radio = (t % sptime) / sptime
            const [x, y] = points[index].coord
            const [x1, y1] = points[index - 1].coord
            style.getImage().setRotation(defaultH + points[index].h)
            const geom = loadClass.createGeom([x + radio * (x - x1), y + radio * (y - y1)], 'point')
            // let vectorContext = getVectorContext(e)
            // vectorContext.setStyle(style)
            // vectorContext.drawGeometry(geom)
            actFeature.set('h', points[index].h)
            actFeature.setGeometry(geom)
            view.setCenter([x + radio * (x - x1), y + radio * (y - y1)])
          })
          actFeature.setStyle(style)
          actFeature.setGeometry(loc.geometry)
          // requestAnimationFrame(() => {
          //   store.commit('_movetoPoint', {
          //     coord: state.actFeature.getGeometry().getCoordinates(),
          //     duration: 600 ,zoom:15
          //   })
          // })
        } else {
          loc.layer = state.staticlayer[loc.layer]
          actFeature.setStyle(undefined)
          actFeature.setGeometry(
            loadClass.createGeom(loc.coords, loc.geoType)
          )
          requestAnimationFrame(() => {
            store.commit('_movetoPoint', { coord: loc.center, duration: 600 })
          })
        }
      } else {
        state.actFeature.setGeometry(loadClass.createGeom([0, 0], 'point'))
      }
      state.actLocation = loc
    },
    _fitActloc (store, options) {
      const loc = store.state.actLocation
      store.commit('_movetoPoint', {
        coord: loc.center,
        zoom: loc.zoom,
        ...options
      })
    },
    _getPixelExtent (store, size) {
      const { view } = store.state
      return view.calculateExtent(size)
    },
    _getDeviceDistance (store, size) {
      const { view } = store.state
      const ext = view.calculateExtent(size)
      return loadClass.getDistance(
        loadClass.createGeom([ext.slice(0, 2), ext.slice(2)], 'linestring')
      )
    },
    _switchTile (store, tile) {
      store.commit('switchLayer', { key: 'tiles', layer: tile })
    },
    _switchApplayer (store, layer) {
      store.commit('switchLayer', { key: 'applayers', layer })
      store.dispatch('requestData')
    },
    _addEllayer (store, layer) {
      store.commit('addLayer', { key: 'ellayers', layer })
      store.dispatch('requestData')
    },
    async loadIcons (store) {
      store.state.icons = await axios.get('/getmapicons')
    },
    async loadLayers (store) {
      const state = store.state
      const styleFn = function (style, param, feature) {
        const zoom = state.zoom
        param = param[feature.get('state') || 'normal']
        if (zoom > feature.get('maxzoom') || zoom < feature.get('minzoom')) {

        } else {
          if (Array.isArray(param)) {
            return param.map(v => {
              if (v.Text) {
                v.TCT = feature.get('name')
              }
              return style(v)
            })
          } else {
            if (param.Text) {
              param.TCT = feature.get('name')
            }
            if (param.Rotate) {
              param.icon.rotation = param.defaultH + feature.get('h')
            }
            return style(param)
          }
        }
      }
      const keys = {
        tiles: {
          arg: [state.bingKey],
          commit: ['switchLayer']
        },
        applayers: {
          arg: [styleFn, 1],
          commit: ['switchLayer']
        },
        ellayers: {
          arg: [styleFn, 2],
          commit: ['addLayer']
        }
      }
      await Promise.all(Object.keys(keys).map(async v => {
        const { arg, commit } = keys[v]
        const data = await axios.get('/get' + v)
        if (data.length) {
          data.forEach(l => {
            state[v][l.appid] = l
            l.layer = loadClass[l.loadType](l.param, ...arg)
            if (l.selected) {
              commit.forEach(c => {
                store.commit(c, { key: v, layer: l })
              })
            }
            if (l.dynamic === 1) {
              state.dynamiclayer[l.appid] = l
            } else if (l.dynamic === 0) {
              state.staticlayer[l.appid] = l
            }
          })
        }
      }))
    },
    _tileload (store) {
      let i = 0
      return new Promise(resolve => {
        ++i
        const timer = setInterval(() => {
          if (store.state.preloaded) {
            resolve(true)
            clearInterval(timer)
          } else {
            if (i === 50) {
              resolve(false)
              clearInterval(timer)
            }
          }
        }, 100)
      })
    },
    async _preload (store, { el }) {
      const state = store.state
      const view = new View({
        center: fromLonLat(store.getters.deviceCoord),
        zoom: 15,
        enableRotation: false
      })
      const map = new Map({
        target: el,
        view: view
      })
      const tiles = {
        arg: [state.bingKey]
      }
      const { arg } = tiles
      const data = await axios.get('/gettiles')
      let loading = 0; let loaded = 0
      if (data.length) {
        data.forEach(l => {
          if (l.selected) {
            const layer = loadClass[l.loadType](l.param, ...arg)
            const s = layer.getSource()
            const lis1 = s.on('tileloadstart', function () {
              ++loading
            })
            const lis2 = s.on('tileloadend', function () {
              ++loaded
              if (loaded === loading) {
                map.removeLayer(layer)
                state.preloaded = true
                loadClass.unByKey(lis1)
                loadClass.unByKey(lis2)
              }
            })
            map.addLayer(layer)
          }
        })
      }
    },
    async _init (store, { el }) {
      const state = store.state
      const getters = store.getters
      const view = new View({
        center: fromLonLat(getters.deviceCoord),
        zoom: 15,
        minZoom: 13.5,
        maxZoom: 19,
        enableRotation: false
        // constrainRotation:4
      })
      const map = new Map({
        target: el,
        view: view,
        controls: defaults({ attribution: false }).extend([
          new ScaleLine()
        ])
      })
      //
      view.on('change', ({ target: view }) => {
        state.moving = !state.moving
        state.tobottom = !state.tobottom
      })
      map.on('singleclick', e => {
        if (state.mapstatus) {

        } else {
          const f = map.forEachFeatureAtPixel(e.pixel, function (feature) {
            return feature
          }, {
            hitTolerance: 5,
            layerFilter (layer) {
              return getters.actlayarr.some(l => layer === l.layer)
            }
          })
          if (!f) {
            if (state.actLocation) {
              state.fullMap = false
              store.dispatch('setActLocation', null)
            } else {
              state.fullMap = !state.fullMap
            }
          } else {
            state.fullMap = false
            const prop = f.getProperties()
            store.dispatch('setActLocation', prop)
          }
        }
      })
      map.on('moveend', () => {
        state.mapExtent = view.calculateExtent(map.getSize())
        state.zoom = view.getZoom()
        if (state.shouldRequest) {
          store.dispatch('requestData')
        }
      })
      state.el = el
      state.mymap = map
      state.view = view
      //
      await store.dispatch('loadLayers')
      await store.dispatch('loadIcons')
      await store.dispatch('requestData')
      store.dispatch('intervalRequest')
    },
    intervalRequest ({ state }) {
      let i = 0; const time = 10000
      const request = async () => {
        const { mapExtent: extent, zoom } = state
        const now = Date.now()
        state.dyData = await axios.post('/getdydata', { i: (i++) % 4, extent, zoom })
        state.dyData.time = now
        Object.values(state.dynamiclayer).forEach(l => {
          l.layer.getSource().clear()
        })
        state.dyData.forEach(dy => {
          const s = state.dynamiclayer[dy.appid].layer.getSource()
          const fs = dy.gisdatasource.map(v => {
            return loadClass.pointFeature(v.source[0].coord, {
              name: v.name,
              h: v.source[0].h,
              layer: 'gwc',
              id: v.id,
              dy: true,
              type: '公务车'

            })
          })
          s.addFeatures(fs)
        })
      }
      request()
      setInterval(request, time)
    },
    async requestData (store) {
      const state = store.state
      const { mapExtent: extent, zoom } = state
      const gisData = await axios.post('/getgisdata', { extent, zoom })
      // console.log(gisData);
      Object.values(state.staticlayer).forEach(l => {
        l.layer.getSource().clear()
      })
      gisData.forEach(gis => {
        const l = state.staticlayer[gis.appid]
        const source = l.layer.getSource()
        let features
        if (l.loadFeature.type === 'geojson') {
          features = loadClass.readFeatures(gis.gisdatasource)
          features.forEach(f => {
            gis.CallType = ['normal', 'gold', 'red'][parseInt(3 * Math.random())]
            const output = loadClass.setProp(gis, gis.loadtemp)
            output.coords = f.getGeometry().getCoordinates()
            output.center = loadClass.getCenter(output.coords, gis.loadtemp)
            f.setProperties(output)
          })
        } else {
          features = gis.gisdatasource.map(v => loadClass.GeoProp(v, gis.loadtemp))
        }
        features.length && source.addFeatures(features)
      })
      store.dispatch('requestAlertData')
    },
    async requestAlertData (store) {

    },
    async _loadLocation (store, item) {
      return await axios.get('/loadLocation')
    },
    _showMeasure ({ state }) {
      let { mymap, measure } = state
      if (!measure) {
        measure = state.measure = loadClass.vector({
          icon: {
            url: state.icons.mspIcon,
            scale: 0.6
          },
          SC: '#0064dc',
          SW: '5'
        }, null, 2)
      }
      const source = measure.getSource()
      if (measure.selected) {
        state.mspoints = []
        measure.selected = false
        measure.getSource().clear()
        measure.setMap(undefined)
        loadClass.unByKey(state.listen)
      } else {
        measure.selected = true
        measure.setMap(mymap)
        state.listen = mymap.on('singleclick', e => {
          const coord = e.coordinate
          const f = loadClass.pointFeature(coord)
          if (!state.mspoints.length) {
            state.mspoints.line = loadClass.lineFeature([coord])
            source.addFeature(state.mspoints.line)
            f.setStyle([
              loadClass.style({
                icon: {
                  url: state.icons.mspIcon,
                  scale: 0.6
                },
                SC: '#0064dc',
                SW: '5'
              }),
              loadClass.style({
                icon: {
                  url: state.icons.roadsIcon,
                  scale: 0.6,
                  ac: [0.5, 1]
                }
              })
            ])
          }
          source.addFeature(f)
          coord.f = f
          state.mspoints.push(coord)
        })
      }
    },
    _getDistance (store, line) {
      return loadClass.getDistance(line, true)
    },
    _clearMeasure ({ state }) {
      state.mspoints = []
      state.measure.getSource().clear()
    },
    _showMark ({ state }) {
      let { view, mymap, mark } = state
      if (!mark) {
        mark = state.mark = loadClass.vector({
          icon: {
            url: state.icons.curIcon,
            scale: 0.4
          }
        }, null, 2)
        state.markft = loadClass.pointFeature(view.getCenter())
        mark.getSource().addFeature(state.markft)
      }
      function handlemove (f, view) {
        f.getGeometry().setCoordinates(view.getCenter())
      }
      if (mark.selected) {
        mark.selected = false
        mark.setMap(undefined)
        loadClass.unByKey(state.listen)
      } else {
        mark.selected = true
        mark.setMap(mymap)
        handlemove(state.markft, view)
        state.listen = view.on('change', handlemove.bind(null, state.markft, view))
      }
    },
    async _showRoad ({ state, rootState }) {
      let { road, mymap, view } = state
      if (!road) {
        road = state.road = loadClass.vector({
          line: {
            SC: '#03b97e',
            SW: 8
          },
          start: {
            icon: {
              url: state.icons.roadsIcon,
              scale: 0.5,
              ac: [0.5, 1]
            }
          },
          end: {
            icon: {
              url: state.icons.roadeIcon,
              scale: 0.5,
              ac: [0.5, 1]
            }
          },
          arrow: {
            icon: {
              url: state.icons.lfarwIcon,
              scale: 0.4
            }
          }
        }, function (style, param, feature) {
          const type = feature.get('type') || 'line'
          if (type === 'arrow') {
            param[type].icon.rotation = -feature.get('h')
          }
          return style(param[type])
        })
        const roadData = await axios.get('/getRoadJson')
        state.roadft = loadClass.readFeature(roadData)
      }
      if (road.selected) {
        road.getSource().clear()
        mymap.removeLayer(road)
        road.selected = false
      } else {
        let line = []
        const g = state.roadft.getGeometry()
        let origin = 0
        let divide = 1
        const radio = 500
        g.forEachSegment(function (start, end) {
          const dx = end[0] - start[0]
          const dy = end[1] - start[1]
          const dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
          const h = Math.atan2(dy, dx)
          const old = origin
          origin += dr
          if (origin < radio) {

          } else {
            divide = parseInt(origin / radio)
            origin = origin % radio
            for (let i = 0, x, y; i < divide; i++) {
              if (i === 0) {
                x = start[0] + Math.cos(h) * (radio - old)
                y = start[1] + Math.sin(h) * (radio - old)
              } else {
                x = x + Math.cos(h) * radio
                y = y + Math.sin(h) * radio
              }
              line.push({
                coord: [x, y],
                h: h
              })
            }
          }
        })
        const start = loadClass.pointFeature(g.getFirstCoordinate(), { type: 'start' })
        const end = loadClass.pointFeature(g.getLastCoordinate(), { type: 'end' })
        line = line.map(v => loadClass.pointFeature(v.coord, { type: 'arrow', h: v.h }))
        road.getSource().addFeatures([
          state.roadft,
          start,
          end,
          ...line
        ])
        mymap.addLayer(state.road)
        road.selected = true
        view.fit(g, {
          size: [rootState.deviceWidth, rootState.deviceHeight],
          duration: 500,
          padding: [30, 30, 30, 30]
        })
      }
    },
    _clearactlay ({ state, getters }) {
      getters.actlayarr.forEach(v => {
        state.mymap.removeLayer(v.layer)
      })
    },
    _addactlay ({ state, getters }) {
      getters.actlayarr.forEach(v => {
        state.mymap.addLayer(v.layer)
      })
    },
    _getdata (store) {
      // let a='13505503.699908512,3595087.923266666,13505599.246193867,3595098.6722237687,13505534.094862606,3595561.467464135,13504560.571090559,3595421.6489335056,13504597.595276134,3595135.0100774365,13505415.067178372,3595250.368192209'
      // a=a.split(',')
      // let arr=[]
      // for(let i=0;i<a.length;i+=2){
      //   arr.push([parseInt(a[i]),parseInt(a[i+1])])
      // }
      // arr=loadClass.divideLine(arr);
      // let temp=[]
      // for(let i=0;i<4;i++){
      //   let a=parseInt(arr.length/4)
      //   temp.push(arr.slice(i*a,(i+1)*a))
      // }
      // console.log(JSON.stringify(temp));
      // setTimeout(()=>{
      //   arr.forEach(v=>{
      //     store.state.curlocallayer.getSource().addFeature(loadClass.pointFeature(v.coord))
      //   })
      // },3000)
    }
  }
}
