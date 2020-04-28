<template>
  <div id="map" :style="containerStyle">
    <div ref="highlay">
      <img class="actIcon" :src="icons.actIcon" alt="">
      <div></div>
    </div>
    <div ref="tablelay"></div>
  </div>
</template>

<script>
import 'ol/ol.css'

export default {
  name: 'Map',
  data () {
    return {
      highlay: {
        positioning: 'bottom-center',
        className: 'animated fast bounceIn',
        insertFirst: false
      },
      tablelay: {}
    }
  },
  computed: {
    containerStyle () {
      return {
        height: 1.2 * this.deviceHeight + 'px',
        width: 1.2 * this.deviceHeight + 'px'
      }
    }
  },
  watch: {
    deviceCoord: {
      handler (c) {
        setTimeout(() => {
          this.map_setCurLocation(c)
        }, 2000)
      },
      immediate: true
    },
    actLocation (loc) {
      if (loc) {
        this.highlay.setPosition(undefined)
        setTimeout(() => {
          this.highlay.setPosition(loc.center)
        }, 200)
      } else {
        this.highlay.setPosition(undefined)
      }
    }
  },
  async mounted () {
    requestAnimationFrame(async () => {
      await this.map_init({
        el: this.$el
      })
      Object.entries(this.$refs).forEach(([k, element]) => {
        if (element.$el)element = element.$el
        this.map_createOverlay({ element, ...this[k] }).then(o => {
          this[k] = o
        })
      })
    })
    this.map_getdata()
  }
}

</script>

<style scoped>
  #map {
    position: absolute;
    background: rgb(4, 153, 212);
    transition: transform .3s;
  }

  /* .ol-zoom {
    top: 15vh;
    left: 33vh;
  } */

  .ol-control button {
    display: block;
    background: #fff;
    color: #333;
    padding: 0;
    font-size: 1.14em;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    height: 1.375em;
    width: 1.375em;
    line-height: .4em;
    border: none;
    border-radius: 2px;
  }

  .ol-zoom.ol-control {
    box-shadow: 0 2px 5px 2px rgba(0, 0, 0, .2);
    background: #eee;
    padding: 0;
    transition: all .3s ease-in-out;
  }

  .ol-zoom.ol-control.collapse {
    bottom: 16%;
  }

  .ol-zoom.ol-control.collapse.muchup {
    bottom: 29%;
  }

  .ol-rotate.ol-control.collapse {
    bottom: 20%;
  }

  .ol-rotate.ol-control {
    bottom: 7%;
    left: 3%;
    box-shadow: 0 2px 5px 2px rgba(0, 0, 0, .2);
    background: #eee;
    padding: 0;
    transition: all .3s ease-in-out;
  }

  .ol-zoom.ol-control>button {
    color: #333;
    background: #eee;
    margin: 0;
  }

  .ol-zoom.ol-control>button:first-child {
    border-radius: 4px 4px 0 0;
  }

  .ol-zoom.ol-control>button:last-child {
    border-radius: 0 0 4px 4px;
  }

  .ol-zoom.ol-control>button:hover {
    background: #aaa;
  }

  .ol-scale-line.ol-unselectable {
    bottom: 11vh;
    left: 33vh;
    background: none;
  }

  .ol-scale-line-inner {
    border: 2px solid #333;
    border-top: none;
    color: #333;
  }
  /* 3d */
  /* canvas{
    transform: rotateX(64deg) rotateZ(50deg);
  } */
  .actIcon{
    width:42px;
    height:42px;
    margin-bottom:3px;
    position:relative;
    z-index:1;
    /* filter:drop-shadow(0 0 2px rgba(1, 47, 250, 0.37)); */
    filter:drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3))
  }
  .actIcon~div{
    position: absolute;
    height: 20px;
    width: 20px;
    background: #fff;
    top: 8px;
    left: 12px;
  }
</style>
