<template>
  <div id="map" ref="el">
  </div>
</template>

<script>
import 'ol/ol.css'

export default {
  name: 'olMap',
  mounted () {
    this.map_init({ el: this.$refs.el })
  }
}
</script>

<style scoped>
  #map {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:#000;
  }
</style>
