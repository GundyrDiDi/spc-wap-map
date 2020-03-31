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
    layers: []
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
      const mymap = new Map({
        layers: layers,
        target: el,
        view: view,
        controls: defaults({ attribution: false }).extend([
          new ScaleLine()
        ])
      })
      view.on('change', e => {

      })
      //
      state.el = el
      state.mymap = mymap
      state.view = view
      state.layers = layers
    }

  },
  actions: {

  }
}
