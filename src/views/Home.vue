<template>
  <div id="home" :class="appear">
    <ol-map ref="map"></ol-map>
    <div id="viewport" ref="viewport">
      <div v-if="enter" class="right-top flex-column">
        <transition appear enter-active-class="animated zoomIn" leave-active-class="animated rotateOut">
          <el-button circle key="msg" class="shadow">
            <img src="../assets/funimg/m3.png" alt="">
          </el-button>
        </transition>
        <transition appear enter-active-class="animated zoomIn" leave-active-class="animated rotateOut">
          <el-button circle key="tiles" class="shadow">
            <img src="../assets/funimg/l2.png" alt="">
          </el-button>
        </transition>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import olMap from '../components/ol-map.vue'

export default {
  name: 'Home',
  data () {
    return {
      enter: false,
      appear: '',
      appearDuration: 1300,
      searchbox: ''
    }
  },
  components: {
    olMap
  },
  computed: {

  },
  async mounted () {
    const { delay, oy } = this.$route.params
    if (oy && delay) {
      await new Promise(resolve => {
        this.$el.style.marginTop = `${-oy}px`
        this.$refs.map.$el.style.marginTop = `${oy}px`
        setTimeout(() => {
          this.appear = 'zoom'
          this.$el.style.animation = `enterAnim ${this.appearDuration / 1000}s ease-in-out`
          setTimeout(() => {
            this.$refs.map.$el.style.marginTop = 0
            this.$el.style.marginTop = 0
            this.$el.style.height = '100vh'
            this.$el.style.width = '100vw'
            this.$el.style.animation = ''
            resolve(true)
          }, this.appearDuration)
        }, this.$route.params.delay)
      })
    }
    this.appear = 'static'
    this.searchbox = 'searchBox'
    this.enter = true
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
    box-shadow:0 0px 2px 1px rgba(0,0,0,.2);
  }
  #home.zoom{
    border-radius:50%;
    opacity: 1;
  }
  @keyframes enterAnim{
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
    /* margin-top:2vh; */
    z-index:1;
    position: absolute;
    height:100vh;
    width:100vw;
    pointer-events: none;
  }
  #viewport>*{
    pointer-events: auto;
  }
  #viewport .right-top{
    display: flex;
    flex-direction: column;
  }
  #viewport .right-top>button{
    margin:.3rem;
  }
  #viewport .right-top img{
    width:1.4rem;
    height:1.4rem;
  }
</style>
