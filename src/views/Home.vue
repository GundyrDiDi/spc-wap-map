<template>
  <div id="home" ref="home" :class="appear">
    <ol-map ref="map"></ol-map>
    <div id="viewport" ref="viewport">
      <transition name="el-zoom-in-top">
        <component :is="searchbox"></component>
      </transition>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import olMap from '../components/ol-map.vue'
import searchBox from '../components/search-box.vue'

export default {
  name: 'Home',
  data () {
    return {
      appear: '',
      appearDuration: 2000,
      searchbox: ''
    }
  },
  components: {
    olMap,
    searchBox
  },
  computed: {

  },
  async mounted () {
    const { delay, oy } = this.$route.params
    if (oy && delay) {
      await new Promise(resolve => {
        this.$refs.home.style.marginTop = `${-oy}px`
        this.$refs.map.$el.style.marginTop = `${oy}px`
        setTimeout(() => {
          this.appear = 'zoom'
          setTimeout(() => {
            this.$refs.map.$el.style.marginTop = 0
            this.$refs.home.style.marginTop = 0
            this.$refs.home.style.height = '100vh'
            this.$refs.home.style.width = '100vw'
            resolve(true)
          }, this.appearDuration)
        }, this.$route.params.delay)
      })
    }
    this.appear = 'static'
    this.searchbox = 'searchBox'
  }
}

</script>

<style>
  #home{
    position: absolute;
    width: 120vh;
    height: 120vh;
    z-index:2;
    overflow: hidden;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content:center;
    box-shadow:0 0px 2px 2px rgba(0,0,0,.2);
  }
  #home.zoom{
    border-radius:50%;
    animation:zoomIn 2s ease-in-out;
    opacity: 1;
  }
  @keyframes zoomIn{
    from{
      height:.5rem;
      width:.5rem;
    }
    to{
      height:120vh;
      width:120vh;
    }
  }
  #home.static{
    opacity: 1;
  }
  #viewport{
    z-index:1;
    position: absolute;
    height:100vh;
    width:100vw;
    pointer-events: none;
  }
  #viewport>*{
    pointer-events: auto;
  }
</style>
