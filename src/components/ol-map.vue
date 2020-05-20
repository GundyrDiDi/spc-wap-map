<template>
  <div id="map" :style="containerStyle">
    <template v-if="!preload">
      <div ref="highlay">
        <img class="actIcon" :src="icons.actIcon" alt="">
        <div></div>
      </div>
      <div ref="tablelay"></div>
      <div ref="measurelay" @click="removelast">
        <div class="measure flex">
          <div v-show="mspoints.length==1" class="flex-center">
            起点
          </div>
          <div v-show="mspoints.length>1" class="flex-center">
            {{distance}}
          </div>
          <div>
            <i class="el-icon-close"></i>
          </div>
        </div>
      </div>
    </template>
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
      measurelay: {
        positioning: 'bottom-center',
        insertFirst: false,
        offset: [0, -13]
      },
      distance: 0,
      tablelay: {},
      savecenter: null,
      savezoom: null
    }
  },
  computed: {
    containerStyle () {
      return {
        height: 1.2 * this.deviceHeight + 'px',
        width: 1.2 * this.deviceHeight + 'px',
        pointerEvents: this.preload ? 'none' : 'auto',
        opacity: this.preload ? 0 : 1
      }
    }
  },
  watch: {
    deviceCoord: {
      handler (c) {
        if (!this.preload) {
          setTimeout(() => {
            this.map_setCurLocation(c)
          }, 2000)
        }
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
    },
    async mspoints (msp) {
      if (msp.length) {
        const coord = msp[msp.length - 1]
        this.measurelay.setPosition(coord)
        if (msp.length > 1) {
          const g = msp.line.getGeometry()
          g.setCoordinates(msp)
          this.distance = await this.map_getDistance(g)
        }
      } else {
        this.measurelay.setPosition(undefined)
      }
    },
    mapstatus (status, oldstatus) {
      if (this.savecenter) {
        if (!this.searchLoad) {
          this.map_movetoPoint({
            coord: this.savecenter,
            zoom: this.savezoom,
            duration: 500
          })
        }
        this.savecenter = null
        this.savezoom = null
      }
      if (status) {
        this.savecenter = this.view.getCenter()
        this.savezoom = this.view.getZoom()
        this.$store.commit('map/fullMap', true)
        this.map_clearactlay()
      }
      if (status === 'road') {
        this.map_showRoad()
      } else if (status === 'mark') {
        this.map_showMark()
      } else if (status === 'measure') {
        this.map_showMeasure()
      } else if (status === 'surround') {
        this.map_showMark()
      } else {
        if (oldstatus === 'road') this.map_showRoad()
        if (oldstatus === 'mark') this.map_showMark()
        if (oldstatus === 'measure') this.map_showMeasure()
        if (oldstatus === 'surround') this.map_showMark()
        if (status === 'pointslist') {
          this.map_addactlay()
        } else {
          this.$store.commit('map/fullMap', false)
          setTimeout(() => {
            this.map_addactlay()
          }, 500)
        }
      }
    }
  },
  methods: {
    removelast () {
      this.measure.getSource().removeFeature(this.mspoints.pop().f)
      this.mspoints.line.getGeometry().setCoordinates(this.mspoints)
    }
  },
  async mounted () {
    requestAnimationFrame(async () => {
      if (this.preload) {
        this.map_preload({
          el: this.$el
        })
      } else {
        await this.map_init({
          el: this.$el
        })
        Object.entries(this.$refs).forEach(([k, element]) => {
          if (element.$el)element = element.$el
          this.map_createOverlay({ element, ...this[k] }).then(o => {
            this[k] = o
            element.style.display = 'block'
          })
        })
      }
      this.map_getdata()
    })
  },
  props: ['preload']
}

</script>

<style scoped>
  #map {
    position: absolute;
    transition: transform .3s;
    background-color: #f2f2f2;
    background-image:
                    linear-gradient(
                            to bottom,
                            #ddd 1px,
                            transparent 2px
                    ),
                    linear-gradient(
                            to right,
                            #ddd 1px,
                            transparent 2px
                    );
    background-size: 5vmin 5vmin;
  }
  #map>div{
    display: none;
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
  .measure{
    background: #fff;
    border: 2px solid var(--bdcolor);
    border-radius: 4px;
    /* transform:translateY(-5px) */
  }
  .measure:after,.measure:before{
    content:'';
    height:0;
    width:0;
    position:absolute;
  }
  .measure:before{
    border:10px solid transparent;
    border-top-color:var(--bdcolor);
    bottom:-19.5px;
    left: calc(50% - 10px);
  }
  .measure:after{
    border:8px solid transparent;
    border-top-color:#fff;
    bottom:-13px;
    left: calc(50% - 8px);
  }
  .measure>div{
    padding:2px 3px;
  }
  .measure>div:not(:last-child){
    padding:2px 6px;
    font-size: var(--smallsize);
    border-right:1px solid var(--bdcolor);
    min-width:50px;
    letter-spacing:0;
  }
  .measure>div:last-child{
    color:var(--bdcolor)
  }
</style>
