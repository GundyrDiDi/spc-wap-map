import Map from 'ol/Map'
import View from 'ol/View'
export default {
  name: 'map',
  namespaced: true,
  state: {
    mymap: 'undefined',
    el: undefined,
    view: undefined,
    layers: []
  },
  mutations: {
    init (state, {
      el
    }) {
      state.el = el
      state.view = new View({
        center: [-6655.5402445057125, 6709968.258934638],
        zoom: 13
      })
      state.mymap = new Map({
        layers: [],
        target: state.el,
        view: state.view
      })
    }

  },
  actions: {}
}
