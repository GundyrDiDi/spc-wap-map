import Map from 'ol/Map'
import View from 'ol/View'
import { defaults, ScaleLine } from 'ol/control'
import { fromLonLat } from 'ol/proj'

import loadClass from '../util/loadClass'

export default {
  namespaced: true,
  state: {
    bingKey: 'AoDg4R00J2io1dJw7mTF0iQ1CBNjROkFXSRBcxhgb3qKq4eCbNBYizRtVG_q-fZD',
    el: undefined,
    mymap: '',
    view: undefined,
    activeLayer: {
      tiles: undefined,
      applayers: undefined,
      ellayers: []
    },
    tiles: [],
    applayers: [],
    ellayers: [],
    fullMap: false,
    deviceLocation: undefined
  },
  getters: {
    deviceCoord (state) {
      if (state.deviceLocation) {
        const { longitude, latitude } = state.deviceLocation.coords
        return [longitude, latitude]
      }
      return [121.3183, 30.7149]
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
        state.mymap.removeLayer(aclayer.layer)
      }
      state[key].forEach(v => {
        v.selected = v === layer
      })
      state.activeLayer[key] = layer
      state.mymap.addLayer(layer.layer)
    },
    addLayer (state, { key, layer }) {
      const aclayers = state.activeLayer[key]
      const i = aclayers.indexOf(layer)
      if (i < 0) {
        layer.selected = true
        state.mymap.addLayer(layer.layer)
        aclayers.push(layer)
      } else {
        layer.selected = false
        state.mymap.removeLayer(layer.layer)
        aclayers.splice(i, 1)
      }
    },
    tileloadend (state, { key, layer }) {

    },
    _setCurLocation (state, coord) {
      coord = fromLonLat(coord)
      if (!state.curlocallayer) {
        state.curlocallayer = loadClass.vector(
          {
            icon: {
              url: state.icons.curIcon
            }
          }
        )
        state.curlocallayer.setMap(state.mymap)
        state.curlocation = loadClass.pointFeature(coord, {
          name: 'curlocation'
        })
        state.curlocallayer.getSource().addFeature(state.curlocation)
      } else {
        state.curlocation.getGeometry().setCoordinates(coord)
      }
    },
    _movetoPoint ({ view }, { lonlat, coord, zoom, duration = 1000 }) {
      if (lonlat) {
        coord = fromLonLat(lonlat)
      }
      view.animate({
        center: coord,
        zoom: zoom || view.getZoom(),
        duration
      })
    }
  },
  actions: {
    _switchTile (store, tile) {
      store.commit('switchLayer', { key: 'tiles', layer: tile })
    },
    _switchApplayer (store, layer) {
      store.commit('switchLayer', { key: 'applayers', layer })
    },
    _addEllayer (store, layer) {
      store.commit('addLayer', { key: 'ellayers', layer })
    },
    async loadIcons (store) {
      store.state.icons = await axios.get('/getmapicons')
    },
    async loadLayers (store) {
      const state = store.state
      const keys = {
        tiles: {
          arg: [state.bingKey],
          evt: ['switchLayer', 'tileloadend']
        },
        applayers: {
          evt: ['switchLayer']
        },
        ellayers: {
          evt: ['addLayer']
        }
      }
      await Promise.all(Object.keys(keys).map(async v => {
        const { arg, evt } = keys[v]
        const data = await axios.get('/get' + v)
        if (data.length) {
          data.forEach(l => {
            l.layer = loadClass[l.loadType](l.param, arg)
            if (l.selected) {
              store.commit(evt[0], { key: v, layer: l })
            }
          })
        }
        state[v] = data
      }))
    },
    async _init (store, { el }) {
      const state = store.state
      const view = new View({
        center: fromLonLat([121.3183, 30.7149]),
        zoom: 15
      })
      // view.on('change', ({ target: view }) => {
      //   console.log(view.getZoom())
      // })
      const map = new Map({
        target: el,
        view: view,
        controls: defaults({ attribution: false }).extend([
          new ScaleLine()
        ])
      })
      //
      map.on('singleclick', e => {
        const pixel = e.pixel.map(function (v) {
          return v - 5
        })
        const f = map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature
        })
        if (!f) {
          state.fullMap = !state.fullMap
        }
      })
      state.el = el
      state.mymap = map
      state.view = view

      await store.dispatch('loadLayers')
      await store.dispatch('loadIcons')
    }
  }
}
