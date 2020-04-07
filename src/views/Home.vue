<template>
  <div id="home" :class="appear">
    <ol-map ref="map"></ol-map>
    <div v-if="enter" id="viewport" ref="viewport">
      <div class="right-top">
        <transition appear enter-active-class="animated fast  zoomIn" leave-active-class="animated fast fadeOutUp">
          <el-button circle class="shadow" v-show="!fullMap">
            <img src="../assets/funimg/m1.png" alt="" style="transform:scale(1.2)">
          </el-button>
        </transition>
        <transition appear enter-active-class="animated fast zoomIn" leave-active-class="animated fast fadeOutUp">
          <el-button circle class="shadow" v-show="!fullMap"
            @click="$store.commit('rtlDrawer',true)">
            <img src="../assets/funimg/l2.png" alt="">
          </el-button>
        </transition>
      </div>
      <transition appear enter-active-class="animated fast slideInUp" leave-active-class="animated fast slideOutDown">
        <div class="center-bottom" v-show="!fullMap">
          <div class="right-top">
            <transition appear enter-active-class="animated fast rotateIn" leave-active-class="animated fast rotateOut">
              <el-button circle class="shadow" v-show="!fullMap">
                <img src="../assets/funimg/r2.png" alt="">
              </el-button>
            </transition>
            <transition appear enter-active-class="animated fast  rotateIn" leave-active-class="animated fadeOutDown">
              <el-button circle class="shadow">
                <img src="../assets/funimg/d1.png" alt="">
              </el-button>
            </transition>
          </div>
          <topic-menu></topic-menu>
        </div>
      </transition>
      <transition enter-active-class="aaa">
        <div class="right-bottom" v-show="fullMap">
          <el-button circle class="shadow">
            <img src="../assets/funimg/d1.png" alt="">
          </el-button>
        </div>
      </transition>
    </div>
    <el-drawer
      :visible.sync="_rtlDrawer"
      direction="rtl"
    >
    <el-container>
      <el-main>

      </el-main>
    </el-container>
  </el-drawer>
  </div>
</template>

<script>
import olMap from '../components/ol-map.vue'
import topicMenu from '../components/topic-menu.vue'

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
  computed: {
    _rtlDrawer: {
      get () {
        return this.rtlDrawer
      },
      set (value) {
        this.$store.commit('rtlDrawer', value)
      }
    }
  },
  components: {
    olMap,
    topicMenu
  },
  async mounted () {
    const {
      delay,
      oy
    } = this.$route.params
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
  @keyframes enterAnim {
    from {
      height: .5rem;
      width: .5rem;
    }

    to {
      height: 120vh;
      width: 120vh;
    }
  }

</style>
<style scoped>
  #home {
    position: absolute;
    width: 120vh;
    height: 120vh;
    overflow: hidden;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0px 2px 1px rgba(0, 0, 0, .2);
  }

  #home.zoom {
    border-radius: 50%;
    opacity: 1;
    z-index: 2;
  }

  #home.static {
    opacity: 1;
  }

  #viewport {
    margin-top: 3vh;
    z-index: 1;
    position: absolute;
    height: 97vh;
    width: 100vw;
    pointer-events: none;
  }

  .wrapper {
    pointer-events: none;
  }

  #viewport>* {
    pointer-events: auto;
  }

  [class^="right"]>button {
    display: block;
    margin: 0.7rem .5rem 0 0;
    border: none;
  }

  .right-top img {
    width: 1.1rem;
    height: 1.1rem;
  }

  .center-bottom {
    width: 100%;
    z-index:1;
  }

  .center-bottom:after {
    content: '';
    clear: both;
  }
  .center-bottom .right-top{
    transform: translateY(-100%);
    top:-3vh;
  }
  .center-bottom .right-top img, .right-bottom img{
    width: 1.5rem;
    height: 1.5rem;
  }
  .right-bottom>button{
    transform: translateY(-3vh);
  }
  .aaa{
    opacity: 0;
    animation-delay: .75s;
  }

</style>
