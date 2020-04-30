import Map from 'ol/Map'
import View from 'ol/View'
import { defaults, ScaleLine } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'
import loadClass from '../util/loadClass'

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
    tiles: {},
    applayers: {},
    ellayers: {},
    fullMap: false,
    deviceLocation: undefined,
    shouldRequest: true,
    mapExtent: [],
    zoom: 15,
    gisData: {},
    actLocation: undefined,
    tobottom: false,
    icons: {}
  },
  getters: {
    deviceCoord (state) {
      if (state.deviceLocation) {
        const { longitude, latitude } = state.deviceLocation.coords
        return [longitude, latitude]
      }
      return [121.3183, 30.7149]
    },
    staticlayer (state) {
      return { ...state.ellayers, ...state.applayers }
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
            state.activeLayer[key] = undefined
          }
          return
        }
        aclayer.selected = false
        state.mymap.removeLayer(aclayer.layer)
      }
      layer.selected = true
      state.activeLayer[key] = layer
      state.mymap.addLayer(layer.layer)
    },
    addLayer (state, { key, layer }) {
      const aclayers = state.activeLayer[key]
      const i = aclayers[layer.appid]
      if (i) {
        layer.selected = false
        state.mymap.removeLayer(layer.layer)
        delete aclayers[layer.appid]
      } else {
        layer.selected = true
        aclayers[layer.appid] = layer
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
      // state.highlight.getSource().clear()
      if (loc) {
        loc.layer = store.getters.staticlayer[loc.layer]
        state.actFeature.setGeometry(
          loadClass.createGeom(loc.coords, loc.geoType)
        )
        requestAnimationFrame(() => {
          store.commit('_movetoPoint', { coord: loc.center, duration: 600 })
        })
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
    _fitPort (store, size) {
      // const { mymap: map, view } = store.state
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
        param = param.normal
        if (param.Text) {
          param.TCT = feature.get('name')
        }
        if (zoom > feature.get('maxzoom') || zoom < feature.get('minzoom')) {

        } else {
          return style(param)
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
      let loading = 0; let loaded = 0
      const data = await axios.get('/gettiles')
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
                s.un('tileloadstart', lis1)
                s.un('tileloadend', lis2)
                map.removeLayer(layer)
                state.preloaded = true
              }
            })
            map.addLayer(layer)
          }
        })
      }
    },
    async _init (store, { el }) {
      const state = store.state
      const view = new View({
        center: fromLonLat(store.getters.deviceCoord),
        zoom: 15,
        minZoom: 12,
        maxZoom: 20,
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
        state.tobottom = !state.tobottom
      })
      map.on('singleclick', e => {
        const f = map.forEachFeatureAtPixel(e.pixel, function (feature) {
          return feature
        }, {
          hitTolerance: 5,
          layerFilter (layer) {
            return [state.highlight, state.curlocallayer].every(l => {
              return layer !== l
            })
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
          store.dispatch('setActLocation', f.getProperties())
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
    },
    async requestData (store) {
      const state = store.state
      const { mapExtent: extent, zoom } = state
      let gisData = await axios.post('/getgisdata', { extent, zoom })
      gisData = gisData.reduce((acc, v) => {
        acc[v.appid] = v
        return acc
      }, {})
      // console.log(gisData)
      Object.entries(store.getters.staticlayer).forEach(([appid, l]) => {
        const layer = l.layer
        const source = layer.getSource()
        source.clear()
        const gis = gisData[appid]
        if (gis) {
          // 等所有图层清空后添加
          Promise.resolve().then(() => {
            const features = gis.gisdatasource.map(v => loadClass.GeoProp(v, gis.loadtemp))
            features.length && source.addFeatures(features)
          })
        }
      })
      await store.dispatch('requestAlertData')
    },
    async requestAlertData (store) {

    },
    async _loadLocation (store, item) {
      return await axios.get('/loadLocation')
    },
    async _getdata () {
      // console.log(JSON.stringify((await axios.get('/getdata')).objitemlist[1]));
      // console.log(await axios.get('/getdata'));
    }
  }
}
