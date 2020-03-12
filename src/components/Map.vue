<template>
  <div id="map">
  </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'

export default {
  name: 'Map',
  data () {
    return {
      map: undefined
    }
  },
  mounted () {
    this.map = new Map({
      layers: [],
      target: 'map',
      view: new View({
        center: [-6655.5402445057125, 6709968.258934638],
        zoom: 13
      })
    })
  }
}
</script>

<style scoped>
  #map {
    height: 100px;
    background: red;
  }
</style>
