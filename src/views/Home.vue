<template>
  <div id="home" :class="appear" class="flex-center">
    <ol-map ref="map"></ol-map>
    <div v-if="enter" id="viewport">
      <div id="subport" :style="subportStyle">
        <div class="right-top">
          <transition appear enter-active-class="animated fast  zoomIn" leave-active-class="animated fast fadeOutUp">
            <el-button circle class="shadow" v-show="!fullMap">
              <img src="../assets/funimg/m1.png" alt="" style="transform:scale(1.2)">
            </el-button>
          </transition>
          <transition appear enter-active-class="animated fast zoomIn" leave-active-class="animated fast fadeOutUp">
            <el-button circle class="shadow" v-show="!fullMap"
              @click="_rtlDrawer=true">
              <img src="../assets/funimg/l2.png" alt="">
            </el-button>
          </transition>
        </div>
        <transition enter-active-class="aaa">
          <div class="right-bottom" v-show="fullMap">
            <el-button circle class="shadow">
              <img src="../assets/funimg/d1.png" alt="">
            </el-button>
          </div>
        </transition>
        <transition appear
        enter-active-class="animated fast slideInUpCustom"
        leave-active-class="animated fast slideOutDownCustom">
          <topic-menu v-show="!fullMap">
            <template v-slot:default="{slides}">
            <div class="right-top" :style="slides[3]">
              <transition appear enter-active-class="animated fast rotateIn" leave-active-class="animated fast rotateOut">
                <el-button circle class="shadow" v-show="!fullMap">
                  <img src="../assets/funimg/r2.png" alt="">
                </el-button>
              </transition>
              <transition appear enter-active-class="animated fast  rotateIn">
                <el-button circle class="shadow">
                  <img src="../assets/funimg/d1.png" alt="">
                </el-button>
              </transition>
            </div>
            </template>
          </topic-menu>
        </transition>
      </div>
    </div>
    <swiper-drawer
      :visible.sync="_rtlDrawer"
      :show-close="false"
      :with-header="false"
      direction="rtl"
      size="70%"
    >
      <div>
            1111111
      </div>
    </swiper-drawer>
  </div>
</template>

<script>
import olMap from '../components/ol-map.vue'
import topicMenu from '../components/topic-menu.vue'
import swiperDrawer from '../components/swiper-drawer.vue'

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
        if (value) {
          this._record({ type: 'rtlDrawer', value })
        } else {
          this._goback()
        }
      }
    },
    subportStyle () {
      return {
        height: this.vpHeight + 'px',
        marginTop: this.stateBar + 'px',
        borderTop: '2px solid red'
      }
    }
  },
  components: {
    olMap,
    topicMenu,
    swiperDrawer
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
            this.$el.style.animation = ''
            resolve(true)
          }, this.appearDuration)
        }, this.$route.params.delay)
      })
    }
    this.appear = 'static'
    this.searchbox = 'searchBox'
    this.enter = true
  },
  watch: {

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
    box-shadow: 0 0px 2px 1px rgba(0, 0, 0, .2);
  }

  #home.zoom {
    border-radius: 50%;
    opacity: 1;
    z-index: 2;
  }

  #home.static {
    opacity: 1;
    height:inherit;
    width:inherit;
  }

  #viewport {
    z-index: 1;
    position: absolute;
    height: 100%;
    width: 100%;
    pointer-events: none;
  }

  #subport{
    position:absolute;
    width:100%;
    overflow: hidden;
  }
  #subport>* {
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
  }
  .center-bottom .right-top img, .right-bottom img{
    width: 1.5rem;
    height: 1.5rem;
  }
  .right-bottom>button{
    transform: translateY(-10px);
  }
  .aaa{
    opacity: 0;
    animation-delay: .75s;
  }
  @keyframes slideInUpCustom {
    from {
      transform: translate3d(0, 110px, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .slideInUpCustom {
    -webkit-animation-name: slideInUpCustom;
    animation-name: slideInUpCustom;
  }
  .slideOutDownCustom {
    -webkit-animation-name: slideOutDownCustom;
    animation-name: slideOutDownCustom;
  }
  @keyframes slideOutDownCustom {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    to {
      visibility: hidden;
      transform: translate3d(0, 110px, 0);
    }
  }
</style>
