import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'

import { defaults, ScaleLine } from 'ol/control'

export default {
  namespaced: true,
  state: {
    el: undefined,
    mymap: 'undefined',
    view: undefined,
    layers: [],
    fullMap: false

  },
  mutations: {
    _init (state, { el }) {
      const layers = []
      layers.push(new TileLayer({
        source: new OSM()
      }))
      const view = new View({
        center: fromLonLat([121.3183, 30.7149]),
        zoom: 11
      })
      const map = new Map({
        layers: layers,
        target: el,
        view: view,
        controls: defaults({ attribution: false }).extend([
          new ScaleLine()
        ])
      })
      //
      map.on('click', e => {
        // console.log(e);
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
      // view.on('change', ({ target: view }) => {
      //   console.log(view.getZoom())
      // })
      //
      state.el = el
      state.mymap = map
      state.view = view
      state.layers = layers
    }

  },
  actions: {

  }
}
